import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { Schema } from 'zod';

@Injectable()
export class ZodPipe implements PipeTransform {
  constructor(private readonly schema: Schema) {}

  transform(value: any, _metadata: ArgumentMetadata) {
    return this.schema.parse(value);
  }
}
