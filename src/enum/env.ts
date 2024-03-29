enum App {
  NodeEnv = 'NODE_ENV',
  AppEnv = 'APP_ENV',
  AppName = 'APP_NAME',
  Port = 'PORT',
  AppPort = 'APP_PORT',
  ApiPrefix = 'API_PREFIX',
  LogLevel = 'APP_LOG_LEVEL',
  CronJobsEnabled = 'CRON_JOBS_ENABLED',
}

enum Cron {
  CleanUpOrphanAssets = 'CRON_CLEANUP_ORPHAN_ASSETS',
}

enum Db {
  Type = 'DB_TYPE',
  Username = 'DB_USERNAME',
  Password = 'DB_PASSWORD',
  Host = 'DB_HOST',
  Port = 'DB_PORT',
  Name = 'DB_NAME',
}

enum Feature {
  CrawlerQueue = 'ENABLE_CRAWLER_QUEUE',
}

enum PornScraper {
  BasePath = 'PORN_SCRAPER_BASEPATH',
}

enum Redis {
  Host = 'REDIS_HOST',
  Port = 'REDIS_PORT',
}

class S3 {
  static readonly AccessKey = 'AWS_ACCESS_KEY_ID'
  static readonly SecretKey = 'AWS_SECRET_ACCESS_KEY'
  static readonly Endpoint = 'AWS_S3_ENDPOINT'
  static readonly EndpointCdn = 'AWS_S3_ENDPOINT_CDN'
  static readonly Region = 'AWS_S3_REGION'
  static readonly Buckets = class {
    static readonly Asset = class {
      static readonly Name = 'AWS_S3_BUCKET__ASSET__NAME'
      static readonly KeyPrefix = 'AWS_S3_BUCKET__ASSET__KEY_PREFIX'
      static readonly PresignDuration = 'AWS_S3_BUCKET__ASSET__PRESIGN_DURATION'
    }
  }
}

enum Swagger {
  Enabled = 'SWAGGER_ENABLED',
  Path = 'SWAGGER_PATH',
  FilePath = 'SWAGGER_FILE_PATH',
  Name = 'SWAGGER_NAME',
  Description = 'SWAGGER_DESCRIPTION',
}

export class Env {
  static readonly App = App
  static readonly Db = Db
  static readonly Cron = Cron
  static readonly Feature = Feature
  static readonly PornScraper = PornScraper
  static readonly Redis = Redis
  static readonly S3 = S3
  static readonly Swagger = Swagger
}
