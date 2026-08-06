import { PartialType } from '@nestjs/mapped-types';
import { CreateSpaceBlockedPeriodDto } from './create-space-block-period.dto';

export class UpdateSpaceBlockedPeriodDto extends PartialType(
    CreateSpaceBlockedPeriodDto,
) { }