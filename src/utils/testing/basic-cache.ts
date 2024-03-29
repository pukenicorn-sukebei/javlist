import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Provider } from '@nestjs/common/interfaces/modules/provider.interface'
import { Cache, Store } from 'cache-manager'

export const BasicCacheProvider: Provider = {
  provide: CACHE_MANAGER,
  useFactory: () => new BasicCache(),
}

export class BasicCache implements Cache {
  private values: Record<string, any> = {}
  store: Store

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  set<T>(key: string, value: T, ttl?: number): Promise<void> {
    this.values[key] = value
    return Promise.resolve()
  }

  get<T>(key: string): Promise<T | undefined> {
    return Promise.resolve(this.values[key])
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  wrap<T>(key: string, fn: () => Promise<T>): Promise<T> {
    return Promise.reject()
  }

  del(key: string): Promise<any> {
    delete this.values[key]
    return Promise.resolve()
  }

  reset(): Promise<void> {
    this.values = {}
    return Promise.resolve()
  }
}
