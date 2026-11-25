import { connectLambda, getStore } from "@netlify/blobs";
import { defaultContent } from "../../../src/site-content.js";

export let store;

export function initializeStore(event) {
  connectLambda(event);
  store = getStore("sabrina-site-data");
  return store;
}

export async function getContent() {
  const savedContent = await store.get("content", { type: "json" });
  return savedContent || defaultContent;
}

export async function listKeys(prefix) {
  const keys = [];
  let cursor;

  do {
    const page = await store.list({ prefix, cursor, limit: 1000 });
    keys.push(...page.blobs);
    cursor = page.cursor;
  } while (cursor);

  return keys;
}

export async function getTrafficStats(days = 30) {
  const now = Date.now();
  const activeCutoff = now - 5 * 60 * 1000;
  const [visitors, activeEntries] = await Promise.all([
    listKeys("visitors/"),
    listKeys("active/"),
  ]);
  const online = activeEntries.filter(
    (entry) => Date.parse(entry.lastModified) >= activeCutoff,
  ).length;
  const daily = [];

  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const date = new Date(now - offset * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10);
    const entries = await listKeys(`daily/${date}/`);
    daily.push({ date, count: entries.length });
  }

  return {
    online,
    totalVisitors: visitors.length,
    daily,
  };
}
