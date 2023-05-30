import { AuthGuard } from "./auth.guard";
import { ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Test, TestingModule } from "@nestjs/testing";
import { UserSQLService } from "src/models/model/user/user-sql.service";
import { SessionsService } from "src/utils/shared/session.service";

describe("AuthGuard", () => {
  let authGuard: AuthGuard;
  const reflector = {
    get: jest.fn(),
  };
  const sessionService = {
    findLoginUserBySessionId: jest.fn(),
  };
  const adminService = {
    findUserById: jest.fn(),
  };
  const context = {
    switchToHttp: jest.fn(() => ({
      getRequest: jest.fn(() => ({
        cookies: { key: "session_id" },
      })),
      getResponse: jest.fn(),
    })),
    getHandler: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: Reflector, useValue: reflector },
        { provide: SessionsService, useValue: sessionService },
        { provide: UserSQLService, useValue: adminService },
        AuthGuard,
      ],
    }).compile();
    authGuard = module.get<AuthGuard>(AuthGuard);
  });

  describe("canActivate", () => {
    it("should be define", () => {
      expect(authGuard).toBeDefined();
    });
    // it("should return true if request role is not specified", async () => {
    //   reflector.get.mockReturnValueOnce(undefined);
    //   const result = await authGuard.canActivate(context);
    //   expect(result).toBe(true);
    // });
    // it("should throw UnauthorizedException if session_id is not provided", async () => {
    //   context.switchToHttp().getRequest.mockReturnValueOnce({ cookies: {} });
    //   await expect(authGuard.canActivate(context)).rejects.toThrow(
    //     UnauthorizedException
    //   );
    // });
    // it("should throw UnauthorizedException if loginUser is not found", async () => {
    //   sessionService.findLoginUserBySessionId.mockReturnValueOnce(null);
    //   const clearCookieMock = jest.fn();
    //   const getResponseMock = jest.fn(() => ({
    //     clearCookie: clearCookieMock,
    //   }));
    //   context.switchToHttp().getResponse.mockReturnValueOnce(getResponseMock);
    //   await expect(authGuard.canActivate(context)).rejects.toThrow(
    //     HttpException
    //   );
    //   expect(clearCookieMock).toHaveBeenCalledWith("key");
    //   expect(getResponseMock).toHaveBeenCalledWith();
    //   expect(getResponseMock().clearCookie).toHaveBeenCalledWith("key");
    //   expect(HttpException).toHaveBeenCalledWith(
    //     { session: "fail" },
    //     HttpStatus.UNAUTHORIZED
    //   );
    // });
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
});
