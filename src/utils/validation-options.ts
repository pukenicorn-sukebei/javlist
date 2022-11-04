import {
  HttpException,
  HttpStatus,
  ValidationError,
  ValidationPipeOptions,
} from '@nestjs/common'

const validationOptions: ValidationPipeOptions = {
  transform: false,
  whitelist: true,
  errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  exceptionFactory: (errors: ValidationError[]) =>
    new HttpException(
      {
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: errors.reduce((accumulator, currentValue) => {
          if (currentValue.constraints) {
            return {
              ...accumulator,
              [currentValue.property]: Object.values(
                currentValue.constraints,
              ).join(', '),
            }
          } else {
            return accumulator
          }
        }, {}),
      },
      HttpStatus.UNPROCESSABLE_ENTITY,
    ),
}

export default validationOptions
