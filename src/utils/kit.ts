import { lang } from "@/lang";

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getTypedKeys<T>(obj: any): Array<T> {
  return Object.keys(obj) as Array<T>;
}

const useLang = (key: string) => {
  return lang[key]
}

const formatTime = (seconds?: number) => {
  if (!seconds || isNaN(seconds)) return '00:00';
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

export { getRandomInt, getTypedKeys, useLang, formatTime }