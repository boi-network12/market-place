// services/device.service.ts
import { UAParser } from 'ua-parser-js';
import { v4 as uuidv4 } from 'uuid';
import { v5 as uuidv5 } from 'uuid';

/* ====================== INTERFACE ====================== */

export interface DeviceInfo {
  deviceId: string;
  deviceName: string;
  deviceType: 'mobile' | 'tablet' | 'desktop' | 'bot' | 'other';
  browser: string;
  os: string;
}

/* ====================== SERVICE ====================== */

export class DeviceService {
  /**
   * Parses User-Agent and returns structured device information
   */
  static getDeviceInfo(userAgent: string, ip: string): DeviceInfo {
    const parser = new UAParser(userAgent);
    const result = parser.getResult();

    // Determine device type safely
    let deviceType: DeviceInfo['deviceType'] = 'desktop';

    const uaDeviceType = result.device?.type;

    if (uaDeviceType === 'mobile') deviceType = 'mobile';
    else if (uaDeviceType === 'tablet') deviceType = 'tablet';
    else if (uaDeviceType === 'console') deviceType = 'other';
    else if (uaDeviceType === 'smarttv') deviceType = 'other';
    else if (uaDeviceType === 'wearable') deviceType = 'other';
    else if (uaDeviceType === 'embedded') deviceType = 'other';
    else if (uaDeviceType === 'xr') deviceType = 'other';

    // Bot detection (important - ua-parser-js does NOT put 'bot' in device.type)
    const isBot = result.ua?.toLowerCase().includes('bot') ||
                  result.browser?.name?.toLowerCase().includes('bot') ||
                  !!result.device?.model?.toLowerCase().includes('bot');

    if (isBot) {
      deviceType = 'bot';
    }

    // Create stable device fingerprint
    const fingerprint = `${result.browser?.name || 'unknown'}-${result.os?.name || 'unknown'}-${result.os?.version || ''}-${ip}`;

    const deviceId = uuidv5(fingerprint, uuidv5.DNS);

    return {
      deviceId,
      deviceName: `${result.browser?.name || 'Unknown Browser'} on ${result.os?.name || 'Unknown OS'}`,
      deviceType,
      browser: `${result.browser?.name || 'Unknown'} ${result.browser?.version || ''}`.trim(),
      os: `${result.os?.name || 'Unknown'} ${result.os?.version || ''}`.trim(),
    };
  }

  /**
   * Generate a random session token (UUID v4)
   */
  static generateSessionToken(): string {
    return uuidv4();
  }

  /**
   * Generate a refresh token (optional - longer lived)
   */
  static generateRefreshToken(): string {
    return uuidv4();
  }
}