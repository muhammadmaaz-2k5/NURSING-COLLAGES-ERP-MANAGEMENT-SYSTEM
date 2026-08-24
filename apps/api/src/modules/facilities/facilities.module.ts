import { Module } from '@nestjs/common';
import { HostelController, LibraryController, TransportController } from './facilities.controller';
import { FacilitiesService } from './facilities.service';

@Module({
  controllers: [HostelController, LibraryController, TransportController],
  providers: [FacilitiesService],
  exports: [FacilitiesService],
})
export class FacilitiesModule {}
