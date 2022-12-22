import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { CreateUserDto } from './dto/user.create.dto';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcryptjs/dist/bcrypt';
import { UserDuplicateRequestDto } from './dto/user.duplicate.request.dto';
import { UserModifyDto } from './dto/user.modify.dto';
import { Express } from 'express';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async getByEmail(email: string) {
    // const user = await this.userRepository.({ email });
    //
    // if (user) return user;

    throw new HttpException(
      '사용자 이메일이 존재하지 않습니다.',
      HttpStatus.NOT_FOUND,
    );
  }

  async findOne(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({
      where: { email: email },
    });
  }

  async createUser(createUserDto: CreateUserDto) {
    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
    const user = this.userRepository.create({
      ...createUserDto,
    });
    return this.userRepository.save(user);
  }

  async findByEmailAndPassword(id: string, pw: string) {
    return this.userRepository.findByEmailAndPassword(id, pw);
  }

  async findByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }

  async findById(id: number) {
    return this.userRepository.findById(id);
  }

  async duplicate(
    userDuplicateReqDto: UserDuplicateRequestDto,
  ): Promise<boolean> {
    const { type, value } = userDuplicateReqDto;

    return await this.userRepository
      .findOneBy({ [type]: value })
      .then((e) => {
        console.log(e);
        return e !== null;
      })
      .catch((e) => false);
  }

  find(user: any) {
    return this.userRepository.findById(Number(user.sub));
  }

  async modifyUser(
    modifyUser: UserModifyDto,
    files: Array<Express.Multer.File>,
  ) {
    const user: User = await this.userRepository.findOneBy({
      id: modifyUser.id,
    });
    if (modifyUser.password.length > 0) {
      user.password = await bcrypt.hash(modifyUser.password, 10);
    }
    Object.keys(modifyUser).forEach((key) => { (async () => {
        const value = modifyUser[key];
        if (
          value !== user[key] &&
          !['backgroundImg', 'profileImg', 'password'].includes(key)
        ) {
          user[key] = value;
        }
      })();
    });
    if (files) {
      if (files.length === 1) {
        user[modifyUser.backgroundImg ? 'backgroundImg' : 'profileImg'] =
          files[0].filename;
      } else if (files.length === 1) {
        user.profileImg = files[0].filename;
        user.backgroundImg = files[1].filename;
      }
    }
    return await this.userRepository.save(user);
  }
}
