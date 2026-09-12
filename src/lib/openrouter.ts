import { MealType, UserGoal } from "./types";

export interface CompanionPromptInput {
  owner: string;
  goal?: UserGoal;
  mealType: MealType;
  apiKey?: string;
  model?: string;
}

const DEFAULT_MODEL = "google/gemini-2.0-flash-exp:free";

const FALLBACK_NOTES: Record<MealType, string[]> = {
  Breakfast: [
    "A warm, anchor carb and a touch of protein gives your mind and body steady clarity to start the morning peacefully.",
    "Morning meals don't need to be elaborate to be nourishing. A simple warm plate is an act of gentle kindness to yourself.",
    "Fueling up before the rush of the day keeps your energy grounded and steady all through the morning.",
  ],
  Lunch: [
    "Midday fuel time. Pairing an anchor carb with cooked protein keeps your focus sharp and prevents that 3 PM slump.",
    "Take 10 minutes to step away and feed yourself. Nourishment isn't an interruption to your day—it's what powers it.",
    "A comforting, balanced plate right now gives you sustained fuel without feeling heavy.",
  ],
  Dinner: [
    "Dinner is your chance to unwind and replenish. A satisfying meal signals to your nervous system that the day's work is done.",
    "Nourishing yourself tonight helps your body restore and rebuild while you rest. Enjoy every bite.",
    "Comforting, hearty, and wholesome. Taking time for a warm evening plate is self-care in its purest form.",
  ],
  Snack: [
    "A small, thoughtful nibble between tasks keeps your blood sugar even and your mind calm.",
    "Listening to your hunger cues with a quick snack prevents late-day fatigue. You're taking good care of yourself.",
    "Simple fruit, nuts, or a quick bite gives you just the right lift without complicated cooking.",
  ],
};

export function getDefaultFallbackNote(
  mealType: MealType,
  owner?: string,
  _goal?: UserGoal
): string {
  const notes = FALLBACK_NOTES[mealType] || FALLBACK_NOTES.Lunch;
  // Deterministic pick based on today's date so it changes daily even offline
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
      1000 /
      60 /
      60 /
      24
  );
  const selected = notes[dayOfYear % notes.length];
  if (owner && owner.toLowerCase() !== "esther") {
    return selected;
  }
  return selected;
}

export function buildCompanionPrompt(input: CompanionPromptInput): string {
  const { owner, goal, mealType } = input;
  const goalText = goal ? `Their current health/eating goal is "${goal}".` : "";

  return `You are Provisions, a warm, compassionate culinary companion and personal food mentor for ${owner}. ${goalText}
The user is currently deciding what to eat for ${mealType}.

Write a single, thoughtful note for ${owner} about eating ${mealType}.
Guidelines:
- 1 to 2 sentences maximum (approx 25-45 words).
- Tone: Grounded, compassionate, encouraging, zero diet culture, zero calorie counting, zero shame.
- Focus on how nourishing food brings sustained energy, mental clarity, and body kindness.
- Tailor the encouragement to ${mealType} and their goal of ${goal || "eating well"}.
- Do NOT use markdown bolding, hashtags, bullet points, or quotation marks. Output plain text only.`;
}

export async function fetchOpenRouterNote(input: CompanionPromptInput): Promise<string> {
  const apiKey = input.apiKey || process.env.OPENROUTER_API_KEY;
  const model = input.model || process.env.OPENROUTER_MODEL || DEFAULT_MODEL;

  if (!apiKey) {
    return getDefaultFallbackNote(input.mealType, input.owner, input.goal);
  }

  const prompt = buildCompanionPrompt(input);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": "https://provisions.kitchen",
        "X-Title": "Provisions Meal Builder",
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 120,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`OpenRouter returned status ${response.status}. Using fallback note.`);
      return getDefaultFallbackNote(input.mealType, input.owner, input.goal);
    }

    const data = await response.json();
    const rawContent = data?.choices?.[0]?.message?.content?.trim();

    if (!rawContent) {
      return getDefaultFallbackNote(input.mealType, input.owner, input.goal);
    }

    // Clean any accidental markdown quotes or leading/trailing quotation marks
    return rawContent.replace(/^["']|["']$/g, "").replace(/\*\*/g, "").trim();
  } catch (error) {
    clearTimeout(timeoutId);
    console.warn("OpenRouter note generation failed. Using graceful fallback:", error);
    return getDefaultFallbackNote(input.mealType, input.owner, input.goal);
  }
}
