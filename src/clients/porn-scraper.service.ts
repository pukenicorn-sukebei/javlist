import { JAVResult, JavScraperService } from '@_generated/porn-scraper-client'
import { Inject } from '@nestjs/common'
import { AxiosResponse } from 'axios'
import { lastValueFrom } from 'rxjs'

export class PornScraperService {
  constructor(
    @Inject(JavScraperService)
    private readonly javScraperService: JavScraperService,
  ) {
  }

  getByCode(code: string): Promise<AxiosResponse<JAVResult>> {
    return lastValueFrom(this.javScraperService.lookupJavCodeGet(code))
  }
}
