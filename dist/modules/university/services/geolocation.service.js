"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var GeolocationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeolocationService = void 0;
const common_1 = require("@nestjs/common");
let GeolocationService = GeolocationService_1 = class GeolocationService {
    constructor() {
        this.logger = new common_1.Logger(GeolocationService_1.name);
        this.API_KEY = process.env.IP_API_KEY || 'free';
        this.BASE_URL = 'http://ip-api.com/json';
    }
    async getLocationFromIp(ipAddress) {
        try {
            if (this.isPrivateIp(ipAddress)) {
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
            const timeoutId = setTimeout(() => controller.abort(), 5000);
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
            const result = {
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
        }
        catch (error) {
            this.logger.error(`❌ Geolocation lookup failed for IP ${ipAddress}:`, error.message);
            return {
                country: 'Unknown',
                countryCode: 'Unknown',
                region: 'Unknown',
                city: 'Unknown'
            };
        }
    }
    isPrivateIp(ipAddress) {
        const privateRanges = [
            /^10\./,
            /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
            /^192\.168\./,
            /^127\./,
            /^169\.254\./,
            /^::1$/,
            /^fe80:/,
            /^fc00:/,
            /^fd00:/
        ];
        return privateRanges.some(range => range.test(ipAddress));
    }
    getLocationString(geolocationData) {
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
};
exports.GeolocationService = GeolocationService;
exports.GeolocationService = GeolocationService = GeolocationService_1 = __decorate([
    (0, common_1.Injectable)()
], GeolocationService);
//# sourceMappingURL=geolocation.service.js.map