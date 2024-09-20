// src/mycontents/mycontents.module.ts

import { Module } from '@nestjs/common';
import { MyContentService } from './mycontents.service';
import { MyContentController } from './mycontents.controller';
import { UserModule } from '../user/user.module'; // Ensure UserModule is imported to use UserService

@Module({
  imports: [UserModule], // Correctly importing UserModule, which exports TypeOrmModule for User
  providers: [MyContentService], // Providing MyContentService
  controllers: [MyContentController], // Registering MyContentController
  exports: [MyContentService], // Export MyContentService if needed elsewhere
})
export class MycontentsModule {}
