import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { StaticModuleForRoot } from './utils/staticFiles';

@Module({
	imports: [ ConfigModule.forRoot(), ServeStaticModule.forRoot(StaticModuleForRoot) ],
	controllers: [ AppController ],
	providers: [ AppService ]
})
export class AppModule {
	
}
