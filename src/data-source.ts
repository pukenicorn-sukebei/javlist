import 'reflect-metadata'
import { DataSource } from 'typeorm'

import { getNestApp } from './app'

async function getDataSource() {
  const app = await getNestApp()
  const ds = app.get(DataSource)
  await app.close()

  return ds
}
export default getDataSource()
