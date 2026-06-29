import {
  ConflictException,
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { CustomerProfile } from './entities/customer-profile.entity';
import { RegisterUserDto } from './dto/register-user.dto';
import { OnboardCustomerDto } from './dto/onboard-customer.dto';
import { UserRole } from '../common/enums/user-role.enum';
import { AuthService, TokenPair } from '../auth/auth.service';
import { Venue } from 'src/venues/entities/venue.entity';
const SALT_ROUNDS = 12;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Venue)
    private readonly venueRepo: Repository<Venue>,
    @InjectRepository(CustomerProfile)
    private readonly customerProfileRepo: Repository<CustomerProfile>,
    private readonly jwtService: JwtService,   // used to verify phoneVerifiedToken
    private readonly authService: AuthService, // used to issue token pair after registration
  ) { }

  /**
   * Step 3 — Register a new user after their phone has been OTP-verified.
   *
   * The caller must supply the `phoneVerifiedToken` returned by POST /auth/verify-otp.
   * We decode it to confirm:
   *   1. The token is valid & not expired (within 10-minute window).
   *   2. The phone in the token matches the phone in the registration body.
   *
   * On success returns a full token pair (accessToken + refreshToken) so the
   * user is immediately authenticated — no extra login round-trip needed.
   *
   * Throws 401 if the token is invalid/expired or phone mismatch.
   * Throws 401 if someone tries to self-register as admin.
   * Throws 409 if the phone or email is already registered.
   */
  async register(
    dto: RegisterUserDto,
  ): Promise<
    TokenPair & {
      user: {
        id: string;
        name: string;
        phone: string;
        email: string;
        role: UserRole;
        isProfileCompleted: boolean;
      };
    }
  > {
    const { name, phone, email, password, phoneVerifiedToken, role } = dto;

    // ── Step 1: Block admin self-registration ─────────────────────────────
    if (role === UserRole.ADMIN) {
      throw new UnauthorizedException(
        'Admin accounts cannot be self-registered.',
      );
    }

    // ── Step 2: Verify the phoneVerifiedToken from the frontend ───────────
    let tokenPayload: { phone: string; purpose: string };
    try {
      tokenPayload = this.jwtService.verify<{ phone: string; purpose: string }>(
        phoneVerifiedToken,
      );
    } catch {
      throw new UnauthorizedException(
        'Phone verification token is invalid or has expired. Please verify your phone number again.',
      );
    }

    if (
      tokenPayload.purpose !== 'phone_verification' ||
      tokenPayload.phone !== phone
    ) {
      throw new UnauthorizedException(
        'Phone verification token does not match the provided phone number.',
      );
    }

    // ── Step 3: Check for duplicate accounts ─────────────────────────────
    const existingPhone = await this.userRepo.findOne({ where: { phone } });
    if (existingPhone) {
      throw new ConflictException(
        'An account with this phone number already exists.',
      );
    }

    const existingEmail = await this.userRepo.findOne({ where: { email } });
    if (existingEmail) {
      throw new ConflictException(
        'An account with this email address already exists.',
      );
    }

    // ── Step 4: Create the user ───────────────────────────────────────────
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const user = this.userRepo.create({
      name,
      phone,
      email,
      passwordHash,
      role,                    // 'customer' or 'venue_owner'
      phoneVerified: true,     // Confirmed by the phoneVerifiedToken above
      isProfileCompleted: false,
      isActive: true,
    });

    const saved = await this.userRepo.save(user);

    // ── Step 5: Issue token pair — user is authenticated immediately ──────
    const tokens = await this.authService.issueTokenPair(saved.id, saved.role);

    return {
      ...tokens,
      user: {
        id: saved.id,
        name: saved.name,
        phone: saved.phone,
        email: saved.email,
        role: saved.role,
        isProfileCompleted: saved.isProfileCompleted,
      },
    };
  }

  /**
   * Onboard a customer by saving their location details and setting `isProfileCompleted` to true.
   */
  async onboardCustomer(
    userId: string,
    dto: OnboardCustomerDto,
  ): Promise<{ message: string; isProfileCompleted: boolean; }> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    if (user.role !== UserRole.CUSTOMER) {
      throw new BadRequestException('Only users with role CUSTOMER can complete customer onboarding.');
    }

    let profile = await this.customerProfileRepo.findOne({ where: { userId } });
    if (!profile) {
      profile = this.customerProfileRepo.create({ userId });
    }

    profile.addressLine1 = dto.addressLine1;
    profile.addressLine2 = dto.addressLine2;
    profile.city = dto.city;
    profile.state = dto.state;
    profile.pincode = dto.pincode;
    profile.googleLocationUrl = dto.googleLocationUrl;

    const savedProfile = await this.customerProfileRepo.save(profile);

    user.isProfileCompleted = true;
    await this.userRepo.save(user);

    return {
      message: 'Customer onboarding completed successfully.',
      isProfileCompleted: true,
      // profile: savedProfile,
    };
  }

  /**
   * Get the customer profile details.
   */
  async getCustomerProfile(userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    const profile = await this.customerProfileRepo.findOne({ where: { userId } });
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isProfileCompleted: user.isProfileCompleted,
      },
      profile: profile || null,
    };
  }
}
