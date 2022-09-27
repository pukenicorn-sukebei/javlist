import { Inject } from '@nestjs/common'
import { AxiosResponse } from 'axios'
import { lastValueFrom } from 'rxjs'

import { JAVResult, JavScraperService } from '@_clients/porn-scraper'

export class PornScraperService {
  constructor(
    @Inject(JavScraperService)
    private readonly javScraperService: JavScraperService,
  ) {}

  getByCode(code: string): Promise<AxiosResponse<JAVResult>> {
    return lastValueFrom(this.javScraperService.lookupJavCodeGet(code))
  }
}
