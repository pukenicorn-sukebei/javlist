import appConfig from '@_config/app.config'
import cronConfig from '@_config/cron.config'
import dbConfig from '@_config/db.config'
import featureConfig from '@_config/feature.config'
import pornScraperConfig from '@_config/porn-scraper.config'
import redisConfig from '@_config/redis.config'
import s3Config from '@_config/s3.config'
import swaggerConfig from '@_config/swagger.config'

export default [
  appConfig,
  cronConfig,
  dbConfig,
  featureConfig,
  s3Config,
  pornScraperConfig,
  redisConfig,
  swaggerConfig,
]
