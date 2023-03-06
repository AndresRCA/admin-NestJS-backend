import { PartialType } from "@nestjs/swagger";
import { FormDto } from "./form.dto";

export class FormQueryDto extends PartialType(FormDto) {}