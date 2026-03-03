// App settings — localStorage single-key store
// No React dependency. Safe to call from module-level functions.

export interface AppSettings {
    soundEnabled: boolean;     // All sounds ON/OFF
    slotEnabled: boolean;      // Gacha slot animation ON/OFF
    feverEnabled: boolean;     // FEVER mode ON/OFF
    volume: number;            // Master volume 0-100
    feverBgmVolume: number;    // FEVER BGM volume 0-100
    bgmEnabled: boolean;       // Background music ON/OFF
    bgmVolume: number;         // BGM volume 0-100
}

const STORAGE_KEY = 'eigodamashii-settings';

const DEFAULTS: AppSettings = {
    soundEnabled: true,
    slotEnabled: true,
    feverEnabled: true,
    volume: 100,
    feverBgmVolume: 35,
    bgmEnabled: false,
    bgmVolume: 30,
};

export function getSettings(): AppSettings {
    if (typeof window === 'undefined') return { ...DEFAULTS };
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return { ...DEFAULTS };
        const parsed = JSON.parse(raw);
        return { ...DEFAULTS, ...parsed };
    } catch {
        return { ...DEFAULTS };
    }
}

export function setSetting<K extends keyof AppSettings>(key: K, value: AppSettings[K]): void {
    if (typeof window === 'undefined') return;
    const current = getSettings();
    current[key] = value;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
}

export function setSettings(partial: Partial<AppSettings>): void {
    if (typeof window === 'undefined') return;
    const current = getSettings();
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, ...partial }));
}
