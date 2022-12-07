import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Any } from 'typeorm';

export class UserDuplicateRequestDto {
  @ApiProperty({ type: String, description: 'type', default: 'email' })
  type: string;

  @ApiProperty({
    type: Any,
    description: 'value',
    default: 'skg09203@naver.com',
  })
  value: any;
}
