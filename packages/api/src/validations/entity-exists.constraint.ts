import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { ValidatorConstraint, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'entityExists', async: true })
@Injectable()
export class EntityExists {
  constructor(private connection: Connection) {}

  async validate(id: number, args: ValidationArguments) {
    const found = await this.connection
      .getRepository(args.constraints[0])
      .findOne(id);
    if (!found) return false;
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return `Foreign-key constraint error on ${args.constraints[0].name}.`;
  }
}
