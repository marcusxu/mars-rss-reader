import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedsModule } from './feeds/feeds.module';
import { ArticlesModule } from './articles/articles.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'mars_rss_reader.sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Only for dev env
    }),
    SubscriptionsModule,
    FeedsModule,
    ArticlesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
