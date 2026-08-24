import { Module } from '@nestjs/common';
import { HostelController } from './hostel.controller';
import { HostelService } from './hostel.service';
import { LibraryController } from './library.controller';
import { LibraryService } from './library.service';
import { TransportController } from './transport.controller';
import { TransportService } from './transport.service';

@Module({
  controllers: [HostelController, LibraryController, TransportController],
  providers: [HostelService, LibraryService, TransportService],
  exports: [HostelService, LibraryService, TransportService],
})
export class FacilitiesModule {}

