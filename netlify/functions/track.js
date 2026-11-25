import { store } from "./lib/site-data.js";

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

  let data;
  try {
    data = JSON.parse(event.body || "{}");
  } catch {
    return json(400, { error: "Soʻrov formati notoʻgʻri." });
  }

  const visitorId = typeof data.visitorId === "string" ? data.visitorId : "";
  if (!/^[\da-f-]{36}$/i.test(visitorId)) {
    return json(400, { error: "Tashrif ID’si notoʻgʻri." });
  }

  const now = Date.now();
  const date = new Date(now).toISOString().slice(0, 10);

  try {
    const visitorKey = `visitors/${visitorId}`;
    const existing = await store.get(visitorKey);
    if (!existing) {
      await store.set(visitorKey, String(now));
    }

    await store.set(`daily/${date}/${visitorId}`, String(now));
    await store.set(`active/${visitorId}`, String(now));
    return json(200, { ok: true });
  } catch (error) {
    console.error("Sayt tashrifini saqlashda xato:", error);
    return json(500, { error: "Tashrif maʼlumotini saqlab boʻlmadi." });
  }
};
