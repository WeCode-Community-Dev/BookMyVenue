import RegisterUserUseCase from "../../../application/user/usecases/RegisterUserUseCase.js";
import LoginUserUseCase from "../../../application/user/usecases/LoginUserUserCase.js";
import UserRepositoryImpl from "../../../infrastructure/repositories/UserRepositoryImpl.js";
import TokenService from "../../../infrastructure/services/TokenService.js";
import { statusCode } from "../../../shared/constants/enums/statusCode.js";

class AuthController {
    async register(req, res, next) {
        try {
            const userRepository = new UserRepositoryImpl();
            const registerUserUseCase = new RegisterUserUseCase(userRepository);
            const user = await registerUserUseCase.execute(req.body);

            return res.status(statusCode.CREATED).json({
                success: true,
                message: "User registered successfully",
                data: user
            });
        } catch (error) {
            next(error);
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;

            const userRepository = new UserRepositoryImpl();
            const loginUserUseCase = new LoginUserUseCase(userRepository);
            const user = await loginUserUseCase.execute(email, password);

            const payload = { userId: user.id, role: user.role };
            const accessToken = TokenService.generateAccessToken(payload);
            const refreshToken = TokenService.generateRefreshToken(payload);

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            return res.status(statusCode.OK).json({
                success: true,
                message: "Login successful",
                accessToken,
                data: user
            });
        } catch (error) {
            next(error);
        }
    }

    async refreshToken(req, res, next) {
        try {
            const refreshToken = req.cookies?.refreshToken;
            const decoded = TokenService.verifyRefreshToken(refreshToken);

            const payload = { userId: decoded.userId, role: decoded.role };
            const accessToken = TokenService.generateAccessToken(payload);

            return res.status(statusCode.OK).json({
                success: true,
                accessToken
            });
        } catch (error) {
            next(error);
        }
    }

    async logout(req, res, next) {
        try {
            res.clearCookie("refreshToken", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict"
            });

            return res.status(statusCode.OK).json({
                success: true,
                message: "Logged out successfully"
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new AuthController();
