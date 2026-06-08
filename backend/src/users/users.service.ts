import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument, UserRole, UserStatus } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    let passwordHash = 'hashed_placeholder';
    if (createUserDto.password) {
      passwordHash = await bcrypt.hash(createUserDto.password, 10);
    }

    const role = createUserDto.role || UserRole.USER;

    const status = 
      role === UserRole.USER || 
      role === UserRole.VENUE_OWNER
        ? UserStatus.ACTIVE
        : UserStatus.PENDING;

    const createdUser = new this.userModel({
      email: createUserDto.email,
      name: createUserDto.name,
      phoneNumber: createUserDto.phoneNumber,
      role,
      status,
      passwordHash,
    });
    return createdUser.save();
  }

  async findOneByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }
}
