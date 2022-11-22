import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import axios from 'axios';
import { HttpService } from '@nestjs/axios';
import { errorMessages } from '../utils/errorMessages';

async function getUserCountry(httpService: HttpService) {
  console.log('process.env.LOOKUP_KEY', process.env.LOOKUP_KEY);
  // const data = await axios
  //   .get(`https://extreme-ip-lookup.com/json?key=${process.env.LOOKUP_KEY}`)
  //   .then((res) => {
  //     console.log('res', res);
  //     return res;
  //   });
  //
  // return data;
}

@Catch()
export class AuthExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    let message = res.statusMessage;
    if (!(exception instanceof HttpException)) {
      exception = new InternalServerErrorException();
    }

    if (exception instanceof HttpException) {
      const countryCode = 'kr';
      console.log('req.url', req.url);
      message = errorMessages[countryCode].urlList[req.url];
    }

    const response = (exception as HttpException).getResponse();
    const log = {
      timestamp: new Date(),
      url: req.url,
      response,
    };

    res.status((exception as HttpException).getStatus()).json({
      timestamp: new Date(),
      url: req.url,
      message,
      statusCode: res.statusCode,
    });
  }
}
