/**
 * DukaanMitra API boundary.
 * Replace the mock implementations with the FastAPI base URL when the backend is ready.
 */
export const api = {
  transcribe: async (audio: Blob) => ({ text: '', language: 'te-IN', audioSize: audio.size }),
  parseOrder: async (transcript: string) => ({ transcript, items: [] }),
  confirmOrder: async (order: unknown) => ({ order, id: 'DM-1049', status: 'confirmed' }),
  synthesizeSpeech: async (text: string) => ({ text, audioUrl: null as string | null }),
  listOrders: async () => [],
  listInventory: async () => [],
}
