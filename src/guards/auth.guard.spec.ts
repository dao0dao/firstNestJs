import { AuthGuard } from "./auth.guard";
import {
  ExecutionContext,
  HttpException,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ExecutionContextHost } from "@nestjs/core/helpers/execution-context-host";
import { Test, TestingModule } from "@nestjs/testing";
import { UserSQLService } from "src/models/model/user/user-sql.service";
import { SessionsService } from "src/utils/shared/session.service";

describe("AuthGuard", () => {
  let authGuard: AuthGuard;
  let reflector: Reflector;
  let sessionsService: SessionsService;
  let adminService: UserSQLService;
  const mockReflector = {
    get: jest.fn(() => "login"),
  };
  const mockSessionService = {
    findLoginUserBySessionId: jest.fn(),
  };
  const mockAdminService = {
    findUserById: jest.fn(),
  };
  const mockContext = {
    switchToHttp: jest.fn(() => ({
      getRequest: jest.fn(() => ({
        cookies: { key: "session_id" },
      })),
      getResponse: jest.fn(() => ({
        clearCookie: (data) => data,
        ADMIN_NAME: "",
        ADMIN_ID: "",
      })),
    })),
    getHandler: jest.fn(),
  } as unknown as ExecutionContext;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: Reflector, useValue: mockReflector },
        { provide: SessionsService, useValue: mockSessionService },
        { provide: UserSQLService, useValue: mockAdminService },
        { provide: ExecutionContextHost, useValue: mockContext },
        AuthGuard,
      ],
    }).compile();
    authGuard = module.get<AuthGuard>(AuthGuard);
    reflector = module.get<Reflector>(Reflector);
    sessionsService = module.get<SessionsService>(SessionsService);
    adminService = module.get<UserSQLService>(UserSQLService);
  });

  it("should be define", () => {
    expect(authGuard).toBeDefined();
  });
  it("should return true if request role is not specified", async () => {
    mockReflector.get.mockReturnValueOnce(undefined);
    const result = await authGuard.canActivate(mockContext);
    expect(result).toBe(true);
  });
  it("should throw UnauthorizedException if session_id is not provided", async () => {
    const mockNewContext = {
      switchToHttp: jest.fn(() => ({
        getRequest: jest.fn(() => ({
          cookies: {},
        })),
        getResponse: jest.fn(),
      })),
      getHandler: jest.fn(),
    } as unknown as ExecutionContext;
    mockReflector.get.mockReturnValueOnce("login");
    await expect(authGuard.canActivate(mockNewContext)).rejects.toThrow(
      UnauthorizedException
    );
  });
  it("should throw UnauthorizedException if loginUser is not found", async () => {
    const mockUser = false as unknown as Promise<any>;
    jest
      .spyOn(sessionsService, "findLoginUserBySessionId")
      .mockReturnValue(mockUser);
    await expect(authGuard.canActivate(mockContext)).rejects.toThrow(
      HttpException
    );
  });
  it("should throw UnauthorizedException if registeredUser is not found", async () => {
    const mockUser = true as unknown as Promise<any>;
    jest
      .spyOn(sessionsService, "findLoginUserBySessionId")
      .mockReturnValue(mockUser);
    const registeredUser = false as unknown as Promise<any>;
    jest.spyOn(adminService, "findUserById").mockReturnValue(registeredUser);
    await expect(authGuard.canActivate(mockContext)).rejects.toThrow(
      HttpException
    );
  });
  it("should return true if registeredUser is found and isAdmin is false", async () => {
    const mockUser = true as unknown as Promise<any>;
    jest
      .spyOn(sessionsService, "findLoginUserBySessionId")
      .mockReturnValue(mockUser);
    const registeredUser = {
      name: "Jan",
      id: "some_id",
      isAdmin: false,
    } as unknown as Promise<any>;
    jest.spyOn(adminService, "findUserById").mockReturnValue(registeredUser);
    const result = await authGuard.canActivate(mockContext);
    expect(result).toEqual(true);
  });
  it("should throw UnauthorizedException if registeredUser is found and isAdmin is false and role is admin", async () => {
    const mockUser = true as unknown as Promise<any>;
    jest
      .spyOn(sessionsService, "findLoginUserBySessionId")
      .mockReturnValue(mockUser);
    mockReflector.get.mockReturnValueOnce("admin");
    const registeredUser = {
      name: "Jan",
      id: "some_id",
      isAdmin: false,
    } as unknown as Promise<any>;
    jest.spyOn(adminService, "findUserById").mockReturnValue(registeredUser);
    await expect(authGuard.canActivate(mockContext)).rejects.toThrow(
      UnauthorizedException
    );
  });
});
