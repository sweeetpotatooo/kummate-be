// apply.controller.ts
import {
  Controller,
  Patch,
  Delete,
  Get,
  Body,
  Param,
  Query,
  UseGuards,
  Post,
} from '@nestjs/common';
import { ApplyService } from './apply.service';
import { ApproveUserForm } from './dto/approve-user.form';
import { ApproveUserResultDto } from './dto/approve-user-result.dto';
import { RefuseUserResultDto } from './dto/refuse-user-result.dto';
import { ApplyDeleteResultDto } from './dto/apply-delete-result.dto';
import { ApplyListResultDto } from './dto/apply-list-result.dto';
import { ApplyDeleteNoticeResultDto } from './dto/apply-delete-notice-result.dto.ts';
import { User as GetUser } from '../../auth/user.decorator';
import { User } from '../user/entities/user.entity';
import { CreateApplyResultDto } from './dto/create-apply-result.dto';
import { CreateApplyDto } from './dto/create-apply.dto';
import { JwtAccessTokenGuard } from 'src/auth/guard/accessToken.guard';

@Controller('api/applicant')
@UseGuards(JwtAccessTokenGuard)
export class ApplyController {
  constructor(private readonly applyService: ApplyService) {}

  @Post('/')
  async createApply(
    @GetUser() user: User,
    @Body() createApplyDto: CreateApplyDto,
  ): Promise<CreateApplyResultDto> {
    const result = await this.applyService.createApply(user, createApplyDto);
    return result;
  }

  @Patch('/approve')
  async patchApprove(
    @GetUser() user: User,
    @Body() form: ApproveUserForm,
  ): Promise<ApproveUserResultDto> {
    const result = await this.applyService.patchApprove(user, form.toDto());
    return result;
  }

  @Patch('/refuse/:applyId')
  async patchRefuse(
    @GetUser() user: User,
    @Param('applyId') applyId: number,
  ): Promise<RefuseUserResultDto> {
    const result = await this.applyService.patchRefuse(user, applyId);
    return result;
  }

  @Delete('/:applyId')
  async deleteApplicant(
    @GetUser() user: User,
    @Param('applyId') applyId: number,
  ): Promise<ApplyDeleteResultDto> {
    const result = await this.applyService.deleteApply(user, applyId);
    return result;
  }
  @Get('/myApplications')
  async getMyApplications(
    @GetUser() user: User,
    @Query('page') page: number,
    @Query('size') size: number,
  ): Promise<ApplyListResultDto> {
    const result = await this.applyService.getMyApplications(user, page, size);
    return result;
  }

  @Get('/receivedApplications')
  async getReceivedApplications(
    @GetUser() user: User,
    @Query('page') page: number,
    @Query('size') size: number,
  ): Promise<ApplyListResultDto> {
    const result = await this.applyService.getReceivedApplications(
      user,
      page,
      size,
    );
    return result;
  }

  @Get('/notices')
  async getNotices(
    @GetUser() user: User,
    @Query('page') page: number,
    @Query('size') size: number,
  ): Promise<ApplyListResultDto> {
    const result = await this.applyService.getNotices(user, page, size);
    return result;
  }

  @Delete('/notice/:applyId')
  async deleteNotices(
    @GetUser() user: User,
    @Param('applyId') applyId: number,
  ): Promise<ApplyDeleteNoticeResultDto> {
    const result = await this.applyService.deleteNotice(user, applyId);
    return result;
  }
}
