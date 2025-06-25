import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb+srv://seifedinemarzougui1:6HFH1lBoV4ndGQbC@cluster0.drxeots.mongodb.net/guestHouse?retryWrites=true&w=majority&appName=Cluster0'), AuthModule ,UserModule ],
  controllers: [],
  providers: [],
})
export class AppModule {}
