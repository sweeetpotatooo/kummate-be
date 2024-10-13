import { Controller, Get, Query } from '@nestjs/common';
import { MbtiCompatibilityService } from './mbti-compatibility.service';

@Controller('mbti-compatibility')
export class MbtiCompatibilityController {
  constructor(
    private readonly mbtiCompatibilityService: MbtiCompatibilityService,
  ) {}

  @Get('calculate')
  calculateCompatibility(
    @Query('type1') type1: string,
    @Query('type2') type2: string,
  ): number {
    return this.mbtiCompatibilityService.calculateCompatibility(type1, type2);
  }
}
