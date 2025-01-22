import OpenAI from 'openai';

export class ApiService {
    static async getRepoContents(repo, githubToken) {
        try {
            const [owner, repoName] = repo.split('/');
            const response = await fetch(`https://api.github.com/repos/${owner}/${repoName}/contents`, {
                headers: {
                    'Authorization': `token ${githubToken}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.status}`);
            }

            const contents = await response.json();
            const files = [];

            // Only get content of code files, limit to prevent token overflow
            const codeExtensions = ['.js', '.py', '.java', '.cpp', '.html', '.css', '.md'];
            
            for (const item of contents) {
                if (item.type === 'file' && codeExtensions.some(ext => item.name.endsWith(ext))) {
                    const fileResponse = await fetch(item.download_url);
                    const content = await fileResponse.text();
                    files.push({
                        name: item.name,
                        path: item.path,
                        content: content
                    });
                }
            }

            return files;
        } catch (error) {
            console.error('Error fetching repo contents:', error);
            throw error;
        }
    }

    static async sendMessageToOpenAI(files, message, openaiKey, onToken) {
        try {
            const openai = new OpenAI({ 
                apiKey: openaiKey,
                dangerouslyAllowBrowser: true
            });
            
            const context = files.map(file => 
                `File: ${file.path}\n\`\`\`\n${file.content}\n\`\`\``
            ).join('\n\n');
    
            const stream = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: `You are a helpful AI assistant that analyzes GitHub repositories. 
                                Analyze the repository content and answer questions about it.
                                Format your responses using markdown.`
                    },
                    {
                        role: "user",
                        content: `Repository content:\n${context}\n\nQuestion: ${message}`
                    }
                ],
                temperature: 0.7,
                max_tokens: 1500,
                stream: true // Enable streaming
            });
    
            let fullResponse = '';
            for await (const chunk of stream) {
                const content = chunk.choices[0]?.delta?.content || '';
                fullResponse += content;
                if (onToken) {
                    onToken(content);
                }
            }
            return fullResponse;
        } catch (error) {
            console.error('OpenAI API error:', error);
            throw error;
        }
    }

    static async sendMessage(message, repo, githubToken, openaiKey) {
        try {
            // First get repository contents
            const files = await this.getRepoContents(repo, githubToken);
            
            // Then process with OpenAI
            const response = await this.sendMessageToOpenAI(files, message, openaiKey);
            
            return { response };
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
}