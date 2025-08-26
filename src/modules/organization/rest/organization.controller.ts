import {
  Body,
  Controller,
  Get,
  Injectable,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrganizationService } from '../services/organization.service';
import { SelectOrganizationFrameworkDto } from '../dto/organization.dto';
import { AuthGuard } from '../../token/guard/jwt.guard';
import { AuthenticatedRequest } from 'src/modules/token/guard/types';

@Injectable()
@UseGuards(AuthGuard)
@Controller('organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post('frameworks')
  selectOrganizationFramework(
    @Body() selectOrganizationFrameworkDto: SelectOrganizationFrameworkDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.organizationService.selectOrganizationFramework(
      selectOrganizationFrameworkDto,
      req.organization.id,
    );
  }

  @Get('frameworks/org')
  getOrgFrameworks(@Req() req: AuthenticatedRequest) {
    return this.organizationService.getOrgFrameworks(req.organization.id);
  }

  @Get('frameworks')
  getFrameAllWorks() {
    return this.organizationService.getFrameAllWorks();
  }

  @Get('controls/categories')
  getOrganizationControlCategories(@Req() req: AuthenticatedRequest) {
    return this.organizationService.getOrganizationControlCategories(
      req.organization.id,
    );
  }

  @Get('controls/categories/:categoryId')
  getOrganizationControls(
    @Param('categoryId') categoryId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.organizationService.getOrganizationControls(
      req.organization.id,
      categoryId,
    );
  }

  // // endpoints here
  // // - get controls (show those in todo e.t.c)
  // -

  // // - get control categories
  // // - get frameworks
  // // update control
  // // delete control
  // // create control
}
