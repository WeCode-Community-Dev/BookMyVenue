import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

const mockAuthService = {
  register: jest.fn(),
  login: jest.fn(),
  forgotPassword: jest.fn(),
  resetPassword: jest.fn(),
  getProfile: jest.fn(),
};

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should call authService.register with dto', async () => {
      const dto = { name: 'John', email: 'john@test.com', password: 'pass123' };
      const expected = { message: 'Registration successful', token: 'jwt' };
      mockAuthService.register.mockResolvedValue(expected);

      const result = await controller.register(dto as any);
      expect(result).toEqual(expected);
      expect(mockAuthService.register).toHaveBeenCalledWith(dto);
    });
  });

  describe('login', () => {
    it('should call authService.login', async () => {
      const dto = { email: 'john@test.com', password: 'pass123' };
      const expected = { message: 'Login successful', token: 'jwt' };
      mockAuthService.login.mockResolvedValue(expected);

      const result = await controller.login(dto as any);
      expect(result).toEqual(expected);
    });
  });

  describe('forgotPassword', () => {
    it('should call authService.forgotPassword', async () => {
      const expected = { message: 'If an account exists...' };
      mockAuthService.forgotPassword.mockResolvedValue(expected);

      const result = await controller.forgotPassword({ email: 'john@test.com' });
      expect(result).toEqual(expected);
    });
  });

  describe('getProfile', () => {
    it('should call authService.getProfile with user id', async () => {
      const user = { id: 'uuid-1' } as any;
      const expected = { id: 'uuid-1', name: 'John' };
      mockAuthService.getProfile.mockResolvedValue(expected);

      const result = await controller.getProfile(user);
      expect(result).toEqual(expected);
      expect(mockAuthService.getProfile).toHaveBeenCalledWith('uuid-1');
    });
  });
});
