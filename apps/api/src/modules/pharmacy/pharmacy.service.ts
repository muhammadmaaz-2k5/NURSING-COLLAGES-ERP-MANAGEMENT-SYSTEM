import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TransactionService } from '../../common/database/transaction.service';
import { AuditService } from '../../common/audit/audit.service';
import { JobsService } from '../../common/jobs/jobs.service';
import { Cacheable, CacheEvict, TTL_PRESETS } from '../../common/cache';
import { MedicineMovementType } from '@prisma/client';
import { createPaginatedResult, PaginatedResult } from '../../common/interfaces/pagination.interface';

export interface CreateMedicineDto {
  name: string;
  genericName?: string;
  category?: string;
  strength?: string;
  dosageForm?: string;
  manufacturer?: string;
  unit?: string;
  reorderLevel?: number;
  purchasePrice?: number;
  sellingPrice?: number;
}

export interface AddStockBatchDto {
  medicineId: string;
  batchNumber: string;
  quantity: number;
  expiryDate: string;
  purchasePrice: number;
  sellingPrice: number;
  notes?: string;
}

export interface StockAdjustmentDto {
  medicineId: string;
  batchId?: string;
  type: MedicineMovementType; // ADJUSTMENT_IN, ADJUSTMENT_OUT, RETURN, EXPIRED, DAMAGED
  quantity: number;
  reference?: string;
  notes?: string;
}

export interface DispenseItemDto {
  medicineId: string;
  batchId?: string;
  quantity: number;
  unitPrice?: number;
}

export interface DispensePrescriptionDto {
  patientId?: string;
  prescriptionId?: string;
  items: DispenseItemDto[];
  notes?: string;
}

@Injectable()
export class PharmacyService {
  private readonly logger = new Logger(PharmacyService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly txService: TransactionService,
    private readonly auditService: AuditService,
    private readonly jobsService: JobsService,
  ) {}

  private async getOrCreatePharmacy() {
    let pharmacy = await this.prisma.pharmacy.findFirst();
    if (!pharmacy) {
      pharmacy = await this.prisma.pharmacy.create({
        data: { name: 'Main Campus & Hospital Pharmacy', location: 'Ground Floor, Medical Complex' },
      });
    }
    return pharmacy;
  }

  // ----------------------------------------------------
  // CATALOG & MEDICINES
  // ----------------------------------------------------

  @Cacheable({
    key: 'pharmacy:overview:metrics',
    ttl: TTL_PRESETS.SHORT,
    tags: ['pharmacy'],
  })
  async getPharmacyOverview() {
    const pharmacy = await this.getOrCreatePharmacy();
    const today = new Date();
    const next60Days = new Date();
    next60Days.setDate(today.getDate() + 60);

    const [totalMedicines, medicines] = await Promise.all([
      this.prisma.medicine.count({ where: { pharmacyId: pharmacy.id } }),
      this.prisma.medicine.findMany({
        where: { pharmacyId: pharmacy.id },
        include: { batches: true },
      }),
    ]);

    let outOfStock = 0;
    let lowStock = 0;
    let expiringSoon = 0;
    let expired = 0;
    let totalInventoryValue = 0;

    for (const m of medicines) {
      if (m.quantity <= 0) outOfStock++;
      else if (m.quantity <= m.reorderLevel) lowStock++;

      for (const b of m.batches) {
        if (b.quantity > 0) {
          totalInventoryValue += b.quantity * Number(b.purchasePrice);
          if (b.expiryDate < today) {
            expired++;
          } else if (b.expiryDate <= next60Days) {
            expiringSoon++;
          }
        }
      }
    }

    return {
      totalMedicines,
      outOfStock,
      lowStock,
      expiringSoon,
      expired,
      totalInventoryValue: totalInventoryValue.toFixed(2),
    };
  }

  async getMedicines(query: { search?: string; category?: string; page?: number; limit?: number }): Promise<PaginatedResult<any>> {
    const pharmacy = await this.getOrCreatePharmacy();
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = { pharmacyId: pharmacy.id };
    if (query.category) where.category = query.category;

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { genericName: { contains: query.search, mode: 'insensitive' } },
        { manufacturer: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [total, data] = await Promise.all([
      this.prisma.medicine.count({ where }),
      this.prisma.medicine.findMany({
        where,
        include: {
          batches: {
            where: { quantity: { gt: 0 } },
            orderBy: { expiryDate: 'asc' },
          },
        },
        orderBy: { name: 'asc' },
        skip,
        take: limit,
      }),
    ]);

    return createPaginatedResult(data, total, page, limit);
  }

  async getMedicineById(id: string) {
    const medicine = await this.prisma.medicine.findUnique({
      where: { id },
      include: {
        batches: { orderBy: { expiryDate: 'asc' } },
        movements: { take: 20, orderBy: { createdAt: 'desc' } },
      },
    });
    if (!medicine) throw new NotFoundException('Medicine not found');
    return medicine;
  }

  @CacheEvict({ tags: ['pharmacy'] })
  async createMedicine(dto: CreateMedicineDto, userId?: string) {
    const pharmacy = await this.getOrCreatePharmacy();
    const medicine = await this.prisma.medicine.create({
      data: {
        pharmacyId: pharmacy.id,
        name: dto.name,
        genericName: dto.genericName,
        category: dto.category,
        strength: dto.strength,
        dosageForm: dto.dosageForm,
        manufacturer: dto.manufacturer,
        unit: dto.unit || 'Box',
        quantity: 0,
        reorderLevel: dto.reorderLevel || 10,
        purchasePrice: dto.purchasePrice,
        sellingPrice: dto.sellingPrice,
      },
    });

    await this.auditService.log({
      userId,
      action: 'MEDICINE_CREATE',
      entity: 'Medicine',
      entityId: medicine.id,
      newData: { name: dto.name, genericName: dto.genericName },
    });

    return medicine;
  }

  // ----------------------------------------------------
  // STOCK RECEIPT & BATCHES
  // ----------------------------------------------------

  /**
   * Transactionally add new stock batch & update aggregated quantity
   */
  @CacheEvict({ tags: ['pharmacy'] })
  async addStockBatch(dto: AddStockBatchDto, userId?: string) {
    const medicine = await this.prisma.medicine.findUnique({ where: { id: dto.medicineId } });
    if (!medicine) throw new NotFoundException('Medicine record not found');

    const expiry = new Date(dto.expiryDate);
    if (expiry <= new Date()) {
      throw new BadRequestException('Cannot receive an already expired medicine batch');
    }

    return this.txService.executeWithTransaction(async (tx) => {
      // 1. Create or update batch
      const batch = await tx.medicineBatch.upsert({
        where: {
          medicineId_batchNumber: {
            medicineId: dto.medicineId,
            batchNumber: dto.batchNumber,
          },
        },
        update: {
          quantity: { increment: dto.quantity },
          expiryDate: expiry,
          purchasePrice: dto.purchasePrice,
          sellingPrice: dto.sellingPrice,
        },
        create: {
          medicineId: dto.medicineId,
          batchNumber: dto.batchNumber,
          quantity: dto.quantity,
          expiryDate: expiry,
          purchasePrice: dto.purchasePrice,
          sellingPrice: dto.sellingPrice,
        },
      });

      // 2. Increment medicine total quantity
      const updatedMedicine = await tx.medicine.update({
        where: { id: dto.medicineId },
        data: {
          quantity: { increment: dto.quantity },
          purchasePrice: dto.purchasePrice,
          sellingPrice: dto.sellingPrice,
          expiryDate: expiry,
        },
      });

      // 3. Record stock movement
      await tx.medicineStockMovement.create({
        data: {
          medicineId: dto.medicineId,
          batchId: batch.id,
          type: MedicineMovementType.PURCHASE,
          quantity: dto.quantity,
          notes: dto.notes || `Stock received into Batch ${dto.batchNumber}`,
          performedBy: userId,
        },
      });

      await this.auditService.log({
        userId,
        action: 'BATCH_RECEIVE',
        entity: 'MedicineBatch',
        entityId: batch.id,
        newData: {
          medicineName: medicine.name,
          batchNumber: dto.batchNumber,
          quantity: dto.quantity,
          expiryDate: dto.expiryDate,
        },
      });

      return { batch, currentStock: updatedMedicine.quantity };
    });
  }

  // ----------------------------------------------------
  // TRANSACTIONAL DISPENSING (SOURCE OF TRUTH: POSTGRESQL)
  // ----------------------------------------------------

  /**
   * Invariant: Never allow concurrent dispensing to produce negative stock.
   * Atomically validate stock -> decrement batch & total -> record movement -> record dispensing.
   */
  @CacheEvict({ tags: ['pharmacy'] })
  async dispenseMedicines(dto: DispensePrescriptionDto, userId?: string) {
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('At least one item must be specified for dispensing');
    }

    const pharmacy = await this.getOrCreatePharmacy();
    const today = new Date();

    return this.txService.executeWithTransaction(async (tx) => {
      let totalBillAmount = 0;
      const dispensedItemsData: any[] = [];

      for (const item of dto.items) {
        // Fetch medicine directly inside transaction
        const medicine = await tx.medicine.findUnique({
          where: { id: item.medicineId },
          include: {
            batches: {
              where: { quantity: { gt: 0 }, expiryDate: { gt: today } },
              orderBy: { expiryDate: 'asc' }, // FIFO: Dispense earliest expiring first
            },
          },
        });

        if (!medicine) throw new NotFoundException(`Medicine ID ${item.medicineId} not found`);
        if (medicine.quantity < item.quantity) {
          throw new ConflictException(
            `Insufficient stock for "${medicine.name}". Requested: ${item.quantity}, Available: ${medicine.quantity}`,
          );
        }

        let remainingToDispense = item.quantity;
        const unitPrice = item.unitPrice || Number(medicine.sellingPrice || medicine.purchasePrice || 0);

        // If specific batch requested
        if (item.batchId) {
          const specificBatch = medicine.batches.find((b) => b.id === item.batchId);
          if (!specificBatch) {
            throw new NotFoundException(`Requested batch is not available or has expired for ${medicine.name}`);
          }
          if (specificBatch.quantity < item.quantity) {
            throw new ConflictException(
              `Insufficient quantity in batch ${specificBatch.batchNumber}. Available: ${specificBatch.quantity}`,
            );
          }

          // Decrement batch
          await tx.medicineBatch.update({
            where: { id: specificBatch.id },
            data: { quantity: { decrement: item.quantity } },
          });

          // Record movement
          await tx.medicineStockMovement.create({
            data: {
              medicineId: medicine.id,
              batchId: specificBatch.id,
              type: MedicineMovementType.DISPENSE,
              quantity: -item.quantity,
              reference: dto.prescriptionId,
              performedBy: userId,
            },
          });

          dispensedItemsData.push({
            medicineId: medicine.id,
            batchId: specificBatch.id,
            quantity: item.quantity,
            unitPrice,
            totalPrice: unitPrice * item.quantity,
          });
        } else {
          // Auto-allocate across FIFO batches
          for (const batch of medicine.batches) {
            if (remainingToDispense <= 0) break;

            const takeQty = Math.min(batch.quantity, remainingToDispense);
            await tx.medicineBatch.update({
              where: { id: batch.id },
              data: { quantity: { decrement: takeQty } },
            });

            await tx.medicineStockMovement.create({
              data: {
                medicineId: medicine.id,
                batchId: batch.id,
                type: MedicineMovementType.DISPENSE,
                quantity: -takeQty,
                reference: dto.prescriptionId,
                performedBy: userId,
              },
            });

            dispensedItemsData.push({
              medicineId: medicine.id,
              batchId: batch.id,
              quantity: takeQty,
              unitPrice,
              totalPrice: unitPrice * takeQty,
            });

            remainingToDispense -= takeQty;
          }

          if (remainingToDispense > 0) {
            throw new ConflictException(
              `Cannot dispense unexpired stock for ${medicine.name}. Expired or unavailable batches cannot be dispensed.`,
            );
          }
        }

        // Decrement overall medicine total
        const updatedMed = await tx.medicine.update({
          where: { id: medicine.id },
          data: { quantity: { decrement: item.quantity } },
        });

        // Trigger low stock warning via BullMQ if breached
        if (updatedMed.quantity <= updatedMed.reorderLevel) {
          await this.jobsService.dispatchNotification({
            userId: userId || 'system',
            title: `Low Medicine Stock Alert: ${medicine.name}`,
            message: `Current stock (${updatedMed.quantity} ${updatedMed.unit || 'units'}) has reached or fallen below reorder level (${updatedMed.reorderLevel}). Please reorder stock immediately.`,
            type: 'SYSTEM',
          });
        }


        totalBillAmount += unitPrice * item.quantity;
      }

      // Create permanent dispensing record
      const dispensingRecord = await tx.dispensingRecord.create({
        data: {
          pharmacyId: pharmacy.id,
          patientId: dto.patientId,
          prescriptionId: dto.prescriptionId,
          dispensedBy: userId,
          totalAmount: totalBillAmount,
          notes: dto.notes,
          items: {
            create: dispensedItemsData,
          },
        },
        include: { items: { include: { medicine: true } } },
      });

      await this.auditService.log({
        userId,
        action: 'MEDICINE_DISPENSE',
        entity: 'DispensingRecord',
        entityId: dispensingRecord.id,
        newData: {
          totalAmount: totalBillAmount,
          itemCount: dispensedItemsData.length,
          patientId: dto.patientId,
        },
      });

      return dispensingRecord;
    });
  }

  // ----------------------------------------------------
  // STOCK ADJUSTMENTS & AUDIT TRAILS
  // ----------------------------------------------------

  @CacheEvict({ tags: ['pharmacy'] })
  async adjustStock(dto: StockAdjustmentDto, userId?: string) {
    const medicine = await this.prisma.medicine.findUnique({ where: { id: dto.medicineId } });
    if (!medicine) throw new NotFoundException('Medicine not found');

    const isInbound =
      dto.type === MedicineMovementType.PURCHASE || dto.type === MedicineMovementType.ADJUSTMENT_IN || dto.type === MedicineMovementType.RETURN;
    const delta = isInbound ? Math.abs(dto.quantity) : -Math.abs(dto.quantity);

    if (!isInbound && medicine.quantity < Math.abs(dto.quantity)) {
      throw new BadRequestException('Cannot reduce stock below 0');
    }

    return this.txService.executeWithTransaction(async (tx) => {
      if (dto.batchId) {
        const batch = await tx.medicineBatch.findUnique({ where: { id: dto.batchId } });
        if (batch) {
          if (!isInbound && batch.quantity < Math.abs(dto.quantity)) {
            throw new BadRequestException('Batch quantity cannot be reduced below 0');
          }
          await tx.medicineBatch.update({
            where: { id: dto.batchId },
            data: { quantity: { increment: delta } },
          });
        }
      }

      const updated = await tx.medicine.update({
        where: { id: dto.medicineId },
        data: { quantity: { increment: delta } },
      });

      const movement = await tx.medicineStockMovement.create({
        data: {
          medicineId: dto.medicineId,
          batchId: dto.batchId,
          type: dto.type,
          quantity: delta,
          reference: dto.reference,
          notes: dto.notes,
          performedBy: userId,
        },
      });

      await this.auditService.log({
        userId,
        action: 'STOCK_ADJUSTMENT',
        entity: 'MedicineStockMovement',
        entityId: movement.id,
        newData: { medicine: medicine.name, type: dto.type, delta, currentStock: updated.quantity },
      });

      return { movement, currentStock: updated.quantity };
    });
  }

  // ----------------------------------------------------
  // REPORTS: EXPIRY & LOW STOCK
  // ----------------------------------------------------

  async getExpiringMedicines(daysAhead: number = 60) {
    const pharmacy = await this.getOrCreatePharmacy();
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + daysAhead);

    return this.prisma.medicineBatch.findMany({
      where: {
        medicine: { pharmacyId: pharmacy.id },
        quantity: { gt: 0 },
        expiryDate: { gte: today, lte: futureDate },
      },
      include: { medicine: true },
      orderBy: { expiryDate: 'asc' },
    });
  }

  async getExpiredMedicines() {
    const pharmacy = await this.getOrCreatePharmacy();
    const today = new Date();

    return this.prisma.medicineBatch.findMany({
      where: {
        medicine: { pharmacyId: pharmacy.id },
        quantity: { gt: 0 },
        expiryDate: { lt: today },
      },
      include: { medicine: true },
      orderBy: { expiryDate: 'asc' },
    });
  }

  async getLowStockMedicines() {
    const pharmacy = await this.getOrCreatePharmacy();
    const medicines = await this.prisma.medicine.findMany({
      where: { pharmacyId: pharmacy.id },
      include: { batches: true },
      orderBy: { quantity: 'asc' },
    });

    return medicines.filter((m) => m.quantity <= m.reorderLevel);
  }

  async getStockMovements(medicineId?: string) {
    return this.prisma.medicineStockMovement.findMany({
      where: medicineId ? { medicineId } : undefined,
      include: { medicine: true, batch: true },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }
}

