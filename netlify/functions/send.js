import { getContent, initializeStore } from "./lib/site-data.js";

const json = (statusCode, body) => ({
  statusCode,
  headers: {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  },
  body: JSON.stringify(body),
});

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Faqat POST soʻrovi qabul qilinadi." });
  }

  const { BOT_TOKEN, CHAT_ID } = process.env;
  if (!BOT_TOKEN || !CHAT_ID) {
    console.error("BOT_TOKEN yoki CHAT_ID Netlify environment variables ichida yoʻq.");
    return json(500, { error: "Server sozlamalari toʻliq emas." });
  }

  let data;
  try {
    data = JSON.parse(event.body || "{}");
  } catch {
    return json(400, { error: "Soʻrov formati notoʻgʻri." });
  }

  const name = typeof data.name === "string" ? data.name.trim() : "";
  const phone = typeof data.phone === "string" ? data.phone.trim() : "";
  const topic = typeof data.topic === "string" ? data.topic.trim() : "";
  const message = typeof data.message === "string" ? data.message.trim() : "";
  const website = typeof data.website === "string" ? data.website.trim() : "";

  if (website) {
    return json(200, { ok: true });
  }
  if (!name || name.length > 60 || !phone || phone.length > 30) {
    return json(400, { error: "Ism yoki telefon raqami notoʻgʻri." });
  }
  let allowedTopics;
  try {
    initializeStore(event);
    const content = await getContent();
    allowedTopics = content.contact.topicOptions;
  } catch (error) {
    console.error("Forma sozlamalarini olib boʻlmadi:", error);
    return json(500, { error: "Forma sozlamalarini olib boʻlmadi." });
  }
  if (!allowedTopics.includes(topic) || message.length > 800) {
    return json(400, { error: "Forma maʼlumotlari notoʻgʻri." });
  }

  const text = [
    "Saytdan yangi murojaat",
    `Ism: ${name}`,
    `Telefon: ${phone}`,
    `Mavzu: ${topic}`,
    `Xabar: ${message || "(kiritilmagan)"}`,
  ].join("\n");

  try {
    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: CHAT_ID, text }),
      },
    );

    if (!telegramResponse.ok) {
      const errorBody = await telegramResponse.text();
      console.error("Telegram sendMessage soʻrovi bajarilmadi:", errorBody);
      return json(502, { error: "Telegram xabarni qabul qilmadi." });
    }
  } catch (error) {
    console.error("Telegram bilan bogʻlanib boʻlmadi:", error);
    return json(502, { error: "Telegram bilan bogʻlanib boʻlmadi." });
  }

  return json(200, { ok: true });
};
