import { PartialType, PickType } from "@nestjs/swagger";
import { Module } from "src/auth/entities/module.entity";

export class ModuleQueryDto extends PartialType(PickType(Module, ['id', 'name'] as const)) {}