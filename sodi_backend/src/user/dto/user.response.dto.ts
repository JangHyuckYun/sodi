import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Matches } from 'class-validator';
import { errorMessages } from '../../utils/errorMessages';

const messages = errorMessages.kr.createUser;

export class UserResponseDto {
  @ApiProperty({ type: String, description: '유저 이름', default: 'jangHyuck' })
  @IsNotEmpty({ message: '이름|' + messages.empty.name })
  name: string;

  @ApiProperty({
    type: String,
    description: '유저 이메일',
    default: 'skg09203@naver.com',
  })
  @IsNotEmpty({ message: '이메일|' + messages.empty.email })
  @IsEmail({}, { message: '이메일|' + messages.matches.email })
  email: string;

  @ApiProperty({ type: Number, description: '유저 나이', default: 1 })
  age: number;

  @ApiProperty({ type: String, description: '유저의 나라', default: 'Korea' })
  @IsNotEmpty({ message: '나라|' + messages.empty.country })
  country: string;

  @ApiProperty({
    type: String,
    description: '유저 권한',
    default: '["User"]',
  })
  role: string;

  @ApiProperty({ type: Boolean, description: '유저 계정 활성화 여부' })
  isActivate: boolean;
}
