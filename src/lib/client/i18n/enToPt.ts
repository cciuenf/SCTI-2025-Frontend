import en from "./en.json";

function norm(s: string) {
  return s.trim().toLowerCase();
}

export function translateMessage(message?: string) {
  if (!message) return undefined;

  const key = norm(message);
  if(key in en) return en[key as keyof typeof en];

  return message;
}