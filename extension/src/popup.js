import { Settings } from './components/Settings.js';
import { Chat } from './components/Chat.js';
import { StorageService } from './services/storage.js';
import { extractRepoFromUrl } from './services/github.js';
import '../styles/main.css';
import '../styles/components/settings.css';
import '../styles/components/chat.css';

class PopupManager {
    constructor() {
        this.settings = null;
        this.chat = null;
        this.initialize();
    }

    async initialize() {
        // Initialize components
        this.settings = new Settings('settings');
        this.chat = new Chat('chat');

        // Setup event listeners
        this.setupResizeListener();
        
        // Check tokens and repository
        await this.checkInitialState();
    }

    async checkInitialState() {
        try {
            // Check if tokens exist
            const hasTokens = await StorageService.validateTokens();
            if (!hasTokens) {
                this.showMessage('Please configure your API tokens in settings', 'warning');
                return;
            }

            // Enable chat if tokens exist
            this.chat.enable();

        } catch (error) {
            console.error('Initialization error:', error);
            this.showMessage('Error initializing: ' + error.message, 'error');
        }
    }

    updateRepoInfo(repoName) {
        const repoInfo = document.getElementById('repo-info');
        repoInfo.innerHTML = `
            <div class="repo-info">
                <svg class="repo-icon" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"/>
                </svg>
                <span>${repoName}</span>
            </div>
        `;
    }

    showMessage(message, type = 'info') {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${type}-message`;
        messageElement.textContent = message;
        document.getElementById('messages').appendChild(messageElement);

        // Remove message after 5 seconds
        setTimeout(() => {
            messageElement.remove();
        }, 5000);
    }

    setupResizeListener() {
        const resizeHandle = document.getElementById('resize-handle');
        let isResizing = false;
        let startX, startY;
        let startWidth, startHeight;
        const popup = document.documentElement;

        resizeHandle.addEventListener('mousedown', initResize);

        function initResize(e) {
            isResizing = true;
            startX = e.clientX;
            startY = e.clientY;
            startWidth = popup.offsetWidth;
            startHeight = popup.offsetHeight;

            document.addEventListener('mousemove', resize);
            document.addEventListener('mouseup', stopResize);
            e.preventDefault();
        }

        function resize(e) {
            if (!isResizing) return;

            const width = startWidth + (e.clientX - startX);
            const height = startHeight + (e.clientY - startY);

            if (width >= 300) {
                popup.style.width = width + 'px';
                document.body.style.width = width + 'px';
            }
            if (height >= 400) {
                popup.style.height = height + 'px';
                document.body.style.height = height + 'px';
            }

            e.preventDefault();
        }

        function stopResize() {
            isResizing = false;
            document.removeEventListener('mousemove', resize);
            document.removeEventListener('mouseup', stopResize);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new PopupManager();
});