import ClassValidatorFields from "../../../@seedwork/domain/validators/class-validator-fields"
import {CategoryProps} from "../entities/category"
import {IsBoolean, IsDate, IsNotEmpty, IsOptional, IsString, MaxLength} from "class-validator"

export class CategoryRules {
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsOptional()
  description: string

  @IsBoolean()
  @IsOptional()
  is_active: boolean

  @IsDate()
  @IsOptional()
  created_at: Date

  constructor(data: CategoryProps) {
    Object.assign(this, data)
  }
}

export class CategoryValidator extends ClassValidatorFields<CategoryRules> {
  validate(data: CategoryProps): boolean {
    return super.validate(new CategoryRules(data))
  }
}

export default class CategoryValidatorFactory {
  static create() {
    return new CategoryValidator()
  }
}