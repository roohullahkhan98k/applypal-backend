import { PrismaService } from '../../../database/prisma.service';
import { GeolocationService } from './geolocation.service';
import { ChatClickDto, ChatClickResponseDto, ChatClickAnalyticsDto } from '../dto/chat-click.dto';
export declare class ChatClickService {
    private prisma;
    private geolocationService;
    private readonly logger;
    constructor(prisma: PrismaService, geolocationService: GeolocationService);
    recordChatClick(clickData: ChatClickDto, ipAddress: string): Promise<ChatClickResponseDto>;
    private updateGeolocationInBackground;
    getChatClickAnalytics(widgetId: string): Promise<ChatClickAnalyticsDto>;
    getClickCount(widgetId: string): Promise<number>;
    getClicksByCountry(widgetId: string): Promise<{
        country: string;
        count: number;
    }[]>;
}
