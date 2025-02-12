import { lang } from "@/lang";
import { LANG, Player, Song } from "@/type";
import { toast } from "react-toastify";

function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getTypedKeys<T>(obj: any): Array<T> {
    return Object.keys(obj) as Array<T>;
}

/**
 * LOGIN.USERNAME -> ['LOGIN', 'USERNAME']
 * @param key query key
 */
function locale(key: string): string {
    const keys = key.split('\.');
    let l: string | LANG = lang;
    for (const k of keys) {
        if (typeof l === 'string') return l;
        l = l[k];
    }
    if (typeof l === 'string') return l;
    else return '';
}

const formatTime = (seconds?: number) => {
    if (!seconds || isNaN(seconds)) return '00:00';
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

const isAuth = (): boolean => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token') !== null
    }
    return false
}

const isRoot = (): boolean => {
    if (!isAuth()) return false
    return true
}

const auth = (func: () => void) => {
    if (isAuth()) {
        func()
    } else {
        toast.warn('You have to log in first.', {
            autoClose: 3000
        })
    }
}

function debounce<T extends (...args: any[]) => void>(
    func: T,
    delay: number
): (...args: Parameters<T>) => void {
    let timer: ReturnType<typeof setTimeout> | null = null;
    return (...args: Parameters<T>) => {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => func(...args), delay);
    };
}

export { getRandomInt, getTypedKeys, locale, formatTime, isAuth, auth, debounce }