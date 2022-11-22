import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Matches } from 'class-validator';
import { errorMessages } from '../../utils/errorMessages';
import { Role } from '../../roles/roles.enum';

const messages = errorMessages.kr.createUser;

export class CreateUserDto {
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

  @ApiProperty({
    type: String,
    description: '유저 비밀번호',
    default: 'asd123!',
  })
  @Matches(/^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
    message: '비밀번호|' + messages.matches.password,
  })
  @IsNotEmpty({ message: '비밀번호|' + messages.empty.password })
  password: string;

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
