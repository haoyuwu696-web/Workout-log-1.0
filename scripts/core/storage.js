/**
 * 本地存储工具（ESM）。键前缀为 fitlog:
 * 浏览器多页脚本请优先使用 window.FitLogCommon.storage（app-common.js），API 语义一致。
 */
const NAMESPACE = 'fitlog';

function buildKey(key) {
  if (key.startsWith(`${NAMESPACE}:`)) {
    return key;
  }
  return `${NAMESPACE}:${key}`;
}

export function readStorage(key, fallback = null) {
  const finalKey = buildKey(key);
  const raw = localStorage.getItem(finalKey);
  if (raw === null || raw === undefined) {
    return fallback;
  }
  try {
    return JSON.parse(raw);
  } catch (error) {
    console.warn(`Failed to parse storage key: ${finalKey}`, error);
    return fallback;
  }
}

export function writeStorage(key, value) {
  const finalKey = buildKey(key);
  localStorage.setItem(finalKey, JSON.stringify(value));
}

export function removeStorage(key) {
  localStorage.removeItem(buildKey(key));
}

export function upsertArrayItem(key, item, matcher = (candidate) => candidate.id === item.id) {
  const list = readStorage(key, []);
  const index = list.findIndex(matcher);
  if (index === -1) {
    list.push(item);
  } else {
    list[index] = item;
  }
  writeStorage(key, list);
  return list;
}

export function appendArrayItem(key, item) {
  const list = readStorage(key, []);
  list.push(item);
  writeStorage(key, list);
  return list;
}

export function clearNamespace() {
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    if (key && key.startsWith(`${NAMESPACE}:`)) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach((key) => localStorage.removeItem(key));
}



















