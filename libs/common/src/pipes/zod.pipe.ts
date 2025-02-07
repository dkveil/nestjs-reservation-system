import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { Schema } from 'zod';

@Injectable()
export class ZodPipe implements PipeTransform {
	constructor(private readonly schema: Schema) {}

	transform(value: any, metadata: ArgumentMetadata) {
		try {
			const parsed = this.schema.parse(value);
			return parsed;
		} catch (error) {
			throw error;
		}
	}
}
