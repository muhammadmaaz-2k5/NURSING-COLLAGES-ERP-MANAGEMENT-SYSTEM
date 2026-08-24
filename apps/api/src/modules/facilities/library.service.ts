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
import { BookCopyStatus, IssueStatus } from '@prisma/client';
import { createPaginatedResult, PaginatedResult } from '../../common/interfaces/pagination.interface';

export interface CreateBookDto {
  title: string;
  author?: string;
  publisher?: string;
  isbn?: string;
  category?: string;
  edition?: string;
  copiesCount?: number;
}

export interface AddBookCopyDto {
  bookId: string;
  accessionNo: string;
  condition?: string;
}

export interface IssueBookDto {
  bookId: string;
  copyId?: string;
  studentId: string;
  dueDays?: number; // default 14 days
}

export interface ReturnBookDto {
  condition?: string;
  fineAmount?: number;
  waiveFine?: boolean;
}

@Injectable()
export class LibraryService {
  private readonly logger = new Logger(LibraryService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly txService: TransactionService,
    private readonly auditService: AuditService,
    private readonly jobsService: JobsService,
  ) {}

  private async getOrCreateLibrary() {
    let lib = await this.prisma.library.findFirst();
    if (!lib) {
      lib = await this.prisma.library.create({
        data: { name: 'Central Medical & Nursing Library', location: 'Academic Block, 1st Floor' },
      });
    }
    return lib;
  }

  // ----------------------------------------------------
  // OVERVIEW & METRICS
  // ----------------------------------------------------

  @Cacheable({
    key: 'library:overview:metrics',
    ttl: TTL_PRESETS.SHORT,
    tags: ['library'],
  })
  async getLibraryDashboard() {
    const library = await this.getOrCreateLibrary();
    const today = new Date();

    const [totalTitles, totalPhysicalCopies, issuedCopies, overdueIssues, membersCount] = await Promise.all([
      this.prisma.libraryBook.count({ where: { libraryId: library.id } }),
      this.prisma.bookCopy.count({ where: { book: { libraryId: library.id } } }),
      this.prisma.bookCopy.count({ where: { book: { libraryId: library.id }, status: BookCopyStatus.ISSUED } }),
      this.prisma.libraryIssue.count({
        where: {
          libraryId: library.id,
          status: IssueStatus.ISSUED,
          dueDate: { lt: today },
        },
      }),
      this.prisma.libraryMember.count({ where: { libraryId: library.id } }),
    ]);

    const availableCopies = Math.max(0, totalPhysicalCopies - issuedCopies);

    return {
      totalTitles,
      totalPhysicalCopies,
      availableCopies,
      issuedCopies,
      overdueIssues,
      registeredMembers: membersCount,
    };
  }

  // ----------------------------------------------------
  // BOOK CATALOG & COPIES
  // ----------------------------------------------------

  async getBooks(query: { search?: string; category?: string; page?: number; limit?: number }): Promise<PaginatedResult<any>> {
    const library = await this.getOrCreateLibrary();
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = { libraryId: library.id };
    if (query.category) where.category = query.category;

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { author: { contains: query.search, mode: 'insensitive' } },
        { isbn: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [total, data] = await Promise.all([
      this.prisma.libraryBook.count({ where }),
      this.prisma.libraryBook.findMany({
        where,
        include: {
          copies: true,
          _count: { select: { issues: { where: { status: IssueStatus.ISSUED } } } },
        },
        orderBy: { title: 'asc' },
        skip,
        take: limit,
      }),
    ]);

    return createPaginatedResult(data, total, page, limit);
  }

  async getBookById(id: string) {
    const book = await this.prisma.libraryBook.findUnique({
      where: { id },
      include: {
        copies: true,
        issues: {
          where: { status: IssueStatus.ISSUED },
          include: { student: { include: { user: true } }, copy: true },
        },
      },
    });
    if (!book) throw new NotFoundException('Book not found');
    return book;
  }

  @CacheEvict({ tags: ['library'] })
  async createBook(dto: CreateBookDto, userId?: string) {
    const library = await this.getOrCreateLibrary();
    const copiesCount = dto.copiesCount || 1;

    return this.txService.executeWithTransaction(async (tx) => {
      const book = await tx.libraryBook.create({
        data: {
          libraryId: library.id,
          title: dto.title,
          author: dto.author,
          publisher: dto.publisher,
          isbn: dto.isbn,
          category: dto.category,
          edition: dto.edition,
          totalCopies: copiesCount,
          availableCopies: copiesCount,
        },
      });

      // Generate initial physical copies with distinct accession barcodes
      const baseCode = (dto.isbn || dto.title.substring(0, 3)).toUpperCase().replace(/[^A-Z0-9]/g, '');
      for (let i = 1; i <= copiesCount; i++) {
        const accessionNo = `${baseCode}-${String(i).padStart(3, '0')}`;
        await tx.bookCopy.create({
          data: {
            bookId: book.id,
            accessionNo,
            status: BookCopyStatus.AVAILABLE,
            condition: 'Good',
          },
        });
      }

      await this.auditService.log({
        userId,
        action: 'BOOK_CREATE',
        entity: 'LibraryBook',
        entityId: book.id,
        newData: { title: dto.title, copiesCount },
      });

      return book;
    });
  }

  @CacheEvict({ tags: ['library'] })
  async addCopy(dto: AddBookCopyDto) {
    const book = await this.prisma.libraryBook.findUnique({ where: { id: dto.bookId } });
    if (!book) throw new NotFoundException('Book record not found');

    const existingCopy = await this.prisma.bookCopy.findUnique({ where: { accessionNo: dto.accessionNo } });
    if (existingCopy) throw new ConflictException(`Accession number "${dto.accessionNo}" is already assigned`);

    return this.txService.executeWithTransaction(async (tx) => {
      const copy = await tx.bookCopy.create({
        data: {
          bookId: dto.bookId,
          accessionNo: dto.accessionNo,
          condition: dto.condition || 'Good',
          status: BookCopyStatus.AVAILABLE,
        },
      });

      await tx.libraryBook.update({
        where: { id: dto.bookId },
        data: {
          totalCopies: { increment: 1 },
          availableCopies: { increment: 1 },
        },
      });

      return copy;
    });
  }

  // ----------------------------------------------------
  // CIRCULATION: ISSUE, RETURN & OVERDUE FINES
  // ----------------------------------------------------

  /**
   * Issue a physical book copy to a student
   * Critical Invariant: Prevent the same physical copy from being issued twice.
   */
  @CacheEvict({ tags: ['library'] })
  async issueBook(dto: IssueBookDto, userId?: string) {
    const library = await this.getOrCreateLibrary();
    const student = await this.prisma.student.findUnique({
      where: { id: dto.studentId },
      include: { user: true },
    });
    if (!student) throw new NotFoundException('Student not found');

    const dueDays = dto.dueDays || 14;
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + dueDays);

    return this.txService.executeWithTransaction(async (tx) => {
      let targetCopy: any;

      if (dto.copyId) {
        targetCopy = await tx.bookCopy.findUnique({
          where: { id: dto.copyId },
          include: { book: true },
        });
        if (!targetCopy) throw new NotFoundException('Requested physical book copy not found');
        if (targetCopy.status !== BookCopyStatus.AVAILABLE) {
          throw new ConflictException(
            `Copy ${targetCopy.accessionNo} is currently ${targetCopy.status} and cannot be issued`,
          );
        }
      } else {
        // Find first available physical copy
        targetCopy = await tx.bookCopy.findFirst({
          where: { bookId: dto.bookId, status: BookCopyStatus.AVAILABLE },
          include: { book: true },
        });
        if (!targetCopy) {
          throw new ConflictException('No available physical copies found in library for this book');
        }
      }

      // Check member maximum active loans limit (e.g. max 5 books)
      const activeIssuesCount = await tx.libraryIssue.count({
        where: { studentId: dto.studentId, status: IssueStatus.ISSUED },
      });
      if (activeIssuesCount >= 5) {
        throw new BadRequestException('Student has reached the maximum allowed active book loans (5)');
      }

      // 1. Mark physical copy as ISSUED
      await tx.bookCopy.update({
        where: { id: targetCopy.id },
        data: { status: BookCopyStatus.ISSUED },
      });

      // 2. Decrement available copies counter on title
      await tx.libraryBook.update({
        where: { id: targetCopy.bookId },
        data: { availableCopies: { decrement: 1 } },
      });

      // 3. Create issue record
      const issue = await tx.libraryIssue.create({
        data: {
          libraryId: library.id,
          bookId: targetCopy.bookId,
          copyId: targetCopy.id,
          studentId: dto.studentId,
          issueDate: new Date(),
          dueDate,
          status: IssueStatus.ISSUED,
        },
        include: {
          book: true,
          copy: true,
          student: { include: { user: true } },
        },
      });

      await this.auditService.log({
        userId,
        action: 'BOOK_ISSUE',
        entity: 'LibraryIssue',
        entityId: issue.id,
        newData: {
          accessionNo: targetCopy.accessionNo,
          title: targetCopy.book.title,
          studentName: `${student.user.firstName} ${student.user.lastName || ''}`,
          dueDate,
        },
      });

      // Dispatch due date reminder job
      await this.jobsService.dispatchNotification({
        userId: student.userId,
        title: `Library Book Issued: ${targetCopy.book.title}`,
        message: `Copy (${targetCopy.accessionNo}) has been issued. Due date for return is ${dueDate.toLocaleDateString()}.`,
        type: 'GENERAL',
      });

      return issue;
    });
  }

  /**
   * Return a book copy, calculate overdue fine (e.g. 50 PKR/day), and release copy back to AVAILABLE
   */
  @CacheEvict({ tags: ['library'] })
  async returnBook(issueId: string, dto: ReturnBookDto, userId?: string) {
    return this.txService.executeWithTransaction(async (tx) => {
      const issue = await tx.libraryIssue.findUnique({
        where: { id: issueId },
        include: { book: true, copy: true, student: { include: { user: true } } },
      });
      if (!issue) throw new NotFoundException('Issue record not found');
      if (issue.status !== IssueStatus.ISSUED) {
        throw new BadRequestException('This book issue record has already been returned or closed');
      }

      const today = new Date();
      let calculatedFine = 0;

      // Calculate fine if overdue (e.g. 50 PKR per overdue day)
      if (today > issue.dueDate && !dto.waiveFine) {
        const diffTime = Math.abs(today.getTime() - issue.dueDate.getTime());
        const overdueDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        calculatedFine = dto.fineAmount !== undefined ? dto.fineAmount : overdueDays * 50;
      }

      // 1. Release physical copy back to AVAILABLE
      if (issue.copyId) {
        await tx.bookCopy.update({
          where: { id: issue.copyId },
          data: {
            status: BookCopyStatus.AVAILABLE,
            condition: dto.condition || issue.copy?.condition || 'Good',
          },
        });
      }

      // 2. Increment title available copies counter
      await tx.libraryBook.update({
        where: { id: issue.bookId },
        data: { availableCopies: { increment: 1 } },
      });

      // 3. Update issue record
      const returned = await tx.libraryIssue.update({
        where: { id: issueId },
        data: {
          returnDate: today,
          status: IssueStatus.RETURNED,
          fine: calculatedFine > 0 ? calculatedFine : null,
        },
        include: { book: true, copy: true, student: { include: { user: true } } },
      });

      await this.auditService.log({
        userId,
        action: 'BOOK_RETURN',
        entity: 'LibraryIssue',
        entityId: issueId,
        newData: {
          title: issue.book.title,
          returnDate: today,
          fine: calculatedFine,
        },
      });

      return {
        ...returned,
        fineCharged: calculatedFine,
      };
    });
  }

  async getCirculationIssues(query: { studentId?: string; status?: IssueStatus }) {
    const library = await this.getOrCreateLibrary();
    return this.prisma.libraryIssue.findMany({
      where: {
        libraryId: library.id,
        ...(query.studentId ? { studentId: query.studentId } : {}),
        ...(query.status ? { status: query.status } : {}),
      },
      include: {
        book: true,
        copy: true,
        student: { include: { user: true, program: true } },
      },
      orderBy: { issueDate: 'desc' },
    });
  }
}
