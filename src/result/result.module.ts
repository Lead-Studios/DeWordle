import { Module } from '@nestjs/common';
import { ResultService } from './result.service';
import { ResultController } from './result.controller';

@Module({
  controllers: [ResultController],
  providers: [ResultService],
})
export class ResultModule {}
