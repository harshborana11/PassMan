export async function checkAuth() {
  const raw = localStorage.getItem('creds');
  console.log(raw)
  if (!raw) return false;

  let creds;
  try {
    creds = JSON.parse(raw); // parses { token: '...' }
  } catch (e) {
    console.error('Invalid creds in localStorage:', e);
    localStorage.removeItem('creds');
    return false;
  }

  const token = creds.token;
  if (!token) {
    localStorage.removeItem('creds');
    return false;
  }

  try {
    const res = await fetch('/api/auth/checkAuth', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      localStorage.removeItem('creds');
      return false;
    }

    // Check if response is JSON
    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.warn('Response is not JSON:', await res.text());
      localStorage.removeItem('creds');
      return false;
    }

    const data = await res.json();
    return data.loggedIn === true;
  } catch (err) {
    console.error('Auth check failed:', err);
    localStorage.removeItem('creds');
    return false;
  }
}

