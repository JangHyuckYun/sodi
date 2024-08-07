import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '../roles/roles.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'user_id',
    comment: '유저 idx',
  })
  id: number;

  @Column({ name: 'user_name', nullable: false, comment: '유저 이름' })
  name: string;

  @Column({
    name: 'user_email',
    nullable: false,
    comment: '유저 이메일',
    unique: true,
  })
  email: string;

  @Column({ name: 'user_password', nullable: false, comment: '유저 비밀번호' })
  password: string;

  @Column({ name: 'user_age', nullable: false, comment: '유저 나이' })
  age: number;

  @Column({
    name: 'user_country',
    nullable: false,
    comment: '유저가 사는 나라',
  })
  country: string;

  @Column({
    name: 'user_country_code',
    nullable: false,
    comment: '유저가 사는 나라 code',
  })
  countryCode: string;

  @Column({
    name: 'user_role',
    nullable: false,
    comment: '유저 권한',
    default: '["User"]',
  })
  role: string;

  @Column({
    name: 'user_profile_img',
    nullable: true,
    comment: '프로필 이미지',
    default: '',
  })
  profileImg: string;

  @Column({
    name: 'user_background_img',
    nullable: true,
    comment: '백그라운드 이미지',
    default: '',
  })
  backgroundImg: string;

  @Column({
    name: 'user_is_activate',
    default: true,
    nullable: false,
    comment: '유저의 계정 활성화 여부',
  })
  isActivate: boolean;
}
