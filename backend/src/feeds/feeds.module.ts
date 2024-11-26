import { Module } from '@nestjs/common';
import { FeedsService } from './feeds.service';
import { FeedsController } from './feeds.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from 'src/articles/entities/article.entity';
import { Subscription } from 'src/subscriptions/entities/subscription.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Article, Subscription])],
  providers: [FeedsService],
  controllers: [FeedsController],
})
export class FeedsModule {}
