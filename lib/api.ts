const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const api = {
  // 1. SPEECH TO TEXT - GNANI PRISMA
  transcribe: async (audio: Blob) => {
    if (!API_URL) {
      throw new Error("Backend API URL is not configured.");
    }

    const formData = new FormData();
    formData.append("audio", audio, "recording.webm");

    const response = await fetch(`${API_URL}/api/transcribe`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      let errorMessage = "Transcription failed.";

      try {
        const error = await response.json();
        errorMessage = error.detail || errorMessage;
      } catch {}

      throw new Error(errorMessage);
    }

    const result = await response.json();

    return {
      text: result.transcript,
      language: result.language,
      audioSize: audio.size,
    };
  },

  // 2. GROCERY ORDER PARSING
  parseOrder: async (transcript: string) => {
    if (!API_URL) {
      throw new Error("Backend API URL is not configured.");
    }

    const response = await fetch(`${API_URL}/api/parse-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ transcript }),
    });

    if (!response.ok) {
      let errorMessage = "Order parsing failed.";

      try {
        const error = await response.json();
        errorMessage = error.detail || errorMessage;
      } catch {}

      throw new Error(errorMessage);
    }

    const result = await response.json();

    return {
      transcript,
      items: result.items,
    };
  },

  // 3. ORDER CONFIRMATION + GNANI TTS
  confirmOrder: async (order: any) => {
    if (!API_URL) {
      throw new Error("Backend API URL is not configured.");
    }

    const response = await fetch(`${API_URL}/api/confirm-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: order.items,
        total: order.total,
      }),
    });

    if (!response.ok) {
      let errorMessage = "Order confirmation failed.";

      try {
        const error = await response.json();
        errorMessage = error.detail || errorMessage;
      } catch {}

      throw new Error(errorMessage);
    }

    const result = await response.json();

    return {
      id: result.order_id,
      status: result.status,
      order: result.items,
      total: result.total,
      confirmationText: result.confirmation_text,
      audioUrl: `data:${result.audio_type};base64,${result.audio_base64}`,
    };
  },

  // 4. SPEECH SYNTHESIS
  synthesizeSpeech: async (text: string) => ({
    text,
    audioUrl: null as string | null,
  }),

  // 5. ORDER HISTORY - SQLITE BACKEND
  listOrders: async () => {
    if (!API_URL) {
      throw new Error("Backend API URL is not configured.");
    }

    const response = await fetch(`${API_URL}/api/orders`, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch order history.");
    }

    const result = await response.json();

    return result.orders || [];
  },

  // 6. INVENTORY
  listInventory: async () => [],
};