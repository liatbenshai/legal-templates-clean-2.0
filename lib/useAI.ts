import { useState } from "react";

export function useAI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const improveText = async (text: string, context?: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/ai/improve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, context }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to improve text");
      }
      
      const data = await response.json();
      return data.improved;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      console.error("Improve error:", message);
      return text;
    } finally {
      setLoading(false);
    }
  };

  const getSuggestions = async (text: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/ai/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get suggestions");
      }
      
      const data = await response.json();
      return data.suggestions;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      console.error("Suggestions error:", message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return { improveText, getSuggestions, loading, error };
}
