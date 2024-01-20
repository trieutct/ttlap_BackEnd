import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import dotenv from 'dotenv';
import {
    TIMEZONE_HEADER,
    TIMEZONE_NAME_HEADER,
    DEFAULT_LANGUAGE,
} from '@/common/constants';
dotenv.config();

const DEFAULT_TIMEZONE_NAME = process.env.TIMEZONE_DEFAULT_NAME;
const DEAULT_TIMEZONE = process.env.TIMEZONE_DEFAULT;

@Injectable()
export class HeaderMiddleware implements NestMiddleware {
    use(req: Request, _res: Response, next: NextFunction) {
        if (!req.headers[TIMEZONE_HEADER]) {
            req.headers[TIMEZONE_HEADER] = DEAULT_TIMEZONE;
            // console.log(1)
            // console.log(req.headers[TIMEZONE_HEADER]);
        }
        if (!req.headers[TIMEZONE_NAME_HEADER]) {
            req.headers[TIMEZONE_NAME_HEADER] = DEFAULT_TIMEZONE_NAME;
            // console.log(2)
            // console.log(req.headers[TIMEZONE_NAME_HEADER])
        }
        if (!req.headers['accept-language']) {
            req.headers['accept-language'] = DEFAULT_LANGUAGE;
        }
        // console.log(req.headers['accept-language'])
        next();
    }
}
