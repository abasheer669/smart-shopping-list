const BASE_URL = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/api`
  : '/api';

async function handleResponse(res) {
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.status === 204 ? null : res.json();
}

export const api = {
  /** Fetch all shopping items */
  getItems: () =>
    fetch(`${BASE_URL}/items`).then(handleResponse),

  /** Create a new item and trigger AI price estimation */
  createItem: (name) =>
    fetch(`${BASE_URL}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    }).then(handleResponse),

  /** Delete an item by ID */
  deleteItem: (id) =>
    fetch(`${BASE_URL}/items/${id}`, { method: 'DELETE' }).then(handleResponse),
};
