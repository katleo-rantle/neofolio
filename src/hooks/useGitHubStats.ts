import { useState, useEffect } from 'react';

interface GitHubStats {
  publicRepos: number;
  followers: number;
  latestRepo: {
    name: string;
    language: string | null;
  } | null;
  latestActivity: {
    type: string;
    repo: string;
    timeAgo: string;
  } | null;
}

export function useGitHubStats(username: string) {
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchStats = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch user profile
        const userRes = await fetch(`https://api.github.com/users/${username}`);
        if (!userRes.ok) throw new Error('Failed to fetch user');
        const userData = await userRes.json();

        // Fetch repos
        const reposRes = await fetch(
          `https://api.github.com/users/${username}/repos?sort=pushed&per_page=1`,
        );
        if (!reposRes.ok) throw new Error('Failed to fetch repos');
        const reposData = await reposRes.json();

        // Fetch events
        const eventsRes = await fetch(
          `https://api.github.com/users/${username}/events/public?per_page=5`,
        );
        if (!eventsRes.ok) throw new Error('Failed to fetch events');
        const eventsData = await eventsRes.json();

        if (!isMounted) return;

        // Process latest activity
        let latestActivity = null;
        if (eventsData && eventsData.length > 0) {
          const event = eventsData[0];

          // Calculate time ago
          const date = new Date(event.created_at);
          const now = new Date();
          const diffMs = now.getTime() - date.getTime();
          const diffMins = Math.floor(diffMs / 60000);
          const diffHours = Math.floor(diffMins / 60);
          const diffDays = Math.floor(diffHours / 24);

          let timeAgo = '';
          if (diffDays > 0) timeAgo = `${diffDays}d ago`;
          else if (diffHours > 0) timeAgo = `${diffHours}h ago`;
          else if (diffMins > 0) timeAgo = `${diffMins}m ago`;
          else timeAgo = 'just now';

          // Format event type
          let type = event.type.replace('Event', '');
          if (type === 'Push') type = 'Commit';
          if (type === 'Create') type = 'Created';

          latestActivity = {
            type,
            repo: event.repo.name.split('/')[1] || event.repo.name,
            timeAgo,
          };
        }

        setStats({
          publicRepos: userData.public_repos,
          followers: userData.followers,
          latestRepo:
            reposData.length > 0
              ? {
                  name: reposData[0].name,
                  language: reposData[0].language || 'Unknown',
                }
              : null,
          latestActivity,
        });
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Unknown error');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchStats();

    return () => {
      isMounted = false;
    };
  }, [username]);

  return { stats, isLoading, error };
}
