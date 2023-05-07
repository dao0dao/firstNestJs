import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Req,
  Body,
  Put,
  Delete,
  Param,
} from "@nestjs/common";
import { Role } from "src/guards/roles.decorators";
import { TimetableSQLService } from "src/models/model/timetable/timetable-sql.service";
import { RequestDTO } from "src/request.dto";
import { TimetableService } from "./timetable.service";
import { TimetableHandlePlayerHistoryService } from "./timetable-handle-player-history.service";
import {
  CreateReservationDTO,
  InputReservationDTO,
  InputReservationPayment,
  InputUpdateReservationDTO,
  OutputReservationDTO,
  OutputReservationPrice,
  TimetableIdParam,
  TimetableQuery,
} from "./timetable.dto";
import { TimetableFacadeService } from "./timetable-facade.service";

@Controller("timetable")
export class TimetableController {
  constructor(
    private timetableSQL: TimetableSQLService,
    private timetableHandleData: TimetableService,
    private timetableHandleHistory: TimetableHandlePlayerHistoryService,
    private facade: TimetableFacadeService
  ) {}

  @Get()
  @Role("login")
  async getReservationByDate(
    @Req() req: RequestDTO,
    @Query() query: TimetableQuery
  ) {
    if (!query.date) {
      throw new HttpException(
        { reason: "Nie prawidłowa data" },
        HttpStatus.NOT_ACCEPTABLE
      );
    }
    const reservations = await this.facade.getReservationByDate(
      query.date,
      req.ROLE
    );
    return {
      reservations,
    };
  }

  @Post("reservation/add")
  @Role("login")
  async addReservation(
    @Req() req: RequestDTO,
    @Body() body: InputReservationDTO
  ): Promise<CreateReservationDTO> {
    const result = await this.facade.createReservationAndPlayerHistory(
      req.ROLE,
      body
    );
    if ("permissionDenied" === result) {
      throw new HttpException(
        { reason: "Brak uprawnień, nie można dodać z datą wsteczną." },
        HttpStatus.NOT_ACCEPTABLE
      );
    }
    if ("wrongTimeFormate" === result) {
      throw new HttpException(
        { reason: "Błędny format godziny" },
        HttpStatus.NOT_ACCEPTABLE
      );
    }
    if (result === "intervalServerError") {
      throw new HttpException(
        { readWrite: "fail" },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    return {
      status: "created",
      playersHistory: result,
    };
  }

  @Put("reservation/update")
  @Role("login")
  async updateReservation(
    @Req() req: RequestDTO,
    @Body() body: InputUpdateReservationDTO
  ): Promise<{
    reservation: OutputReservationDTO;
  }> {
    const result = await this.facade.updateReservation(req.ROLE, body);
    if ("permissionDenied" === result) {
      throw new HttpException(
        { reason: "Brak uprawnień." },
        HttpStatus.NOT_ACCEPTABLE
      );
    }
    if ("wrongTimeFormate" === result) {
      throw new HttpException(
        { reason: "Błędny format godziny" },
        HttpStatus.NOT_ACCEPTABLE
      );
    }
    if ("intervalServerError" === result) {
      throw new HttpException(
        { reason: "Brak rezerwacji lub nie podano gracza" },
        HttpStatus.NOT_ACCEPTABLE
      );
    }
    const { reservation } = result;
    return { reservation };
  }

  @Delete("reservation/delete/:id")
  @Role("login")
  async deleteReservation(
    @Req() req: RequestDTO,
    @Param() param: TimetableIdParam
  ) {
    const canDelete = this.timetableHandleData.checkCanCreateOrUpdate(
      new Date().toString(),
      req.ROLE
    );
    if (!canDelete) {
      throw new HttpException(
        { reason: "Brak uprawnień" },
        HttpStatus.NOT_ACCEPTABLE
      );
    }
    await this.timetableHandleHistory.deletePlayerHistoryByTimetableId(
      param.id
    );
    return this.timetableSQL.deleteReservationById(param.id);
  }

  @Get("reservation/price/:id")
  @Role("login")
  async getReservationPrice(
    @Param() param: TimetableIdParam
  ): Promise<OutputReservationPrice> {
    const data = await this.timetableHandleHistory.getReservationPrice(
      param.id
    );
    return { prices: data };
  }

  @Post("reservation/pay")
  @Role("login")
  async payForReservations(
    @Req() req: RequestDTO,
    @Body() body: InputReservationPayment
  ) {
    const result =
      await this.timetableHandleHistory.payForPlayerHistoryTimetable(req, body);
    if (result.access_denied) {
      throw new HttpException(
        { reason: "Brak uprawnień." },
        HttpStatus.NOT_ACCEPTABLE
      );
    }
    if (result.wrong_value) {
      throw new HttpException(
        { reason: "Brak uprawnień do zmiany kwoty." },
        HttpStatus.NOT_ACCEPTABLE
      );
    }
    return { updated: true };
  }
}
