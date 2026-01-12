const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function login(body: any) {
  const res = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`Login failed with status ${res.status}`);
  }

  return res.json();
}
