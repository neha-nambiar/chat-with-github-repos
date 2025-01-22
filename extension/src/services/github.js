export function extractRepoFromUrl(url) {
    try {
        const match = url.match(/github\.com\/([^/]+\/[^/]+)/);
        if (!match) return null;
        
        // Clean up repository name
        let repo = match[1];
        repo = repo.replace(/\.git$/, ''); // Remove .git suffix if present
        repo = repo.split('/').slice(0, 2).join('/'); // Only take owner/repo part
        
        return repo;
    } catch (error) {
        console.error('Error extracting repo from URL:', error);
        return null;
    }
}

export function validateGitHubToken(token) {
    return token && token.startsWith('gh') && token.length > 20;
}