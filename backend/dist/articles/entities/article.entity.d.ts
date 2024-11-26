import { Subscription } from '../../subscriptions/entities/subscription.entity';
export declare class Article {
    id: string;
    title: string;
    content: string;
    link: string;
    author: string;
    pubDate: Date;
    subscription: Subscription;
    isRead: boolean;
    isFavorite: boolean;
    createdAt: Date;
    updatedAt: Date;
}
