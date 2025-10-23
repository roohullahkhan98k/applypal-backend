import { Injectable, Logger } from '@nestjs/common';

export interface GeolocationData {
  country?: string;
  countryCode?: string;
  region?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
}

@Injectable()
export class GeolocationService {
  private readonly logger = new Logger(GeolocationService.name);
  private readonly API_KEY = process.env.IP_API_KEY || 'free';
  private readonly BASE_URL = 'http://ip-api.com/json';

  /**
   * Get geolocation data for an IP address
   * @param ipAddress - The IP address to lookup
   * @returns Geolocation data including country, region, city
   */
  async getLocationFromIp(ipAddress: string): Promise<GeolocationData> {
    try {
      // Handle localhost/private IPs for testing
      if (this.isPrivateIp(ipAddress)) {
        // For localhost testing, return a default location
        if (ipAddress === '::1' || ipAddress === '127.0.0.1') {
          return {
            country: 'Localhost (Testing)',
            countryCode: 'TEST',
            region: 'Local Development',
            city: 'Local Machine'
          };
        }
        
        return {
          country: 'Private Network',
          countryCode: 'PRIVATE',
          region: 'Unknown',
          city: 'Unknown'
        };
      }

      const url = `${this.BASE_URL}/${ipAddress}?fields=status,message,country,countryCode,region,city,lat,lon,timezone`;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent': 'UniversityWidget/1.0'
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.status === 'fail') {
        this.logger.warn(`Geolocation lookup failed for IP ${ipAddress}: ${data.message}`);
        return {
          country: 'Unknown',
          countryCode: 'Unknown',
          region: 'Unknown',
          city: 'Unknown'
        };
      }

      const result: GeolocationData = {
        country: data.country || 'Unknown',
        countryCode: data.countryCode || 'Unknown',
        region: data.region || 'Unknown',
        city: data.city || 'Unknown',
        latitude: data.lat,
        longitude: data.lon,
        timezone: data.timezone
      };

      this.logger.log(`📍 Geolocation lookup successful for IP ${ipAddress}: ${result.country}, ${result.city}`);
      return result;

    } catch (error) {
      this.logger.error(`❌ Geolocation lookup failed for IP ${ipAddress}:`, error.message);
      return {
        country: 'Unknown',
        countryCode: 'Unknown',
        region: 'Unknown',
        city: 'Unknown'
      };
    }
  }

  /**
   * Check if an IP address is private/local
   * @param ipAddress - The IP address to check
   * @returns True if the IP is private/local
   */
  private isPrivateIp(ipAddress: string): boolean {
    // Common private IP ranges
    const privateRanges = [
      /^10\./,                    // 10.0.0.0/8
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./, // 172.16.0.0/12
      /^192\.168\./,              // 192.168.0.0/16
      /^127\./,                   // 127.0.0.0/8 (localhost)
      /^169\.254\./,              // 169.254.0.0/16 (link-local)
      /^::1$/,                    // IPv6 localhost
      /^fe80:/,                   // IPv6 link-local
      /^fc00:/,                   // IPv6 unique local
      /^fd00:/                    // IPv6 unique local
    ];

    return privateRanges.some(range => range.test(ipAddress));
  }

  /**
   * Get a simplified location string for display
   * @param geolocationData - The geolocation data
   * @returns A formatted location string
   */
  getLocationString(geolocationData: GeolocationData): string {
    const parts = [];
    
    if (geolocationData.city && geolocationData.city !== 'Unknown') {
      parts.push(geolocationData.city);
    }
    
    if (geolocationData.region && geolocationData.region !== 'Unknown') {
      parts.push(geolocationData.region);
    }
    
    if (geolocationData.country && geolocationData.country !== 'Unknown') {
      parts.push(geolocationData.country);
    }

    return parts.length > 0 ? parts.join(', ') : 'Unknown Location';
  }
}
