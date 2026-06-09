const GITHUB_API = 'https://api.github.com';

export async function fetchRepoFile(token, owner, repo, path = 'data.json') {
  const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
    },
  });
  if (res.status === 404) return { content: null, sha: null };
  if (!res.ok) throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
  const json = await res.json();
  const content = JSON.parse(atob(json.content.replace(/\n/g, '')));
  return { content, sha: json.sha };
}

export async function saveRepoFile(token, owner, repo, data, sha, path = 'data.json') {
  const content = btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2))));
  const body = {
    message: `Update PhD tracker data — ${new Date().toISOString()}`,
    content,
    ...(sha ? { sha } : {}),
  };
  const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `GitHub API error: ${res.status}`);
  }
  const json = await res.json();
  return json.content.sha;
}

export async function createRepo(token, repoName) {
  const res = await fetch(`${GITHUB_API}/user/repos`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: repoName,
      description: 'PhD Tracker data repository',
      private: false,
      auto_init: false,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to create repository');
  }
  return res.json();
}

export async function getAuthenticatedUser(token) {
  const res = await fetch(`${GITHUB_API}/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
    },
  });
  if (!res.ok) throw new Error('Invalid token or GitHub API error');
  return res.json();
}

export async function addCollaborator(token, owner, repo, username) {
  const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/collaborators/${username}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ permission: 'push' }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to add collaborator');
  }
}
