import { timingSafeEqual } from "node:crypto";
import { contentSections } from "../../src/site-content.js";
import { getTrafficStats, getContent, initializeStore } from "./lib/site-data.js";

const json = (statusCode, body) => ({
  statusCode,
  headers: {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  },
  body: JSON.stringify(body),
});

function isAuthorized(event) {
  const expected = process.env.ADMIN_API_TOKEN;
  const supplied = event.headers.authorization || event.headers.Authorization || "";
  const token = supplied.startsWith("Bearer ") ? supplied.slice(7) : "";

  if (!expected || !token) return false;
  const expectedBytes = Buffer.from(expected);
  const suppliedBytes = Buffer.from(token);
  return (
    expectedBytes.length === suppliedBytes.length &&
    timingSafeEqual(expectedBytes, suppliedBytes)
  );
}

function setValue(object, path, value) {
  const keys = path.split(".");
  const parent = keys.slice(0, -1).reduce((current, key) => current[key], object);
  parent[keys.at(-1)] = value;
}

export const handler = async (event) => {
  if (!isAuthorized(event)) {
    return json(401, { error: "Ruxsat yoʻq." });
  }

  try {
    const store = initializeStore(event);
    if (event.httpMethod === "GET") {
      const resource = event.queryStringParameters?.resource;
      if (resource === "fields") {
        return json(200, { sections: contentSections });
      }
      if (resource === "content") {
        return json(200, await getContent());
      }
      if (resource === "stats") {
        return json(200, await getTrafficStats(30));
      }
      return json(400, { error: "Soʻrov turi notoʻgʻri." });
    }

    if (event.httpMethod === "POST") {
      let data;
      try {
        data = JSON.parse(event.body || "{}");
      } catch {
        return json(400, { error: "Soʻrov formati notoʻgʻri." });
      }

      const { path, value } = data;
      const allowed = contentSections
        .flatMap((section) => section.fields)
        .some((field) => field.path === path);
      if (!allowed || typeof value !== "string" || value.length > 3500) {
        return json(400, { error: "Maydon yoki matn notoʻgʻri." });
      }

      const content = await getContent();
      setValue(content, path, value);
      await store.set("content", JSON.stringify(content));
      return json(200, { ok: true });
    }

    return json(405, { error: "Faqat GET va POST soʻrovlari qabul qilinadi." });
  } catch (error) {
    console.error("Admin API soʻrovini bajarishda xato:", error);
    return json(500, { error: "Admin soʻrovini bajarib boʻlmadi." });
  }
};
