
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';

export class SecureStorage {
  private static readonly ENCRYPTION_KEY = 'leeo_app_encryption_key';

  // Store encrypted data
  static async setItem(key: string, value: string): Promise<void> {
    try {
      // Generate a hash of the value for integrity checking
      const hash = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        value
      );
      
      const dataToStore = JSON.stringify({
        value,
        hash,
        timestamp: Date.now(),
      });

      await SecureStore.setItemAsync(key, dataToStore);
      console.log(`Securely stored item with key: ${key}`);
    } catch (error) {
      console.error('Error storing secure item:', error);
      throw new Error('Failed to store secure data');
    }
  }

  // Retrieve and decrypt data
  static async getItem(key: string): Promise<string | null> {
    try {
      const storedData = await SecureStore.getItemAsync(key);
      
      if (!storedData) {
        return null;
      }

      const parsedData = JSON.parse(storedData);
      const { value, hash, timestamp } = parsedData;

      // Verify data integrity
      const currentHash = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        value
      );

      if (currentHash !== hash) {
        console.warn('Data integrity check failed for key:', key);
        await this.deleteItem(key); // Remove corrupted data
        return null;
      }

      // Check if data is older than 30 days (optional expiration)
      const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
      if (Date.now() - timestamp > thirtyDaysInMs) {
        console.log('Stored data expired for key:', key);
        await this.deleteItem(key);
        return null;
      }

      return value;
    } catch (error) {
      console.error('Error retrieving secure item:', error);
      return null;
    }
  }

  // Delete stored data
  static async deleteItem(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
      console.log(`Deleted secure item with key: ${key}`);
    } catch (error) {
      console.error('Error deleting secure item:', error);
    }
  }

  // Check if item exists
  static async hasItem(key: string): Promise<boolean> {
    try {
      const item = await this.getItem(key);
      return item !== null;
    } catch (error) {
      console.error('Error checking secure item existence:', error);
      return false;
    }
  }

  // Store user session data
  static async storeUserSession(userData: any): Promise<void> {
    const sessionData = {
      ...userData,
      loginTime: Date.now(),
      sessionId: await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        `${userData.id}_${Date.now()}`
      ),
    };

    await this.setItem('user_session', JSON.stringify(sessionData));
  }

  // Get user session data
  static async getUserSession(): Promise<any | null> {
    try {
      const sessionData = await this.getItem('user_session');
      if (!sessionData) return null;

      const parsedSession = JSON.parse(sessionData);
      
      // Check session timeout (24 hours)
      const sessionTimeout = 24 * 60 * 60 * 1000; // 24 hours
      if (Date.now() - parsedSession.loginTime > sessionTimeout) {
        console.log('User session expired');
        await this.deleteItem('user_session');
        return null;
      }

      return parsedSession;
    } catch (error) {
      console.error('Error retrieving user session:', error);
      return null;
    }
  }

  // Clear user session
  static async clearUserSession(): Promise<void> {
    await this.deleteItem('user_session');
  }

  // Store payment information (PCI-DSS compliant approach)
  static async storePaymentToken(token: string): Promise<void> {
    // Only store tokenized payment data, never raw card numbers
    await this.setItem('payment_token', token);
  }

  // Get payment token
  static async getPaymentToken(): Promise<string | null> {
    return await this.getItem('payment_token');
  }

  // Clear all secure data (for logout)
  static async clearAllData(): Promise<void> {
    try {
      await this.clearUserSession();
      await this.deleteItem('payment_token');
      await this.deleteItem('biometric_enabled');
      await this.deleteItem('app_settings');
      console.log('All secure data cleared');
    } catch (error) {
      console.error('Error clearing secure data:', error);
    }
  }

  // Store app settings
  static async storeAppSettings(settings: any): Promise<void> {
    await this.setItem('app_settings', JSON.stringify(settings));
  }

  // Get app settings
  static async getAppSettings(): Promise<any | null> {
    try {
      const settings = await this.getItem('app_settings');
      return settings ? JSON.parse(settings) : null;
    } catch (error) {
      console.error('Error retrieving app settings:', error);
      return null;
    }
  }
}
