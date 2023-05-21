import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import {
  LookupApi,
  ScrapedResult,
} from '@pukenicorn-sukebei/porn-scraper-client'
import { AxiosError, AxiosResponse } from 'axios'

import { Logger } from '@_logger'

@Injectable()
export class PornScraperService {
  constructor(
    private readonly logger: Logger,
    private readonly javScraperClient: LookupApi,
  ) {
    logger.setContext(PornScraperService.name)
  }

  getByCode(code: string): Promise<AxiosResponse<ScrapedResult>> {
    return this.javScraperClient
      .lookupLookupCodeGet(code)
      .then((resp) => resp as AxiosResponse<ScrapedResult>)
      .catch((err) => {
        if (err instanceof AxiosError && err.response?.status) {
          this.logger.error(`[PornScraper][${code}] Failed: ${err}`)
          if (err.response?.status === 404) {
            throw new NotFoundException(
              err.response?.statusText || 'Something went wrong',
            )
          }
        }
        throw new InternalServerErrorException(null, err)
      })
  }
}
