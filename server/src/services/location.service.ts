// services/location.service.ts
import axios from 'axios';
import geoip from 'geoip-lite';

export interface LocationData {
  country: string;
  city: string;
  lat: number;
  lng: number;
  timezone: string;
  isp?: string;
}

export class LocationService {
  static async getLocationFromIP(ip: string): Promise<LocationData> {
    try {
      // Remove IPv6 prefix if present
      const cleanIp = ip.replace(/^::ffff:/, '');
      
      // Use geoip-lite for fast local lookup
      const geo = geoip.lookup(cleanIp);
      
      if (geo) {
        return {
          country: geo.country,
          city: geo.city || 'Unknown',
          lat: geo.ll[0],
          lng: geo.ll[1],
          timezone: geo.timezone || 'UTC',
        };
      }
      
      // Fallback to external API
      const response = await axios.get(`http://ip-api.com/json/${cleanIp}`);
      const data = response.data;
      
      if (data.status === 'success') {
        return {
          country: data.countryCode,
          city: data.city,
          lat: data.lat,
          lng: data.lon,
          timezone: data.timezone,
          isp: data.isp,
        };
      }
      
      return {
        country: 'Unknown',
        city: 'Unknown',
        lat: 0,
        lng: 0,
        timezone: 'UTC',
      };
    } catch (error) {
      console.error('Location lookup failed:', error);
      return {
        country: 'Unknown',
        city: 'Unknown',
        lat: 0,
        lng: 0,
        timezone: 'UTC',
      };
    }
  }
}