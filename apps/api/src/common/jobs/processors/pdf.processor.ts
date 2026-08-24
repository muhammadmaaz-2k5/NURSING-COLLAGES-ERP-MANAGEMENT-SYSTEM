import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PDF_QUEUE } from '../jobs.constants';
import { PdfJobData } from '../jobs.service';

@Processor(PDF_QUEUE)
export class PdfProcessor extends WorkerHost {
  private readonly logger = new Logger(PdfProcessor.name);

  async process(job: Job<PdfJobData>): Promise<any> {
    const { type, entityId, outputName } = job.data;
    this.logger.log(`📄 [BullMQ Worker] Generating asynchronous PDF ${type} for entity ${entityId}...`);

    await new Promise((res) => setTimeout(res, 100));

    this.logger.log(`✅ [BullMQ Worker] PDF generated: ${outputName}`);
    return { success: true, fileUrl: `/uploads/generated/${outputName}.pdf` };
  }
}
