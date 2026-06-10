import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) return NextResponse.json({ error: "No session payload" }, { status: 400 });

    const apiKey = process.env.YANDEX_API_KEY;
    const folderId = process.env.YANDEX_FOLDER_ID;

    // 1. Затягиваем данные о юзере из Supabase
    const { data: userProfile, error: profileError } = await supabase
      .from("user_archetypes")
      .select("primary_archetype, shadow_level, is_premium_unlocked") // На ShadowMirror продаем "профиль", а не подписку
      .eq("session_id", sessionId)
      .single();

    if (profileError || !userProfile) {
      // Если юзер еще не проходил Shadow Mirror — возвращаем мок-данные и статус "unsubscribed"
      return NextResponse.json({
        archetype: "Unknown",
        shadowLevel: "?",
        ritual: "Go to 'Rescan Identity' to calibrate the Codex matrix.",
        isSubscribed: false
      });
    }

    // 💡 ТУТ БУДЕТ КЭШ: Мы должны хранить сгенерированный ритуал в таблице daily_rituals, чтобы не тратить API на каждый GET запрос за день.
    // Но для MVP для наглядности — генерируем ИИ ритуал на лету.

    // 2. Генерируем ритуал через ИИ на основе архетипа
    const systemPrompt = `You are an expert in behavioral psychoanalysis and the founder of Neuro-Alchemy practices. 
    A user is identified as "${userProfile.primary_archetype}" archetype with ${userProfile.shadow_level}% shadow density. 
    Write a brief, potent Daily Codex integration ritual for today. Tone: Psychological, academic, mysterious, clinical. 
    Structure: '## THE FOCUS: ', '## THE PRACTICE: (CBT-based, 3-min)', '## THE INSIGHT: '. Strictly in English. Use clear Markdown.`;

    const yandexResponse = await fetch("https://llm.api.cloud.yandex.net/foundationModels/v1/completion", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Api-Key ${apiKey}` },
      body: JSON.stringify({
        modelUri: `gpt://${folderId}/yandexgpt-lite/latest`,
        completionOptions: { stream: false, temperature: 0.7, maxTokens: 1200 },
        messages: [{ role: "system", text: systemPrompt }, { role: "user", text: `Generate Daily Codex matrix.` }]
      })
    });

    const yandexData = await yandexResponse.json();
    const aiRitual = yandexData.result?.alternatives?.[0]?.message?.text;

    if (!aiRitual) throw new Error("AI Calibration failed");

    // Возвращаем данные: архетип, тень, ритуал и статус подписки (берем его из user_archetypes пока)
    return NextResponse.json({
      archetype: userProfile.primary_archetype,
      shadowLevel: userProfile.shadow_level,
      ritual: aiRitual,
      isSubscribed: userProfile.is_premium_unlocked // Пока завязываем подписку на оплату Теневого Портрета
    });

  } catch (error) {
    console.error("Alchemy API Error:", error);
    return NextResponse.json({ error: "Codex transmission severed." }, { status: 500 });
  }
}