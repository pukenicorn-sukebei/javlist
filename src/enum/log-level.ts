export enum LogLevel {
  Verbose = 'verbose',
  Debug = 'debug',
  Log = 'log',
  Warn = 'warn',
  Error = 'error',
}

export const LogLevelDefault = LogLevel.Log as const

export function parseLogLevel(logLevel: string): LogLevel {
  return (
    Object.values(LogLevel).find((ll) => ll === logLevel) || LogLevelDefault
  )
}
