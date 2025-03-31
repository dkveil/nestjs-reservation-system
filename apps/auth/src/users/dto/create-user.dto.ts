import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

export const CreateUserDto = z.object({
  email: z
    .string()
    .email('Invalid email format')
    .min(5, 'Email must contain at least 5 characters')
    .max(255, 'Email cannot exceed 255 characters')
    .trim()
    .toLowerCase(),
  password: z
    .string()
    .min(8, 'Password must contain at least 8 characters')
    .max(100, 'Password cannot exceed 100 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character',
    ),
  confirmPassword: z
    .string()
    .min(1, 'Confirm password is required'),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export type CreateUserDto = z.infer<typeof CreateUserDto>;

export class CreateUserDtoSwagger {
  @ApiProperty({
    description: 'Email',
    example: 'test@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Password',
    example: 'password',
  })
  password: string;

  @ApiProperty({
    description: 'Confirm password',
    example: 'password',
  })
  confirmPassword: string;
}
