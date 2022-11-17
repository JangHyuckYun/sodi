import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { CreateUserDto } from './dto/user.create.dto';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcryptjs/dist/bcrypt';

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
    console.log('createUserDto', createUserDto);
    const user = this.userRepository.create({
      ...createUserDto,
    });
    console.log('user', user);
    return this.userRepository.save(user);
  }

  async findByEmailAndPassword(id: string, pw: string) {
    return this.userRepository.findByEmailAndPassword(id, pw);
  }

  async findByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }
}
