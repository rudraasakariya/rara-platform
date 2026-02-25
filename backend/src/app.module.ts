import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { StudentsModule } from './students/students.module';
import { TutorsModule } from './tutors/tutors.module';
import { PartnersModule } from './partners/partners.module';
import { SitesModule } from './sites/sites.module';
import { SessionsModule } from './sessions/sessions.module';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
      AuthModule,
      StudentsModule,
      TutorsModule,
      PartnersModule,
      SitesModule,
      SessionsModule,
    ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
