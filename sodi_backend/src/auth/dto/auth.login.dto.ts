import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ type: Number, description: '유저 idx' })
  id: number;

  @ApiProperty({ type: String, description: '유저 이메일' })
  // @IsNotEmpty()
  email: string;

  @ApiProperty({ type: String, description: '유저 비밀번호' })
  // @IsNotEmpty()
  password: string;
}
