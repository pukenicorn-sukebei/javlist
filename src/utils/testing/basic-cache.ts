import { CACHE_MANAGER } from '@nestjs/common'
import { Provider } from '@nestjs/common/interfaces/modules/provider.interface'
import { Cache, Store, WrapArgsType } from 'cache-manager'

export const BasicCacheProvider: Provider = {
  provide: CACHE_MANAGER,
  useFactory: () => new BasicCache(),
}

export class BasicCache implements Cache {
  private values: Record<string, any> = {}
  store: Store

  set<T>(key: string, value: T): Promise<T> {
    console.log('set ', key, ' -> ', value)
    this.values[key] = value
    return Promise.resolve(value)
  }

  get<T>(key: string): Promise<T | undefined> {
    console.log('get ', key)
    return Promise.resolve(this.values[key])
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  wrap<T>(...args: WrapArgsType<T>[]): Promise<T> {
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
