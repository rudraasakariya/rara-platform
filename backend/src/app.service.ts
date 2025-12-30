import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {

  constructor(private configService: ConfigService) {}  
  
  getHello(): string {
    const port = this.configService.get<number>('PORT');
    const dbHost = this.configService.get<string>('DB_HOST');
    const dbPort = this.configService.get<number>('DB_PORT');
    const dbUsername = this.configService.get<string>('DB_USERNAME');
    const dbPassword = this.configService.get<string>('DB_PASSWORD');
    const dbName = this.configService.get<string>('DB_DATABASE');
    console.log(`Port: ${port}, DB Host: ${dbHost}, DB Port: ${dbPort}, DB Username: ${dbUsername}, DB Password: ${dbPassword}, DB Name: ${dbName}`);
    return `The backend is running on port ${port} and the database is running on ${dbHost}:${dbPort} with username ${dbUsername} and password ${dbPassword} and database name ${dbName}`;
  }
}
