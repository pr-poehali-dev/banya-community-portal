const SETUP_URL = 'https://functions.poehali.dev/663549b4-0da1-4264-b2e4-33e5e4da01b2';

export const telegramWebhook = {
  async checkStatus() {
    try {
      const response = await fetch(`${SETUP_URL}?action=info`);
      return await response.json();
    } catch (error) {
      console.error('Failed to check webhook status:', error);
      return null;
    }
  },

  async setup() {
    try {
      const response = await fetch(`${SETUP_URL}?action=setup`);
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Failed to setup webhook:', error);
      return { success: false, error: 'Network error' };
    }
  },

  async ensureWebhook() {
    const status = await this.checkStatus();
    
    // Если webhook не установлен или пустой URL
    if (!status || !status.url || status.url === '') {
      console.log('Webhook not configured, setting up...');
      const result = await this.setup();
      
      if (result.success) {
        console.log('Webhook configured successfully');
      } else {
        console.error('Failed to configure webhook:', result);
      }
      
      return result.success;
    }
    
    return true;
  }
};
