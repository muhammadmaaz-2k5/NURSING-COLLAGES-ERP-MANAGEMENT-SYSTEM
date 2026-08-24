import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Cacheable, CacheEvict, TTL_PRESETS } from '../../common/cache';

@Injectable()
export class PortalService {
  constructor(private readonly prisma: PrismaService) {}

  @Cacheable({
    key: 'portal:notices:all',
    ttl: TTL_PRESETS.SHORT,
    tags: ['portal', 'notices'],
  })
  async getNotices() {
    return this.prisma.notice.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  @Cacheable({
    key: 'portal:events:all',
    ttl: TTL_PRESETS.MEDIUM,
    tags: ['portal', 'events'],
  })
  async getEvents() {
    return this.prisma.event.findMany({
      orderBy: { startDate: 'desc' },
    });
  }

  @Cacheable({
    key: 'portal:news:all',
    ttl: TTL_PRESETS.MEDIUM,
    tags: ['portal', 'news'],
  })
  async getNews() {
    return this.prisma.news.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async verifyCertificate(certificateNo: string) {
    const cert = await this.prisma.certificate.findFirst({
      where: { certificateNo },
      include: {
        student: { include: { user: true, program: true } },
      },
    });

    if (!cert) throw new NotFoundException(`Certificate "${certificateNo}" not found`);
    return {
      valid: true,
      certificateNo: cert.certificateNo,
      type: cert.type,
      title: cert.title,
      studentName: `${cert.student.user.firstName} ${cert.student.user.lastName || ''}`.trim(),
      program: cert.student.program.name,
      issueDate: cert.issueDate,
    };
  }
}
