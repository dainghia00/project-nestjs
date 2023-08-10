import { UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Test } from '@nestjs/testing';
import { LocalStrategy } from './local.strategy';
import { AuthService } from '../auth.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { createMock } from '@golevelup/ts-jest';
import { I18nService } from 'nestjs-i18n';

const mockI18nTranslte = {
  t: jest.fn(),
};

jest.mock('nestjs-i18n', () => ({
  I18nContext: {
    current: jest.fn().mockReturnValue({
      lang: 'en',
    }),
  },
  I18nService: jest.fn().mockImplementation(() => mockI18nTranslte),
}));

describe('LocalStrategy', () => {
  let strategy: LocalStrategy;
  let authService: AuthService;
  let i18n: I18nService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        LocalStrategy,
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn(),
          },
        },
        {
          provide: I18nService,
          useValue: {
            t: jest.fn(),
          },
        },
      ],
    }).compile();

    strategy = moduleRef.get<LocalStrategy>(LocalStrategy);
    authService = moduleRef.get<AuthService>(AuthService);
    i18n = moduleRef.get<I18nService>(I18nService);
  });

  describe('validate', () => {
    it('should return user when validation succeeds', async () => {
      const user = createMock<UserEntity>();

      jest.spyOn(authService, 'validateUser').mockResolvedValue(user);

      const result = await strategy.validate('lineId', 'password');

      expect(result).toBe(user);
      expect(authService.validateUser).toHaveBeenCalledWith(
        'lineId',
        'password',
      );
    });

    it('should throw UnauthorizedException when validation fails', async () => {
      jest.spyOn(authService, 'validateUser').mockReturnValue(null);
      jest.spyOn(i18n, 't').mockReturnValue('sign failed!');

      try {
        await strategy.validate('lineId', 'password');
      } catch (error) {
        expect(error.message).toEqual('sign failed!');
      }
    });
  });
});
