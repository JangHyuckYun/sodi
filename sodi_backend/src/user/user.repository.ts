import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/user.create.dto';
import { CustomRepository } from '../database/typeorm-ex.decorator';

@CustomRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(createUserDto: CreateUserDto): Promise<any> {
    console.log('asfa');
    const user = this.create({
      ...createUserDto,
    });
    await this.save(user);
  }

  // async findOneByEmail(param: { email: string }) {
  //   await this.createQueryBuilder('user')
  //     .where('user.email = :email', { email })
  //     .getOne();
  // }
  async findByEmailAndPassword(id: string, pw: string) {
    return await this.findOne({
      where: { email: id, password: pw },
    });
  }

  async findByEmail(username: string) {
    return await this.findOne({
      where: { email: username },
    });
  }

  async findById(id: number) {
    return await this.findOne({
      where: { id: id },
    });
  }
}
