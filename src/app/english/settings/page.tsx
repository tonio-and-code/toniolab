'use client';

import { useState, useEffect } from 'react';
import { getSettings, setSetting, type AppSettings } from '@/lib/settings';

export default function SettingsPage() {
    const [settings, setLocalSettings] = useState<AppSettings | null>(null);

    useEffect(() => {
        setLocalSettings(getSettings());
    }, []);

    if (!settings) return null;

    const update = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
        setSetting(key, value);
        setLocalSettings({ ...settings, [key]: value });
    };

    const playTestSound = () => {
        try {
            const ctx = new AudioContext();
            if (ctx.state === 'suspended') ctx.resume();
            const now = ctx.currentTime;
            const vol = settings.volume / 100;
            const freqs = [523, 659, 784];
            freqs.forEach((freq, i) => {
                const osc = ctx.createOscillator();
                const g = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.value = freq;
                const gv = 0.14 * vol;
                const t = now + i * 0.08;
                g.gain.setValueAtTime(0, t);
                g.gain.linearRampToValueAtTime(gv, t + 0.03);
                g.gain.setValueAtTime(gv, t + 0.15);
                g.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
                osc.connect(g); g.connect(ctx.destination);
                osc.start(t); osc.stop(t + 0.45);
            });
        } catch { /* audio not available */ }
    };

    const playTestBGM = () => {
        try {
            const vol = (settings.feverBgmVolume / 100) * (settings.volume / 100);
            const audio = new Audio('/audio/fever-bgm.mp3');
            audio.volume = vol;
            audio.play().catch(() => {});
            setTimeout(() => {
                const steps = 8;
                let step = 0;
                const fade = setInterval(() => {
                    step++;
                    audio.volume = Math.max(0, vol * (1 - step / steps));
                    if (step >= steps) {
                        clearInterval(fade);
                        audio.pause();
                    }
                }, 80);
            }, 2000);
        } catch { /* audio not available */ }
    };

    const playTestMainBGM = () => {
        try {
            const vol = (settings.bgmVolume / 100) * (settings.volume / 100);
            const audio = new Audio('/audio/bgm-main.mp3');
            audio.volume = vol;
            audio.play().catch(() => {});
            setTimeout(() => {
                const steps = 8;
                let step = 0;
                const fade = setInterval(() => {
                    step++;
                    audio.volume = Math.max(0, vol * (1 - step / steps));
                    if (step >= steps) {
                        clearInterval(fade);
                        audio.pause();
                    }
                }, 80);
            }, 3000);
        } catch { /* audio not available */ }
    };

    return (
        <div style={{
            maxWidth: '640px',
            margin: '0 auto',
            padding: '48px 24px',
        }}>
            <h1 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#1c1917',
                marginBottom: '8px',
                letterSpacing: '0.02em',
            }}>
                設定
            </h1>
            <p style={{
                fontSize: '13px',
                color: '#a8a29e',
                marginBottom: '40px',
            }}>
                サウンド・エフェクトの設定
            </p>

            {/* Sound Section */}
            <Section title="サウンド">
                <ToggleRow
                    label="サウンド"
                    description="全サウンドの ON / OFF"
                    checked={settings.soundEnabled}
                    onChange={(v) => update('soundEnabled', v)}
                />

                {settings.soundEnabled && (
                    <>
                        <SliderRow
                            label="マスター音量"
                            value={settings.volume}
                            onChange={(v) => update('volume', v)}
                        />
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px 0 4px',
                        }}>
                            <button
                                onClick={playTestSound}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    border: '1px solid #d6d3d1',
                                    backgroundColor: '#fff',
                                    fontSize: '12px',
                                    color: '#57534e',
                                    cursor: 'pointer',
                                    fontWeight: '500',
                                }}
                            >
                                SE テスト
                            </button>
                        </div>

                        {settings.feverEnabled && (
                            <>
                                <SliderRow
                                    label="FEVER BGM 音量"
                                    value={settings.feverBgmVolume}
                                    onChange={(v) => update('feverBgmVolume', v)}
                                />
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '12px 0 4px',
                                }}>
                                    <button
                                        onClick={playTestBGM}
                                        style={{
                                            padding: '8px 16px',
                                            borderRadius: '8px',
                                            border: '1px solid #d6d3d1',
                                            backgroundColor: '#fff',
                                            fontSize: '12px',
                                            color: '#57534e',
                                            cursor: 'pointer',
                                            fontWeight: '500',
                                        }}
                                    >
                                        BGM テスト (2秒)
                                    </button>
                                </div>
                            </>
                        )}
                    </>
                )}
            </Section>

            {/* BGM Section */}
            <Section title="BGM">
                <ToggleRow
                    label="BGM"
                    description="通常時のバックグラウンド音楽"
                    checked={settings.bgmEnabled}
                    onChange={(v) => update('bgmEnabled', v)}
                />
                {settings.bgmEnabled && settings.soundEnabled && (
                    <>
                        <SliderRow
                            label="BGM 音量"
                            value={settings.bgmVolume}
                            onChange={(v) => update('bgmVolume', v)}
                        />
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px 0 4px',
                        }}>
                            <button
                                onClick={playTestMainBGM}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    border: '1px solid #d6d3d1',
                                    backgroundColor: '#fff',
                                    fontSize: '12px',
                                    color: '#57534e',
                                    cursor: 'pointer',
                                    fontWeight: '500',
                                }}
                            >
                                BGM テスト (3秒)
                            </button>
                        </div>
                    </>
                )}
            </Section>

            {/* Effects Section */}
            <Section title="エフェクト">
                <ToggleRow
                    label="スロット演出"
                    description="OFF でも XP・Sparks・カードポイントは獲得されます"
                    checked={settings.slotEnabled}
                    onChange={(v) => update('slotEnabled', v)}
                />
                <ToggleRow
                    label="FEVER モード"
                    description="確変ボーナスモード。OFF にすると FEVER が発動しません"
                    checked={settings.feverEnabled}
                    onChange={(v) => update('feverEnabled', v)}
                />
            </Section>
        </div>
    );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div style={{ marginBottom: '36px' }}>
            <h2 style={{
                fontSize: '13px',
                fontWeight: '600',
                color: '#a8a29e',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '16px',
                paddingBottom: '8px',
                borderBottom: '1px solid #e7e5e4',
            }}>
                {title}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {children}
            </div>
        </div>
    );
}

function ToggleRow({ label, description, checked, onChange }: {
    label: string;
    description?: string;
    checked: boolean;
    onChange: (v: boolean) => void;
}) {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 0',
        }}>
            <div>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#1c1917' }}>{label}</div>
                {description && (
                    <div style={{ fontSize: '12px', color: '#a8a29e', marginTop: '2px' }}>{description}</div>
                )}
            </div>
            <button
                onClick={() => onChange(!checked)}
                style={{
                    width: '48px',
                    height: '28px',
                    borderRadius: '14px',
                    border: 'none',
                    backgroundColor: checked ? '#D4AF37' : '#d6d3d1',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'background-color 0.2s ease',
                    flexShrink: 0,
                }}
            >
                <div style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '11px',
                    backgroundColor: '#fff',
                    position: 'absolute',
                    top: '3px',
                    left: checked ? '23px' : '3px',
                    transition: 'left 0.2s ease',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                }} />
            </button>
        </div>
    );
}

function SliderRow({ label, value, onChange }: {
    label: string;
    value: number;
    onChange: (v: number) => void;
}) {
    return (
        <div style={{ padding: '8px 0' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px',
            }}>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#1c1917' }}>{label}</span>
                <span style={{ fontSize: '13px', color: '#78716c', fontVariantNumeric: 'tabular-nums' }}>{value}%</span>
            </div>
            <input
                type="range"
                min={0}
                max={100}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                style={{
                    width: '100%',
                    accentColor: '#D4AF37',
                    cursor: 'pointer',
                }}
            />
        </div>
    );
}
