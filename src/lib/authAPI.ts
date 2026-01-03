export async function verifyApiKey(apiKey: string) {
  const res = await fetch('http://localhost:8080/auth/verify-api-key', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apiKey })
  });

  if (!res.ok) {
    throw new Error('Invalid API key');
  }
  return res.json();
}
