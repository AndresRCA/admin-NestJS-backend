import { PartialType, OmitType } from "@nestjs/swagger";
import { Form } from "../entities/form.entity";

/**
 * Class used for validation in lookups, for example:
 * /forms?id=1&name=registro%20abonados -> HTTP 200
 * /forms?name=consulta -> HTTP 200
 * /forms?formGroups=2 -> HTTP 404
 */
export class FormQueryDto extends PartialType(OmitType(Form, ['formGroups'] as const)) {}