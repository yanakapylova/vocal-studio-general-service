import { HttpException, Logger } from '@nestjs/common';

export const handleError = function (text: string, error: any) {
  Logger.error(text + ': ' + error);
  throw new HttpException(text + ' -> ' + error, 500);
};
