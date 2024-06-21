import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { HttpService } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [
    {
      provide: 'HTTP_CLIENT',
      useFactory: (httpService: HttpService) => {
        return httpService.axiosRef;
      },
      inject: [HttpService],
    },
  ],
  exports: ['HTTP_CLIENT'],
})
export class HttpClientModule {}
