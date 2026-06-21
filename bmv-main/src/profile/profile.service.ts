import { Injectable , NotFoundException} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}
  async getProfile(userId: string) {
  const profile =
    await this.prisma.profile.findUnique({
      where: {
        userId,
      },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });

   if (!profile) {
    throw new NotFoundException(
      'Profile not found',
    );
  }


  return {
    name: profile?.name,
    email: profile?.user.email,
    phoneNumber:
      profile?.phoneNumber,
    profilePicture:
      profile?.profilePicture,
    billingAddress:
      profile?.billingAddress,
  };
}
}
