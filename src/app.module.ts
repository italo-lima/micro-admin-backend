import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlayersModule } from './players/players.module';
import { CategoriesModule } from './categories/categories.module';
import {ConfigModule} from "@nestjs/config"

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://italo:italo@cluster0.gpcne.mongodb.net/sradmbackend?retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      },
    ),
    ConfigModule.forRoot({isGlobal: true}),
    PlayersModule,
    CategoriesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
