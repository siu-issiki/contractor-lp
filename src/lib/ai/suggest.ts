export async function fetchSuggestions(
  messages: { role: string; content: string }[]
): Promise<string[]> {
  try {
    const res = await fetch('/api/suggest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
    });

    if (!res.ok) return [];

    const data = await res.json();
    return data.suggestions ?? [];
  } catch {
    return [];
  }
}
