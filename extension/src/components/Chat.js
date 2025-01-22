import { ApiService } from '../services/api.js';
import { StorageService } from '../services/storage.js';

export class Chat {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.messagesContainer = document.getElementById('chat-messages');
        this.isEnabled = false;
        this.currentRepo = null;
        this.initialize();
    }

    initialize() {
        // Set up message input and send button
        const userInput = document.getElementById('user-input');
        const sendButton = document.getElementById('send-button');

        // Add event listeners
        sendButton.addEventListener('click', () => this.handleSend());
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleSend();
            }
        });

        // Disable initially
        this.disable();

        // Get current repo from URL
        this.getCurrentRepo();
    }

    async getCurrentRepo() {
        try {
            const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
            const url = tabs[0]?.url;
            if (url && url.includes('github.com')) {
                const repoMatch = url.match(/github\.com\/([^/]+\/[^/]+)/);
                if (repoMatch) {
                    this.currentRepo = repoMatch[1].replace(/\.git$/, '');
                }
            }
        } catch (error) {
            console.error('Error getting current repo:', error);
        }
    }

    enable() {
        this.isEnabled = true;
        document.getElementById('user-input').disabled = false;
        document.getElementById('send-button').disabled = false;
    }

    disable() {
        this.isEnabled = false;
        document.getElementById('user-input').disabled = true;
        document.getElementById('send-button').disabled = true;
    }

    async handleSend() {
        if (!this.isEnabled) return;

        const userInput = document.getElementById('user-input');
        const message = userInput.value.trim();
        
        if (!message) return;

        if (!this.currentRepo) {
            this.addMessage('Please navigate to a GitHub repository', 'error');
            return;
        }

        // Clear input
        userInput.value = '';

        // Add user message to chat
        this.addMessage(message, 'user');

        // Show loading state
        this.showLoading();

        try {
            // Get tokens
            const { githubToken, openaiKey } = await StorageService.getTokens();
            
            // Send message
            const response = await ApiService.sendMessage(
                message,
                this.currentRepo,
                githubToken,
                openaiKey
            );

            // Add response to chat
            this.addMessage(response.response, 'bot');
        } catch (error) {
            console.error('Chat error:', error);
            this.addMessage('Error: ' + error.message, 'error');
        } finally {
            this.hideLoading();
        }
    }

    addMessage(content, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        
        if (type === 'bot') {
            const markdownContent = document.createElement('div');
            markdownContent.className = 'markdown-content';
            messageDiv.appendChild(markdownContent);
            
            // Add message to container immediately
            this.messagesContainer.appendChild(messageDiv);
            
            // Create function to update content
            const updateContent = (newContent) => {
                markdownContent.innerHTML = marked.parse(newContent);
                messageDiv.querySelectorAll('pre code').forEach((block) => {
                    hljs.highlightElement(block);
                });
                this.scrollToBottom();
            };
            
            // If content is already a string, render it
            if (typeof content === 'string') {
                updateContent(content);
            } else if (content.then) {
                // If content is a promise (streaming), handle it
                let accumulated = '';
                content.then(updateContent)
                      .catch(error => {
                          messageDiv.textContent = `Error: ${error.message}`;
                          messageDiv.className = `message error-message`;
                      });
            }
        } else {
            messageDiv.textContent = content;
            this.messagesContainer.appendChild(messageDiv);
        }
        
        this.scrollToBottom();
    }
    
    async handleSend() {
        if (!this.isEnabled) return;
    
        const userInput = document.getElementById('user-input');
        const message = userInput.value.trim();
        
        if (!message) return;
    
        // Clear input
        userInput.value = '';
    
        // Add user message to chat
        this.addMessage(message, 'user');
    
        // Show loading state
        this.showLoading();
    
        try {
            // Get tokens
            const { githubToken, openaiKey } = await StorageService.getTokens();
            
            let responseContent = '';
            const messagePromise = new Promise((resolve, reject) => {
                // Send message
                ApiService.sendMessage(
                    message,
                    this.currentRepo,
                    githubToken,
                    openaiKey,
                    (token) => {
                        responseContent += token;
                        this.updateLastBotMessage(responseContent);
                    }
                )
                .then(response => resolve(response.response))
                .catch(reject);
            });
    
            // Add bot message container that will be updated
            this.addMessage(messagePromise, 'bot');
        } catch (error) {
            console.error('Chat error:', error);
            this.addMessage('Error: ' + error.message, 'error');
        } finally {
            this.hideLoading();
        }
    }
    
    updateLastBotMessage(content) {
        const lastMessage = this.messagesContainer.querySelector('.bot-message:last-child .markdown-content');
        if (lastMessage) {
            lastMessage.innerHTML = marked.parse(content);
            lastMessage.querySelectorAll('pre code').forEach((block) => {
                hljs.highlightElement(block);
            });
            this.scrollToBottom();
        }
    }

    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    showLoading() {
        const loading = document.getElementById('loading');
        if (loading) loading.style.display = 'flex';
        this.disable();
    }

    hideLoading() {
        const loading = document.getElementById('loading');
        if (loading) loading.style.display = 'none';
        this.enable();
    }
}