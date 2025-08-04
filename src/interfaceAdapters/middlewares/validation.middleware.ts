import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS } from '../../shared/constants';

export function validateDto(DtoClass: any) {
  return async (req: Request, res: Response, next: NextFunction):Promise<void> =>  {

    const dtoObject = plainToInstance(DtoClass, req.body);


    const errors = await validate(dtoObject);

    if (errors.length > 0) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: 'Validation failed',
        errors: errors.map(err => ({
          property: err.property,
          constraints: err.constraints,
        })),
      });
      return; 
    }

    req.body.validatedDto = dtoObject;
    next();
  };
}
