export interface GeolocationData {
    country?: string;
    countryCode?: string;
    region?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
    timezone?: string;
}
export declare class GeolocationService {
    private readonly logger;
    private readonly API_KEY;
    private readonly BASE_URL;
    getLocationFromIp(ipAddress: string): Promise<GeolocationData>;
    private isPrivateIp;
    getLocationString(geolocationData: GeolocationData): string;
}
