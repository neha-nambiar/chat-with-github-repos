// Handles all Chrome storage operations
export const StorageService = {
    // Get saved tokens
    async getTokens() {
      try {
        const result = await chrome.storage.local.get(['githubToken', 'openaiKey']);
        return {
          githubToken: result.githubToken || '',
          openaiKey: result.openaiKey || ''
        };
      } catch (error) {
        console.error('Error getting tokens:', error);
        return { githubToken: '', openaiKey: '' };
      }
    },
  
    // Save tokens
    async saveTokens(githubToken, openaiKey) {
      try {
        await chrome.storage.local.set({
          githubToken,
          openaiKey
        });
        return true;
      } catch (error) {
        console.error('Error saving tokens:', error);
        return false;
      }
    },
  
    // Validate tokens exist
    async validateTokens() {
      const { githubToken, openaiKey } = await this.getTokens();
      return Boolean(githubToken && openaiKey);
    }
  };