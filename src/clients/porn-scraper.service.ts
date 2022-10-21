import {
  Inject,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { AxiosError, AxiosResponse } from 'axios'
import { catchError, lastValueFrom } from 'rxjs'

import { JAVResult, JavScraperService } from '@_generated/porn-scraper-client'
import { Logger } from '@_logger'

export class PornScraperService {
  constructor(
    private readonly logger: Logger,
    @Inject(JavScraperService)
    private readonly javScraperService: JavScraperService,
  ) {
    logger.setContext(PornScraperService.name)
  }

  getByCode(code: string): Promise<AxiosResponse<JAVResult>> {
    return lastValueFrom(
      this.javScraperService.lookupJavCodeGet(code).pipe(
        catchError((err) => {
          if (err instanceof AxiosError && err.response?.status) {
            this.logger.error(`[PornScraper][${code}] Failed: ${err}`)
            if (err.response?.status === 404) {
              throw new NotFoundException(
                err.response?.statusText || 'Something went wrong',
              )
            }
          }
          throw new InternalServerErrorException(err)
        }),
      ),
    )
  }
}
