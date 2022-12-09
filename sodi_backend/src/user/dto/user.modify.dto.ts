import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Matches } from 'class-validator';
import { errorMessages } from '../../utils/errorMessages';
import { Role } from '../../roles/roles.enum';

const messages = errorMessages.kr.createUser;

export class UserModifyDto {
  @ApiProperty({ type: Number, description: '유저 이름 id', default: 1 })
  @IsNotEmpty({ message: 'name|' + messages.empty.name })
  id?: number;

  @ApiProperty({ type: String, description: '유저 이름', default: 'jangHyuck' })
  // @IsNotEmpty({ message: 'name|' + messages.empty.name })
  name: string;

  @ApiProperty({
    type: String,
    description: '유저 이메일',
    default: 'skg09203@naver.com',
  })
  @IsNotEmpty({ message: 'email|' + messages.empty.email })
  @IsEmail({}, { message: 'email|' + messages.matches.email })
  email: string;

  @ApiProperty({
    type: String,
    description: '유저 비밀번호',
    default: 'asd123!',
  })
  password?: string;

  passwordCheck?: string;

  @ApiProperty({ type: Number, description: '유저 나이', default: 1 })
  @IsNotEmpty({ message: 'age|' + messages.empty.age })
  age: number;

  @ApiProperty({ type: String, description: '유저의 나라', default: 'Korea' })
  @IsNotEmpty({ message: 'country|' + messages.empty.country })
  country: string;

  @ApiProperty({ type: String, description: '유저의 나라', default: 'Korea' })
  @IsNotEmpty({ message: 'countryCode|' + messages.empty.country })
  countryCode: string;

  backgroundImg = false;

  @ApiProperty({
    type: String,
    description: '유저 권한',
    default: '["User"]',
  })
  role?: string;

  @ApiProperty({ type: Boolean, description: '유저 계정 활성화 여부' })
  isActivate?: boolean;

  files: null;
}
