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
  // it("should throw UnauthorizedException if registeredUser is not found", async () => {
  //   sessionService.findLoginUserBySessionId.mockReturnValueOnce({
  //     administrator_id: "admin_id",
  //   });
  //   adminService.findUserById.mockReturnValueOnce(null);
  //   await expect(authGuard.canActivate(context)).rejects.toThrow(
  //     UnauthorizedException
  //   );
  // });
  // it("should set ADMIN_NAME and ADMIN_ID in the request if registeredUser is found and isAdmin is true", async () => {
  //   const registeredUser = {
  //     name: "John",
  //     id: "user_id",
  //     isAdmin: true,
  //   };
  //   sessionService.findLoginUserBySessionId.mockReturnValueOnce({
  //     administrator_id: "admin_id",
  //   });
  //   adminService.findUserById.mockReturnValueOnce(registeredUser);
  //   reflector.get.mockReturnValueOnce("admin");
  //   const requestDTO: RequestDTO = { cookies: { key: "session_id" } };
  //   context.switchToHttp().getRequest.mockReturnValueOnce(requestDTO);
  //   await authGuard.canActivate(context);
  //   expect(requestDTO.ADMIN_NAME).toBe(registeredUser.name);
  //   expect(requestDTO.ADMIN_ID).toBe(registeredUser.id);
  //   expect(requestDTO.ROLE).toBe("admin");
  // });
  // it("should set ADMIN_NAME and ADMIN_ID in the request if registeredUser is found and isAdmin is false", async () => {
  //   const registeredUser = {
  //     name: "John",
  //     id: "user_id",
  //     isAdmin: false,
  //   };
  //   sessionService.findLoginUserBySessionId.mockReturnValueOnce({
  //     administrator_id: "admin_id",
  //   });
  //   adminService.findUserById.mockReturnValueOnce(registeredUser);
  //   reflector.get.mockReturnValueOnce("login");
  //   const requestDTO: RequestDTO = { cookies: { key: "session_id" } };
  //   context.switchToHttp().getRequest.mockReturnValueOnce(requestDTO);
  //   await authGuard.canActivate(context);
  //   expect(requestDTO.ADMIN_NAME).toBe(registeredUser.name);
  //   expect(requestDTO.ADMIN_ID).toBe(registeredUser.id);
  //   expect(requestDTO.ROLE).toBe("login");
  // });
  // it("should return true if requestRole is included in roles array", async () => {
  //   const registeredUser = {
  //     name: "John",
  //     id: "user_id",
  //     isAdmin: true,
  //   };
  //   sessionService.findLoginUserBySessionId.mockReturnValueOnce({
  //     administrator_id: "admin_id",
  //   });
  //   adminService.findUserById.mockReturnValueOnce(registeredUser);
  //   reflector.get.mockReturnValueOnce("admin");
  //   const requestDTO: RequestDTO = { cookies: { key: "session_id" } };
  //   context.switchToHttp().getRequest.mockReturnValueOnce(requestDTO);
  //   const result = await authGuard.canActivate(context);
  //   expect(result).toBe(true);
  // });
  // it("should throw UnauthorizedException if requestRole is not included in roles array", async () => {
  //   const registeredUser = {
  //     name: "John",
  //     id: "user_id",
  //     isAdmin: true,
  //   };
  //   sessionService.findLoginUserBySessionId.mockReturnValueOnce({
  //     administrator_id: "admin_id",
  //   });
  //   adminService.findUserById.mockReturnValueOnce(registeredUser);
  //   reflector.get.mockReturnValueOnce("guest");
  //   const requestDTO: RequestDTO = { cookies: { key: "session_id" } };
  //   context.switchToHttp().getRequest.mockReturnValueOnce(requestDTO);
  //   await expect(authGuard.canActivate(context)).rejects.toThrow(
  //     UnauthorizedException
  //   );
  // });
});
