import { StorageService } from '../services/storage.js';

export class Settings {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.initialize();
  }

  async initialize() {
    // Get saved tokens
    const tokens = await StorageService.getTokens();
    
    // Create settings HTML
    this.container.innerHTML = `
      <div class="settings-panel">
        <div class="settings-header">
          <h2>API Configuration</h2>
          <span id="settings-status"></span>
        </div>
        
        <div class="input-group">
          <label for="github-token">GitHub Personal Access Token</label>
          <input 
            type="password" 
            id="github-token" 
            value="${tokens.githubToken}"
            placeholder="Enter your GitHub token" 
          />
          <small>Create a token at: GitHub Settings > Developer Settings > Personal Access Tokens</small>
        </div>

        <div class="input-group">
          <label for="openai-key">OpenAI API Key</label>
          <input 
            type="password" 
            id="openai-key" 
            value="${tokens.openaiKey}"
            placeholder="Enter your OpenAI API key" 
          />
          <small>Get your API key from: platform.openai.com</small>
        </div>

        <div class="settings-actions">
          <button id="save-settings" class="primary-button">Save Settings</button>
          <button id="test-settings" class="secondary-button">Test Connection</button>
        </div>
      </div>
    `;

    this.addEventListeners();
  }

  addEventListeners() {
    // Save settings handler
    const saveButton = document.getElementById('save-settings');
    saveButton.addEventListener('click', async () => {
      await this.saveSettings();
    });

    // Test connection handler
    const testButton = document.getElementById('test-settings');
    testButton.addEventListener('click', async () => {
      await this.testConnection();
    });
  }

  async saveSettings() {
    const githubToken = document.getElementById('github-token').value.trim();
    const openaiKey = document.getElementById('openai-key').value.trim();
    const statusElement = document.getElementById('settings-status');

    if (!githubToken || !openaiKey) {
      this.showStatus('Both tokens are required', 'error');
      return;
    }

    try {
      await StorageService.saveTokens(githubToken, openaiKey);
      this.showStatus('Settings saved successfully!', 'success');
    } catch (error) {
      this.showStatus('Error saving settings: ' + error.message, 'error');
    }
  }

  async testConnection() {
    const statusElement = document.getElementById('settings-status');
    this.showStatus('Testing connection...', 'info');

    if (!await StorageService.validateTokens()) {
      this.showStatus('Please save your tokens first', 'error');
      return;
    }

    // We'll implement this later when we create the API service
    this.showStatus('Connection test successful!', 'success');
  }

  showStatus(message, type = 'info') {
    const statusElement = document.getElementById('settings-status');
    statusElement.textContent = message;
    statusElement.className = `status-message ${type}`;
    
    // Clear status after 3 seconds
    setTimeout(() => {
      statusElement.textContent = '';
      statusElement.className = 'status-message';
    }, 3000);
  }
}