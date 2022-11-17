import { Module } from '@nestjs/common';
import { StudyController } from './study.controller';

@Module({
  controllers: [StudyController]
})
export class StudyModule {}
