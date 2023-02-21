import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { JAVResult, JavApi } from '@pukenicorn-sukebei/porn-scraper-client'
import { AxiosError, AxiosResponse } from 'axios'

import { Logger } from '@_logger'

@Injectable()
export class PornScraperService {
  constructor(
    private readonly logger: Logger,
    private readonly javScraperClient: JavApi,
  ) {
    logger.setContext(PornScraperService.name)
  }

  getByCode(code: string): Promise<AxiosResponse<JAVResult>> {
    return this.javScraperClient
      .lookupJavCodeGet(code)
      .then((resp) => resp as AxiosResponse<JAVResult>)
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
