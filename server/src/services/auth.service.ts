import UserModel from "../models/user.model";
import { HttpException, UnauthorizedException } from "../utils/appError";
import { HTTP_STATUS } from "../config/http.config";
import { ErrorCodeEnum } from "../enums/error-code.enum";
import { RoleEnumType } from "../enums/user-enum";
import { signAccessToken } from "../utils/jwt";
import { RegisterInput, LoginInput } from "../validator/auth.validator";

type RegisterParams = Omit<RegisterInput, "role"> & {
  role?: RoleEnumType;
};

type LoginParams = LoginInput;

export const registerService = async ({ name, email, password, role }: RegisterParams) => {
  const existingUser = await UserModel.findOne({ email });

  if (existingUser) {
    throw new HttpException(
      "User with this email already exists",
      HTTP_STATUS.CONFLICT,
      ErrorCodeEnum.AUTH_EMAIL_ALREADY_EXISTS,
    );
  }

  // password is hashed by the userSchema pre("save") hook.
  // role is optional — schema default (CUSTOMER) applies when undefined.
  const newUser = new UserModel({ name, email, password, role });
  await newUser.save();

  return newUser.omitPassword();
};

export const loginService = async ({ email, password }: LoginParams) => {
  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new UnauthorizedException("Invalid email or password", ErrorCodeEnum.AUTH_USER_NOT_FOUND);
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new UnauthorizedException(
      "Invalid email or password",
      ErrorCodeEnum.AUTH_UNAUTHORIZED_ACCESS,
    );
  }

  const accessToken = signAccessToken({
    userId: String(user._id),
    role: user.role,
  });

  return { user: user.omitPassword(), accessToken };
};
