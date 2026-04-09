import { Controller, Get, Query } from '@nestjs/common';
import { ROLE_IDS } from '../../auth/roles.constants';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import type { CurrentUser as CurrentUserType } from '../../common/types/current-user';
import { SearchQueryDto } from './dto/search-query.dto';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('responsables')
  @Roles(...Object.values(ROLE_IDS))
  async responsables(
    @CurrentUser() user: CurrentUserType,
    @Query() query: SearchQueryDto,
  ) {
    return this.searchService.responsables(user, query);
  }

  @Get('formations')
  @Roles(...Object.values(ROLE_IDS))
  async formations(
    @CurrentUser() user: CurrentUserType,
    @Query() query: SearchQueryDto,
  ) {
    return this.searchService.formations(user, query);
  }

  @Get('structures')
  @Roles(...Object.values(ROLE_IDS))
  async structures(
    @CurrentUser() user: CurrentUserType,
    @Query() query: SearchQueryDto,
  ) {
    return this.searchService.structures(user, query);
  }

  @Get('secretariats')
  @Roles(...Object.values(ROLE_IDS))
  async secretariats(
    @CurrentUser() user: CurrentUserType,
    @Query() query: SearchQueryDto,
  ) {
    return this.searchService.secretariats(user, query);
  }
}
