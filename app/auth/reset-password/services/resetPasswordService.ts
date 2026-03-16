export async function resetPasswordWithKey(key: string, password: string) {
  const response = await fetch('/api/auth/reset-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({key, password}),
  });

  const payload = (await response.json().catch(() => null)) as {
    message?: string;
  } | null;

  if (!response.ok) {
    throw new Error(payload?.message || 'Failed to reset password.');
  }

  return payload;
}
