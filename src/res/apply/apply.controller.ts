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
  Req,
} from '@nestjs/common';
import { ApplyService } from './apply.service';
import { ApproveUserForm } from './dto/approve-user.form';
import { ApproveUserResultDto } from './dto/approve-user-result.dto';
import { RefuseUserResultDto } from './dto/refuse-user-result.dto';
import { ApplyDeleteResultDto } from './dto/apply-delete-result.dto';
import { ApplyListResultDto } from './dto/apply-list-result.dto';
import { ApplyDeleteNoticeResultDto } from './dto/apply-delete-notice-result.dto.ts';
import { User } from '../user/entities/user.entity';
import { CreateApplyResultDto } from './dto/create-apply-result.dto';
import { CreateApplyDto } from './dto/create-apply.dto';
import { JwtAccessTokenGuard } from 'src/auth/guard/accessToken.guard';
import { RefuseUserDto } from './dto/refuse-user.dto';

@Controller('api/applicant')
@UseGuards(JwtAccessTokenGuard)
export class ApplyController {
  constructor(private readonly applyService: ApplyService) {}

  @Post('/')
  async createApply(
    @Req() req,
    @Body() createApplyDto: CreateApplyDto,
  ): Promise<CreateApplyResultDto> {
    const user: User = req.user; // req.user에서 사용자 정보 가져오기
    const result = await this.applyService.createApply(user, createApplyDto);
    return result;
  }

  @Patch('/approve')
  async patchApprove(
    @Req() req,
    @Body() form: ApproveUserForm,
  ): Promise<ApproveUserResultDto> {
    const user: User = req.user;
    const result = await this.applyService.patchApprove(user, form.toDto());
    return result;
  }

  @Patch('/refuse/:applyId')
  async patchRefuse(
    @Req() req,
    @Param('applyId') applyId: number,
    @Body() refuseUserDto: RefuseUserDto,
  ): Promise<RefuseUserResultDto> {
    const user: User = req.user;
    const result = await this.applyService.patchRefuse(user, {
      applyId,
      articleId: refuseUserDto.articleId,
    });
    return result;
  }

  @Delete('/:applyId')
  async deleteApplicant(
    @Req() req,
    @Param('applyId') applyId: number,
  ): Promise<ApplyDeleteResultDto> {
    const user: User = req.user;
    const result = await this.applyService.deleteApply(user, applyId);
    return result;
  }

  @Get('/myApplications')
  async getMyApplications(
    @Req() req,
    @Query('page') page: number,
    @Query('size') size: number,
  ): Promise<ApplyListResultDto> {
    const user: User = req.user;
    const result = await this.applyService.getMyApplications(user, page, size);
    return result;
  }

  @Get('/receivedApplications')
  async getReceivedApplications(
    @Req() req,
    @Query('page') page: number,
    @Query('size') size: number,
  ): Promise<ApplyListResultDto> {
    const user: User = req.user;
    const result = await this.applyService.getReceivedApplications(
      user,
      page,
      size,
    );
    return result;
  }

  @Get('/notices')
  async getNotices(
    @Req() req,
    @Query('page') page: number,
    @Query('size') size: number,
  ): Promise<ApplyListResultDto> {
    const user: User = req.user;
    const result = await this.applyService.getNotices(user, page, size);
    return result;
  }

  @Delete('/notice/:applyId')
  async deleteNotices(
    @Req() req,
    @Param('applyId') applyId: number,
  ): Promise<ApplyDeleteNoticeResultDto> {
    const user: User = req.user;
    const result = await this.applyService.deleteNotice(user, applyId);
    return result;
  }
}
