import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { idFromHash, isValidId } from '../utils/urls';

@Injectable()
export class ParseHashedIdPipe implements PipeTransform {
  constructor(private allowIntIds: boolean = false) {}

  transform(value: string) {
    if (this.allowIntIds && isValidId(value)) {
      return parseInt(value, 10);
    }
    const id = idFromHash(value);
    if (typeof id === 'undefined') {
      throw new NotFoundException(`Entity with id ${value} not found.`);
    }
    return id;
  }
}
