export interface MealSanitizationInput {
  main: string;
  protein?: string;
  supplementary?: string[];
  mealType: string;
  dishName?: string;
  culinaryNote?: string;
}

export interface SanitizedMealOutput {
  dishName: string;
  culinaryNote: string;
  validSides: string[];
}

const DEFAULT_MODEL = "google/gemini-2.0-flash-exp:free";

/**
 * AI Meal Sanitizer / Harmonizer
 * Asynchronously reviews proposed meal combinations to ensure cultural authenticity,
 * strips conflicting ingredients (e.g., fresh fruit on savory swallow),
 * and enhances dish titles.
 *
 * NOTE: If rate-limited, timed out, offline, or encountering any error,
 * this function silently returns `null` so the user experiences zero lag or disruption.
 */
export async function sanitizeMealWithAI(
  input: MealSanitizationInput,
  apiKey?: string
): Promise<SanitizedMealOutput | null> {
  const resolvedKey = apiKey || process.env.OPENROUTER_API_KEY;
  if (!resolvedKey) {
    return null;
  }

  const model = process.env.OPENROUTER_MODEL || DEFAULT_MODEL;

  const prompt = `You are an expert Nigerian chef and culinary AI.
Review this proposed meal for cultural authenticity, appetising presentation, and ingredient harmony:
- Anchor Base: "${input.main}"
- Protein: "${input.protein || "None"}"
- Sides / Greens: ${input.supplementary && input.supplementary.length > 0 ? JSON.stringify(input.supplementary) : "None"}
- Meal Type: "${input.mealType}"
- Proposed Title: "${input.dishName || ""}"

Rules:
1. Culinary harmony:
   - Fresh fruits (watermelon, grapes, apples) NEVER belong with savory swallows (Amala, Eba, Fufu) or savory stews. If an incompatible side is present, exclude it from validSides.
   - Cooking oils are cooking mediums, not standalone sides.
2. Authentic naming:
   - Provide an authentic, mouth-watering dish name (e.g. "Amala with Savory Stew & Croaker Fish", "Rice & Beans with Dodo", "Creamy Oatmeal with Fruit & Seeds").
3. Warm culinary note:
   - 1 short, appetizing sentence explaining why this dish is comforting and balanced.

Respond ONLY with valid JSON matching this exact structure:
{
  "dishName": "Dish Name",
  "culinaryNote": "One sentence description.",
  "validSides": ["Side1", "Side2"]
}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2500);

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resolvedKey}`,
        "HTTP-Referer": "https://provisions.kitchen",
        "X-Title": "Provisions Meal Builder",
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 150,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const rawContent = data?.choices?.[0]?.message?.content?.trim();
    if (!rawContent) return null;

    // Extract JSON block if wrapped in markdown code fence
    const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    const parsed = JSON.parse(jsonMatch[0]);
    if (typeof parsed.dishName !== "string" || typeof parsed.culinaryNote !== "string") {
      return null;
    }

    return {
      dishName: parsed.dishName.trim(),
      culinaryNote: parsed.culinaryNote.trim(),
      validSides: Array.isArray(parsed.validSides) ? parsed.validSides : [],
    };
  } catch {
    clearTimeout(timeoutId);
    // Silent fallback on abort, timeout, rate-limit, or parsing error
    return null;
  }
}
