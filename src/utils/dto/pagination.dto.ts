import { ExecutionContext, createParamDecorator } from '@nestjs/common'
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator'

import { IPaginationOptions } from '@_utils/types/pagination-options'

export class PaginationDto implements IPaginationOptions {
  @IsOptional()
  @IsString()
  order?: string
  @IsOptional()
  @IsNumber()
  @Min(1)
  @IsNumber()
  page = 1
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  amount = 25
}

export const PaginationQuery = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const dto = new PaginationDto()
    const req = ctx.switchToHttp().getRequest()
    if (req.query.page) {
      dto.page = Number(req.query.page)
    }
    if (req.query.amount) {
      dto.amount = Number(req.query.amount)
    }
    return dto
  },
)
