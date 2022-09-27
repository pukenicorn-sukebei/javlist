import { HttpModule } from '@nestjs/axios'
import { CacheModule, Module } from '@nestjs/common'

import { CacheConfigService } from '@_config-services/cache-config.service'
import { DatabaseModule } from '@_database/database.module'

import { S3Module } from '../s3.module'
import { FilesService } from './files.service'

@Module({
  imports: [
    CacheModule.registerAsync({ useClass: CacheConfigService }),
    HttpModule,
    DatabaseModule,
    S3Module,
  ],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}
