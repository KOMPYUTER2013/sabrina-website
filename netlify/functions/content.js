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
  if (event.httpMethod !== "GET") {
    return json(405, { error: "Faqat GET soʻrovi qabul qilinadi." });
  }

  try {
    initializeStore(event);
    return json(200, await getContent());
  } catch (error) {
    console.error("Sayt matnlarini olishda xato:", error);
    return json(500, { error: "Sayt maʼlumotlarini olib boʻlmadi." });
  }
};
