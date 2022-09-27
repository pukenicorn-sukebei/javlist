import { HttpModule } from '@nestjs/axios'
import { ModuleMetadata } from '@nestjs/common/interfaces/modules/module-metadata.interface'
import { ConfigModule } from '@nestjs/config'
import { InstanceToken } from '@nestjs/core/injector/module'
import { Test, TestingModule } from '@nestjs/testing'
import { MockFactory } from '@nestjs/testing/interfaces'
import { PrismaClient } from '@prisma/client'

import Configs from '@_config/index'

import { S3Module } from '../../s3.module'

export interface ICreateTestingModule {
  imports?: {
    modules: ModuleMetadata['imports']
    override?: boolean
  }
  controllers?: {
    modules: ModuleMetadata['controllers']
    override?: boolean
  }
  providers?: {
    modules: ModuleMetadata['providers']
    override?: boolean
  }
  exports?: {
    modules: ModuleMetadata['exports']
    override?: boolean
  }
}
export interface IMocker {
  earlyMocker?: MockFactory
  lateMocker?: MockFactory
}

function defaultMocker(token: InstanceToken) {
  switch (token) {
    case PrismaClient:
      jest.mock('@prisma/client')
      return new PrismaClient()
  }
}

export async function createTestingModule(
  args: ICreateTestingModule,
  { earlyMocker, lateMocker }: IMocker = {},
): Promise<TestingModule> {
  const defaultImports: ModuleMetadata['imports'] = [
    ConfigModule.forRoot({
      isGlobal: true,
      load: Configs,
      envFilePath: ['.env.test', '.env', '.env.default'],
    }),
    HttpModule,
    S3Module,
  ]
  const defaultControllers: ModuleMetadata['controllers'] = []
  const defaultProviders: ModuleMetadata['providers'] = []
  const defaultExports: ModuleMetadata['exports'] = []

  const imports = args.imports?.modules || []
  const controllers = args.controllers?.modules || []
  const providers = args.providers?.modules || []
  const exports = args.exports?.modules || []

  return Test.createTestingModule({
    imports: args.imports?.override ? imports : [...defaultImports, ...imports],
    controllers: args.controllers?.override
      ? controllers
      : [...defaultControllers, ...controllers],
    providers: args.providers?.override
      ? providers
      : [...defaultProviders, ...providers],
    exports: args.exports?.override ? exports : [...defaultExports, ...exports],
  })
    .useMocker(
      (token) =>
        earlyMocker?.(token) || defaultMocker(token) || lateMocker?.(token),
    )
    .compile()
}
