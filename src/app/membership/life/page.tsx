'use client';

import { useState, useEffect, useCallback, useRef, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

// ─── PWA ───
function useMembersPWA() {
  useEffect(() => {
    const existing = document.querySelector('link[rel="manifest"]');
    if (existing) existing.remove();
    const link = document.createElement('link');
    link.rel = 'manifest';
    link.href = '/membership-life-app.json';
    document.head.appendChild(link);
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/membership-life-sw.js', { scope: '/membership/life' }).catch(() => {});
    }
    return () => { link.remove(); };
  }, []);
}

// ─── Types ───
interface Recording {
  id: string;
  japanese: string;
  english_short: string | null;
  english_attitude: string | null;
  english_full: string | null;
  english_monologue: string | null;
  context: string | null;
  literal: string | null;
  category: string | null;
  status: 'pending' | 'converted';
  created_at: string;
  converted_at: string | null;
  member_slug: string | null;
  member_name: string | null;
  is_public: number | null;
}

// ─── Helpers ───
const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
function getDaysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate(); }
function getFirstDayOfWeek(y: number, m: number) { return new Date(y, m, 1).getDay(); }
function toDateStr(d: Date) { return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; }

const SLUG_KEY = 'tonio-life-member-slug';
const NAME_KEY = 'tonio-life-member-name';

function randomSlug(len = 10): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  for (let i = 0; i < len; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return id;
}

function dedupAdjacentRepeats(text: string): string {
  if (!text || text.length < 6) return text;
  let result = text;
  let prev = '';
  let guard = 0;
  while (result !== prev && guard++ < 30) {
    prev = result;
    outer: for (let pos = 0; pos < result.length; pos++) {
      const maxLen = Math.floor((result.length - pos) / 2);
      for (let len = maxLen; len >= 3; len--) {
        if (result.slice(pos, pos + len) === result.slice(pos + len, pos + 2 * len)) {
          result = result.slice(0, pos + len) + result.slice(pos + 2 * len);
          break outer;
        }
      }
    }
  }
  return result;
}

// ─── Colors ───
const C = {
  bg: '#FAFAF9',
  card: '#FFFFFF',
  border: '#E7E5E4',
  borderLight: '#F5F5F4',
  gold: '#D4AF37',
  goldDim: '#B8971F',
  goldBg: '#FFFBEB',
  goldBorder: '#FDE68A',
  green: '#10B981',
  greenBg: '#ECFDF5',
  red: '#DC2626',
  blue: '#2563EB',
  text: '#1C1917',
  textSub: '#44403C',
  textDim: '#78716C',
  textFaint: '#A8A29E',
  textGhost: '#D6D3D1',
};

// ─── Install Banner ───
type Platform = {
  isIOS: boolean;
  isAndroid: boolean;
  isInApp: boolean;
  inAppName: string | null;
  isStandalone: boolean;
  ready: boolean;
};

function usePlatform(): Platform {
  const [state, setState] = useState<Platform>({
    isIOS: false, isAndroid: false, isInApp: false, inAppName: null, isStandalone: false, ready: false,
  });
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const ua = navigator.userAgent || '';
    const isIOS = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
    const isAndroid = /Android/.test(ua);
    let inAppName: string | null = null;
    if (/Line\//i.test(ua)) inAppName = 'LINE';
    else if (/FBAN|FBAV/.test(ua)) inAppName = 'Facebook';
    else if (/Instagram/.test(ua)) inAppName = 'Instagram';
    else if (/Twitter/.test(ua)) inAppName = 'X (Twitter)';
    const isInApp = inAppName !== null;
    const isStandalone =
      window.matchMedia?.('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setState({ isIOS, isAndroid, isInApp, inAppName, isStandalone, ready: true });
  }, []);
  return state;
}

function useInstallPrompt() {
  const [deferred, setDeferred] = useState<any>(null);
  const [installed, setInstalled] = useState(false);
  useEffect(() => {
    const onPrompt = (e: Event) => { e.preventDefault(); setDeferred(e); };
    const onInstalled = () => { setDeferred(null); setInstalled(true); };
    window.addEventListener('beforeinstallprompt', onPrompt as any);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt as any);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);
  const trigger = useCallback(async () => {
    if (!deferred) return false;
    try {
      deferred.prompt();
      const choice = await deferred.userChoice;
      setDeferred(null);
      return choice?.outcome === 'accepted';
    } catch { return false; }
  }, [deferred]);
  return { canPrompt: !!deferred, installed, trigger };
}

function InstallBanner() {
  const platform = usePlatform();
  const { canPrompt, trigger } = useInstallPrompt();
  const [dismissed, setDismissed] = useState(false);

  if (!platform.ready) return null;
  if (platform.isStandalone) return null;
  if (dismissed) return null;

  const box: React.CSSProperties = {
    margin: '12px 12px 0',
    padding: '14px 16px',
    background: C.goldBg,
    border: `1px solid ${C.goldBorder}`,
    borderRadius: 12,
    position: 'relative',
  };
  const close = (
    <button
      onClick={() => setDismissed(true)}
      aria-label="閉じる"
      style={{
        position: 'absolute', top: 6, right: 10,
        background: 'none', border: 'none', cursor: 'pointer',
        color: C.goldDim, fontSize: 16, lineHeight: 1, padding: 2,
      }}
    >×</button>
  );

  if (platform.isInApp) {
    return (
      <div style={box}>{close}
        <div style={{ fontSize: 10, letterSpacing: 2, color: C.goldDim, fontWeight: 700, marginBottom: 6 }}>
          ブラウザで開いてください
        </div>
        <div style={{ fontSize: 13, lineHeight: 1.7, color: C.textSub }}>
          {platform.inAppName}の中では使えません。右上のメニューから「{platform.isIOS ? 'Safari' : '他のブラウザ'}で開く」を選んでください。
        </div>
      </div>
    );
  }
  if (platform.isIOS) {
    return (
      <div style={box}>{close}
        <div style={{ fontSize: 10, letterSpacing: 2, color: C.goldDim, fontWeight: 700, marginBottom: 6 }}>
          ホーム画面に追加してアプリっぽく使う
        </div>
        <div style={{ fontSize: 13, lineHeight: 1.7, color: C.textSub }}>
          画面下の共有ボタン → 「ホーム画面に追加」→ 「追加」
        </div>
      </div>
    );
  }
  if (platform.isAndroid && canPrompt) {
    return (
      <div style={box}>{close}
        <div style={{ fontSize: 10, letterSpacing: 2, color: C.goldDim, fontWeight: 700, marginBottom: 6 }}>
          ホーム画面に追加してアプリっぽく使う
        </div>
        <button
          onClick={async () => { const ok = await trigger(); if (ok) setDismissed(true); }}
          style={{ marginTop: 6, padding: '8px 16px', background: C.text, color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}
        >
          ホーム画面に追加
        </button>
      </div>
    );
  }
  if (platform.isAndroid) {
    return (
      <div style={box}>{close}
        <div style={{ fontSize: 10, letterSpacing: 2, color: C.goldDim, fontWeight: 700, marginBottom: 6 }}>
          ホーム画面に追加してアプリっぽく使う
        </div>
        <div style={{ fontSize: 13, lineHeight: 1.7, color: C.textSub }}>
          ブラウザ右上のメニュー（︙） → 「アプリをインストール」または「ホーム画面に追加」
        </div>
      </div>
    );
  }
  return null;
}

// ─── Main ───
function LifeMemberInner() {
  const searchParams = useSearchParams();
  const now = new Date();

  const [slug, setSlug] = useState<string | null>(null);
  const [name, setName] = useState<string>('');
  const [nameInput, setNameInput] = useState<string>('');
  const [showNameEdit, setShowNameEdit] = useState(false);

  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [selectedDate, setSelectedDate] = useState<Date>(now);
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [loading, setLoading] = useState(true);

  const [isRecording, setIsRecording] = useState(false);
  const [interim, setInterim] = useState('');
  const recognitionRef = useRef<any>(null);
  const sessionFinalsRef = useRef<string[]>([]);
  const priorSessionsTextRef = useRef<string>('');
  const userStoppedRef = useRef<boolean>(false);

  const [activeExpr, setActiveExpr] = useState<Record<string, number>>({});

  // ─── Diary state ───
  const [diaryContent, setDiaryContent] = useState<string>('');
  const [diaryNews, setDiaryNews] = useState<string>('');
  const [diaryLoaded, setDiaryLoaded] = useState(false);
  const [diaryDates, setDiaryDates] = useState<Set<string>>(new Set());

  // ─── Reply state ───
  interface Reply {
    id: number;
    diary_date: string;
    content: string;
    member_slug: string | null;
    member_name: string | null;
    created_at: string;
  }
  const [replies, setReplies] = useState<Reply[]>([]);
  const [replyInput, setReplyInput] = useState<string>('');
  const [replySubmitting, setReplySubmitting] = useState(false);
  const [replyCounts, setReplyCounts] = useState<Record<string, number>>({});
  const [isReplyRecording, setIsReplyRecording] = useState(false);
  const [replyInterim, setReplyInterim] = useState('');
  const replyRecognitionRef = useRef<any>(null);
  const replyFinalsRef = useRef<string[]>([]);
  const replyPriorRef = useRef<string>('');
  const replyUserStoppedRef = useRef<boolean>(false);

  useMembersPWA();

  // Identity bootstrap
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const urlSlug = searchParams?.get('m');
    const saved = localStorage.getItem(SLUG_KEY);
    let resolved = urlSlug || saved;
    if (!resolved) resolved = randomSlug();
    setSlug(resolved);
    try { localStorage.setItem(SLUG_KEY, resolved); } catch { /* */ }
    try {
      const savedName = localStorage.getItem(NAME_KEY);
      if (savedName) setName(savedName);
    } catch { /* */ }
  }, [searchParams]);

  // Fetch
  const fetchRecordings = useCallback(async () => {
    try {
      const res = await fetch('/api/life-recordings');
      const data = await res.json();
      if (data.success) setRecordings(data.recordings || []);
    } catch { /* */ }
    setLoading(false);
  }, []);
  useEffect(() => { fetchRecordings(); }, [fetchRecordings]);

  const saveName = () => {
    const trimmed = nameInput.trim();
    setName(trimmed);
    try {
      if (trimmed) localStorage.setItem(NAME_KEY, trimmed);
      else localStorage.removeItem(NAME_KEY);
    } catch { /* */ }
    setShowNameEdit(false);
  };

  // Derived
  const selectedDateStr = toDateStr(selectedDate);

  // ─── Diary fetch ───
  const fetchDiaryDates = useCallback(async () => {
    try {
      const res = await fetch('/api/life-diary?list=true');
      const data = await res.json();
      if (data.success) setDiaryDates(new Set(data.dates || []));
    } catch { /* */ }
  }, []);
  useEffect(() => { fetchDiaryDates(); }, [fetchDiaryDates]);

  const fetchDiaryForDate = useCallback(async (date: string) => {
    setDiaryLoaded(false);
    try {
      const res = await fetch(`/api/life-diary?date=${encodeURIComponent(date)}`);
      const data = await res.json();
      if (data.success) {
        setDiaryContent(data.diary?.content || '');
        setDiaryNews(data.diary?.news || '');
      } else {
        setDiaryContent(''); setDiaryNews('');
      }
    } catch {
      setDiaryContent(''); setDiaryNews('');
    } finally {
      setDiaryLoaded(true);
    }
  }, []);
  useEffect(() => { fetchDiaryForDate(selectedDateStr); }, [fetchDiaryForDate, selectedDateStr]);

  // ─── Replies fetch ───
  const fetchReplyCounts = useCallback(async () => {
    try {
      const res = await fetch('/api/life-diary-replies?counts=true');
      const data = await res.json();
      if (data.success) setReplyCounts(data.counts || {});
    } catch { /* */ }
  }, []);
  useEffect(() => { fetchReplyCounts(); }, [fetchReplyCounts]);

  const fetchReplies = useCallback(async (date: string) => {
    try {
      const res = await fetch(`/api/life-diary-replies?date=${encodeURIComponent(date)}`);
      const data = await res.json();
      if (data.success) setReplies(data.replies || []);
      else setReplies([]);
    } catch {
      setReplies([]);
    }
  }, []);
  useEffect(() => { fetchReplies(selectedDateStr); setReplyInput(''); setReplyInterim(''); }, [fetchReplies, selectedDateStr]);

  const submitReply = useCallback(async (content: string) => {
    const trimmed = content.trim();
    if (!trimmed || replySubmitting) return;
    setReplySubmitting(true);
    try {
      const res = await fetch('/api/life-diary-replies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: selectedDateStr,
          content: trimmed,
          member_slug: slug,
          member_name: name || null,
        }),
      });
      const data = await res.json();
      if (data.success && data.reply) {
        setReplies(prev => [...prev, data.reply]);
        setReplyInput('');
        setReplyCounts(prev => ({ ...prev, [selectedDateStr]: (prev[selectedDateStr] || 0) + 1 }));
      }
    } catch { /* */ }
    finally {
      setReplySubmitting(false);
    }
  }, [selectedDateStr, slug, name, replySubmitting]);

  const deleteReply = useCallback(async (id: number) => {
    try {
      const res = await fetch('/api/life-diary-replies', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, member_slug: slug }),
      });
      const data = await res.json();
      if (data.success) {
        setReplies(prev => prev.filter(r => r.id !== id));
        setReplyCounts(prev => {
          const next = { ...prev };
          if (next[selectedDateStr]) next[selectedDateStr] = Math.max(0, next[selectedDateStr] - 1);
          return next;
        });
      }
    } catch { /* */ }
  }, [slug, selectedDateStr]);

  // ─── Reply voice ───
  const startReplyRecording = () => {
    if (typeof window === 'undefined') return;
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { alert('このブラウザは音声認識に対応していません'); return; }
    replyFinalsRef.current = [];
    replyPriorRef.current = '';
    replyUserStoppedRef.current = false;

    const startSession = () => {
      const recognition = new SR();
      recognition.lang = 'ja-JP';
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;
      recognition.continuous = true;
      recognition.onresult = (event: any) => {
        let interimText = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) replyFinalsRef.current[i] = result[0].transcript;
          else interimText += result[0].transcript;
        }
        setReplyInterim(interimText);
      };
      recognition.onerror = (e: any) => {
        const fatal = e?.error === 'not-allowed' || e?.error === 'service-not-allowed' || e?.error === 'audio-capture';
        if (fatal) {
          replyUserStoppedRef.current = true;
          setIsReplyRecording(false);
          setReplyInterim('');
        }
      };
      recognition.onend = () => {
        const sessionText = replyFinalsRef.current.join('');
        if (!replyUserStoppedRef.current) {
          try {
            replyFinalsRef.current = [];
            startSession();
            replyPriorRef.current += sessionText;
            return;
          } catch { /* */ }
        }
        const raw = (replyPriorRef.current + sessionText).trim();
        const fullText = dedupAdjacentRepeats(raw);
        replyPriorRef.current = '';
        replyFinalsRef.current = [];
        if (fullText) {
          setReplyInput(prev => prev ? `${prev} ${fullText}` : fullText);
        }
        setIsReplyRecording(false);
        setReplyInterim('');
      };
      replyRecognitionRef.current = recognition;
      recognition.start();
    };

    startSession();
    setIsReplyRecording(true);
  };
  const stopReplyRecording = () => {
    replyUserStoppedRef.current = true;
    if (replyRecognitionRef.current) {
      try { replyRecognitionRef.current.stop(); } catch { /* */ }
    }
  };

  const dayRecordings = useMemo(() =>
    recordings.filter(r => r.created_at.startsWith(selectedDateStr)),
    [recordings, selectedDateStr]
  );
  const myRecordings = useMemo(
    () => recordings.filter(r => r.member_slug === slug),
    [recordings, slug]
  );
  const pendingCount = myRecordings.filter(r => r.status === 'pending').length;
  const convertedCount = myRecordings.filter(r => r.status === 'converted').length;
  const isToday = (d: Date) => toDateStr(d) === toDateStr(now);

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfWeek(viewYear, viewMonth);
  const recordingDates = useMemo(() => {
    const map: Record<string, { total: number; converted: number }> = {};
    recordings.forEach(r => {
      const d = r.created_at.split('T')[0];
      if (!map[d]) map[d] = { total: 0, converted: 0 };
      map[d].total++;
      if (r.status === 'converted') map[d].converted++;
    });
    return map;
  }, [recordings]);

  // Navigation
  const goToDate = (d: Date) => setSelectedDate(d);
  const prevDay = () => { const d = new Date(selectedDate); d.setDate(d.getDate() - 1); goToDate(d); };
  const nextDay = () => { const d = new Date(selectedDate); d.setDate(d.getDate() + 1); goToDate(d); };
  const goToday = () => { goToDate(new Date()); setViewYear(now.getFullYear()); setViewMonth(now.getMonth()); };
  const prevMonth = () => { if (viewMonth === 0) { setViewYear(viewYear - 1); setViewMonth(11); } else setViewMonth(viewMonth - 1); };
  const nextMonth = () => { if (viewMonth === 11) { setViewYear(viewYear + 1); setViewMonth(0); } else setViewMonth(viewMonth + 1); };

  // Voice
  const startRecording = () => {
    if (typeof window === 'undefined') return;
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { alert('このブラウザは音声認識に対応していません'); return; }
    sessionFinalsRef.current = [];
    priorSessionsTextRef.current = '';
    userStoppedRef.current = false;

    const startSession = () => {
      const recognition = new SR();
      recognition.lang = 'ja-JP';
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;
      recognition.continuous = true;
      recognition.onresult = (event: any) => {
        let interimText = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            sessionFinalsRef.current[i] = result[0].transcript;
          } else {
            interimText += result[0].transcript;
          }
        }
        setInterim(interimText);
      };
      recognition.onerror = (e: any) => {
        const fatal = e?.error === 'not-allowed' || e?.error === 'service-not-allowed' || e?.error === 'audio-capture';
        if (fatal) {
          userStoppedRef.current = true;
          sessionFinalsRef.current = [];
          priorSessionsTextRef.current = '';
          setIsRecording(false);
          setInterim('');
        }
      };
      recognition.onend = () => {
        const sessionText = sessionFinalsRef.current.join('');
        if (!userStoppedRef.current) {
          try {
            sessionFinalsRef.current = [];
            startSession();
            priorSessionsTextRef.current += sessionText;
            return;
          } catch { /* */ }
        }
        const raw = (priorSessionsTextRef.current + sessionText).trim();
        const fullText = dedupAdjacentRepeats(raw);
        priorSessionsTextRef.current = '';
        sessionFinalsRef.current = [];
        if (fullText) submitRecording(fullText);
        setIsRecording(false);
        setInterim('');
      };
      recognitionRef.current = recognition;
      recognition.start();
    };

    startSession();
    setIsRecording(true);
  };
  const stopRecording = () => {
    userStoppedRef.current = true;
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch { /* */ }
    }
  };

  // Submit
  const submitRecording = async (text: string) => {
    if (!text.trim() || !slug) return;
    try {
      const res = await fetch('/api/life-recordings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          japanese: text.trim(),
          member_slug: slug,
          member_name: name || null,
        }),
      });
      const data = await res.json();
      if (data.success && data.recording) setRecordings(prev => [data.recording, ...prev]);
    } catch { /* */ }
  };

  // Delete (own only)
  const deleteRecording = async (id: string) => {
    try {
      await fetch('/api/life-recordings', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      setRecordings(prev => prev.filter(r => r.id !== id));
    } catch { /* */ }
  };

  // TTS
  const speak = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US'; u.rate = 0.9;
    window.speechSynthesis.speak(u);
  };

  const displayName = name || '匿名';

  if (!slug) {
    return <div style={{ minHeight: '100vh', background: C.bg }} />;
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: C.bg,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      maxWidth: 480, margin: '0 auto',
      paddingBottom: 100,
      color: C.text,
    }}>
      {/* ─── Header ─── */}
      <div style={{
        padding: '16px 16px 14px',
        borderBottom: `1px solid ${C.border}`,
        background: C.card,
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
      }}>
        <div>
          <Link href="/membership" style={{
            fontSize: 10, letterSpacing: 1.5, color: C.textFaint, textDecoration: 'none',
            fontWeight: 600, display: 'inline-block', marginBottom: 4,
          }}>&#8592; MEMBERSHIP</Link>
          <div style={{ fontSize: 9, letterSpacing: 3, color: C.textFaint, fontWeight: 600 }}>TONIO LAB</div>
          <button
            onClick={() => { setNameInput(name); setShowNameEdit(true); }}
            style={{
              fontSize: 17, fontWeight: 800, marginTop: 2,
              background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: C.text,
              fontFamily: 'inherit',
            }}
          >
            <span style={{ color: C.gold }}>{displayName}</span>
            <span style={{ fontSize: 10, marginLeft: 6, color: C.textFaint, fontWeight: 500 }}>編集</span>
          </button>
        </div>
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-end' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 9, letterSpacing: 1.5, color: C.textFaint, fontWeight: 700, marginBottom: 2 }}>録音</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: C.text, lineHeight: 1 }}>{myRecordings.length}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 9, letterSpacing: 1.5, color: C.goldDim, fontWeight: 700, marginBottom: 2 }}>英語待ち</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: C.goldDim, lineHeight: 1 }}>{pendingCount}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 9, letterSpacing: 1.5, color: C.green, fontWeight: 700, marginBottom: 2 }}>完了</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: C.green, lineHeight: 1 }}>{convertedCount}</div>
          </div>
        </div>
      </div>

      {/* ─── Name editor ─── */}
      {showNameEdit && (
        <div style={{ margin: '12px 12px 0', padding: 14, background: C.card, border: `1px solid ${C.border}`, borderRadius: 12 }}>
          <div style={{ fontSize: 12, color: C.textDim, marginBottom: 10, lineHeight: 1.6 }}>
            表示名を入力してください。空欄のままでも問題ありません。
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              placeholder="例: 中田 / 空欄で匿名"
              style={{ flex: 1, padding: '10px 14px', border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 14, fontFamily: 'inherit' }}
            />
            <button
              onClick={saveName}
              style={{ padding: '10px 18px', background: C.text, color: C.card, border: 'none', borderRadius: 8, fontSize: 13, cursor: 'pointer', fontWeight: 700 }}
            >
              決定
            </button>
          </div>
        </div>
      )}

      {/* ─── Install banner ─── */}
      <InstallBanner />

      {/* ─── Day navigator ─── */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '6px 12px', background: C.card,
        borderBottom: `1px solid ${C.borderLight}`,
        marginTop: 12,
      }}>
        <button onClick={prevDay} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: C.textFaint, padding: '4px 12px' }}>&#8249;</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={goToday} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 16, fontWeight: 800, color: C.text,
          }}>
            {selectedDate.getMonth() + 1}/{selectedDate.getDate()}
          </button>
          {isToday(selectedDate) && (
            <span style={{
              color: C.card, background: C.gold,
              fontSize: 8, fontWeight: 800, letterSpacing: 1,
              padding: '2px 6px', borderRadius: 4,
            }}>TODAY</span>
          )}
          {dayRecordings.length > 0 && (
            <span style={{
              background: C.borderLight, padding: '2px 7px', borderRadius: 8,
              fontSize: 10, color: C.textDim, fontWeight: 600,
            }}>
              {dayRecordings.length}
            </span>
          )}
        </div>
        <button onClick={nextDay} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: C.textFaint, padding: '4px 12px' }}>&#8250;</button>
      </div>

      {/* ─── Calendar ─── */}
      <div style={{ background: C.card, padding: '14px 12px 14px', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, padding: '0 4px' }}>
          <button onClick={prevMonth} style={{ background: C.borderLight, border: 'none', cursor: 'pointer', fontSize: 18, color: C.textDim, padding: '4px 14px', borderRadius: 8, fontWeight: 700 }}>&#8249;</button>
          <div style={{ fontSize: 17, fontWeight: 900, color: C.text, letterSpacing: 1 }}>
            {viewYear}.{String(viewMonth + 1).padStart(2, '0')}
          </div>
          <button onClick={nextMonth} style={{ background: C.borderLight, border: 'none', cursor: 'pointer', fontSize: 18, color: C.textDim, padding: '4px 14px', borderRadius: 8, fontWeight: 700 }}>&#8250;</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', marginBottom: 4 }}>
          {WEEKDAYS.map((d, i) => (
            <div key={i} style={{
              fontSize: 11, color: i === 0 ? '#EF4444' : i === 6 ? '#3B82F6' : C.textFaint,
              fontWeight: 700, letterSpacing: 1, padding: '4px 0',
            }}>{d}</div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3 }}>
          {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const cellDate = new Date(viewYear, viewMonth, day);
            const cellKey = toDateStr(cellDate);
            const isSelected = cellKey === toDateStr(selectedDate);
            const isTodayCell = cellKey === toDateStr(now);
            const dayData = recordingDates[cellKey];
            const hasPending = dayData && dayData.total > dayData.converted;
            const hasConverted = dayData && dayData.converted > 0;
            const hasDiary = diaryDates.has(cellKey);
            const rCount = replyCounts[cellKey] || 0;
            return (
              <button key={day} onClick={() => goToDate(cellDate)} style={{
                width: '100%', aspectRatio: '1', border: isTodayCell && !isSelected ? `2px solid ${C.gold}` : `1px solid ${C.borderLight}`,
                cursor: 'pointer',
                borderRadius: 10,
                background: isSelected ? C.text : C.card,
                color: isSelected ? C.card : C.text,
                fontSize: 16, fontWeight: isSelected || isTodayCell ? 900 : 600,
                position: 'relative',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                padding: 0,
                gap: 2,
              }}>
                {hasDiary && (
                  <span style={{
                    position: 'absolute', top: 3, right: 4,
                    fontSize: 9, fontWeight: 900,
                    color: isSelected ? C.card : C.goldDim,
                    letterSpacing: 0.5,
                  }}>日</span>
                )}
                {rCount > 0 && (
                  <span style={{
                    position: 'absolute', top: 3, left: 4,
                    fontSize: 8, fontWeight: 900,
                    color: isSelected ? C.card : C.textDim,
                    letterSpacing: 0,
                  }}>{rCount}</span>
                )}
                <span>{day}</span>
                {dayData && (
                  <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                    {hasConverted && (
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: isSelected ? C.card : C.green }} />
                    )}
                    {hasPending && (
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: isSelected ? C.card : C.gold }} />
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
        <div style={{
          display: 'flex', justifyContent: 'center', gap: 16,
          marginTop: 12, paddingTop: 10, borderTop: `1px solid ${C.borderLight}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.gold }} />
            <span style={{ fontSize: 10, fontWeight: 700, color: C.textDim, letterSpacing: 1 }}>英語待ち</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.green }} />
            <span style={{ fontSize: 10, fontWeight: 700, color: C.textDim, letterSpacing: 1 }}>完了</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, border: `2px solid ${C.gold}` }} />
            <span style={{ fontSize: 10, fontWeight: 700, color: C.textDim, letterSpacing: 1 }}>今日</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: 11, fontWeight: 900, color: C.goldDim }}>日</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: C.textDim, letterSpacing: 1 }}>日記</span>
          </div>
        </div>
      </div>

      {/* ─── Daily Diary (read-only) ─── */}
      {diaryLoaded && diaryContent && (
        <div style={{
          background: C.card, padding: '14px 14px 16px',
          borderBottom: `1px solid ${C.border}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span style={{
              fontSize: 9, letterSpacing: 3, fontWeight: 800, color: C.goldDim,
            }}>DAILY JOURNAL</span>
            <span style={{
              fontSize: 11, fontWeight: 800, color: C.text,
            }}>{selectedDate.getMonth() + 1}/{selectedDate.getDate()}の日記</span>
            <span style={{ flex: 1 }} />
            <span style={{
              fontSize: 9, fontWeight: 700, color: C.textFaint, letterSpacing: 1,
            }}>とにお</span>
          </div>

          <div style={{
            background: `linear-gradient(135deg, ${C.goldBg} 0%, #FEF9E7 100%)`,
            border: `1px solid ${C.goldBorder}`,
            borderRadius: 14, padding: '14px 16px',
          }}>
            <div style={{
              fontSize: 13, lineHeight: 1.9, color: C.textSub,
              whiteSpace: 'pre-wrap',
              fontFamily: "'Noto Serif JP', Georgia, serif",
            }}>
              {diaryContent}
            </div>
            {diaryNews && (
              <div style={{
                marginTop: 12, paddingTop: 10,
                borderTop: `1px dashed ${C.goldBorder}`,
                display: 'flex', alignItems: 'flex-start', gap: 8,
              }}>
                <span style={{
                  fontSize: 8, letterSpacing: 2, fontWeight: 800, color: C.goldDim,
                  padding: '3px 6px', background: C.card, borderRadius: 4,
                  marginTop: 1, flexShrink: 0,
                }}>NEWS</span>
                <span style={{
                  fontSize: 11, color: C.textDim, lineHeight: 1.6,
                }}>{diaryNews}</span>
              </div>
            )}
          </div>

          {/* ─── Replies (みなさんはどう？) ─── */}
          <div style={{ marginTop: 18 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10,
            }}>
              <span style={{
                fontSize: 9, letterSpacing: 3, fontWeight: 800, color: C.goldDim,
              }}>REPLIES</span>
              <span style={{
                fontSize: 11, fontWeight: 800, color: C.text,
              }}>みなさんはどう？</span>
              {replies.length > 0 && (
                <span style={{
                  fontSize: 10, fontWeight: 700,
                  background: C.borderLight, color: C.textDim,
                  padding: '2px 8px', borderRadius: 999,
                }}>{replies.length}</span>
              )}
            </div>

            {/* Existing replies */}
            {replies.length > 0 && (
              <div style={{
                display: 'flex', flexDirection: 'column', gap: 8,
                marginBottom: 12,
              }}>
                {replies.map(r => {
                  const isAdmin = !r.member_slug;
                  const isMine = !isAdmin && r.member_slug === slug;
                  const displayedName = isAdmin ? 'とにお' : (isMine ? (name || 'あなた') : (r.member_name || '匿名'));
                  const highlight = isAdmin;
                  return (
                    <div key={r.id} style={{
                      background: highlight ? C.goldBg : C.bg,
                      border: `1px solid ${highlight ? C.goldBorder : C.border}`,
                      borderRadius: 10,
                      padding: '10px 12px',
                      display: 'flex', flexDirection: 'column', gap: 4,
                    }}>
                      <div style={{
                        display: 'flex', alignItems: 'baseline', gap: 8,
                      }}>
                        <span style={{
                          fontSize: 11, fontWeight: 800,
                          color: highlight ? C.goldDim : C.text,
                        }}>{displayedName}</span>
                        <span style={{
                          fontSize: 9, fontWeight: 600, color: C.textFaint,
                        }}>
                          {r.created_at.slice(5, 16).replace('T', ' ')}
                        </span>
                        <span style={{ flex: 1 }} />
                        {isMine && (
                          <button
                            onClick={() => deleteReply(r.id)}
                            style={{
                              background: 'none', border: 'none', cursor: 'pointer',
                              fontSize: 11, color: C.textGhost, padding: 0,
                            }}
                          >x</button>
                        )}
                      </div>
                      <div style={{
                        fontSize: 13, lineHeight: 1.7, color: C.textSub,
                        whiteSpace: 'pre-wrap',
                      }}>{r.content}</div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Input */}
            <div style={{
              background: C.bg, border: `1px solid ${C.border}`,
              borderRadius: 12, padding: 10,
            }}>
              <textarea
                value={isReplyRecording && replyInterim ? `${replyInput}${replyInput ? ' ' : ''}${replyInterim}` : replyInput}
                onChange={e => { if (!isReplyRecording) setReplyInput(e.target.value); }}
                placeholder="この日の感想、気づいたこと、なんでも。"
                rows={3}
                readOnly={isReplyRecording}
                style={{
                  width: '100%', padding: 10, borderRadius: 8,
                  border: `1px solid ${C.borderLight}`, background: C.card,
                  fontSize: 13, fontFamily: 'inherit', color: C.text,
                  resize: 'vertical', lineHeight: 1.7, boxSizing: 'border-box',
                }}
              />
              <div style={{
                display: 'flex', gap: 8, marginTop: 8, alignItems: 'center',
              }}>
                <button
                  onClick={isReplyRecording ? stopReplyRecording : startReplyRecording}
                  style={{
                    width: 40, height: 40, borderRadius: '50%',
                    border: 'none', cursor: 'pointer',
                    background: isReplyRecording
                      ? `linear-gradient(135deg, ${C.red}, #EF4444)`
                      : `linear-gradient(135deg, ${C.gold}, #F59E0B)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                    animation: isReplyRecording ? 'micPulse 1s infinite' : 'none',
                  }}
                  title={isReplyRecording ? '録音停止' : '音声で入力'}
                >
                  {isReplyRecording ? (
                    <div style={{ width: 10, height: 10, borderRadius: 2, background: 'white' }} />
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                      <line x1="12" y1="19" x2="12" y2="23" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  )}
                </button>
                <span style={{ flex: 1 }} />
                <button
                  onClick={() => submitReply(replyInput)}
                  disabled={!replyInput.trim() || replySubmitting || isReplyRecording}
                  style={{
                    padding: '10px 18px', borderRadius: 10, border: 'none',
                    background: !replyInput.trim() || replySubmitting || isReplyRecording ? C.borderLight : C.text,
                    color: !replyInput.trim() || replySubmitting || isReplyRecording ? C.textFaint : C.card,
                    fontSize: 12, fontWeight: 800, letterSpacing: 1,
                    cursor: !replyInput.trim() || replySubmitting || isReplyRecording ? 'default' : 'pointer',
                  }}
                >
                  {replySubmitting ? '...' : '送信'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Recordings for selected day ─── */}
      <div style={{ padding: '8px 12px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40, color: C.textFaint, fontSize: 13 }}>...</div>
        ) : dayRecordings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: 13, color: C.textDim, marginBottom: 4 }}>録音はありません</div>
            <div style={{ fontSize: 11, color: C.textGhost }}>下のマイクから録音できます</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {dayRecordings.map(rec => {
              const isConverted = rec.status === 'converted';
              const active = activeExpr[rec.id] ?? 0;
              const exprs = isConverted ? [rec.english_short, rec.english_attitude, rec.english_full].filter(Boolean) as string[] : [];
              const exprColors = [C.text, C.gold, C.blue];

              const isAuthor = !rec.member_slug;
              const isMine = !isAuthor && rec.member_slug === slug;
              const displayedName = isAuthor ? 'とにお' : (isMine ? (name || 'あなた') : (rec.member_name || '匿名'));
              const roleLabel = isAuthor ? 'とにお' : (isMine ? 'あなた' : 'メンバー');
              const highlight = isAuthor || isMine;

              return (
                <div key={rec.id} style={{
                  background: C.card, borderRadius: 18, overflow: 'hidden',
                  border: `1px solid ${highlight ? C.goldBorder : C.border}`,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                }}>
                  {/* Hero strip */}
                  <div style={{
                    background: highlight
                      ? 'linear-gradient(90deg, #FFFBEB 0%, #FEF3C7 100%)'
                      : 'linear-gradient(90deg, #FAFAF9 0%, #F5F5F4 100%)',
                    padding: '12px 16px 10px',
                    borderBottom: `1px solid ${highlight ? C.goldBorder : C.border}`,
                    display: 'flex', alignItems: 'baseline', gap: 10,
                  }}>
                    <span style={{
                      fontSize: 9, letterSpacing: 3, fontWeight: 800,
                      color: highlight ? C.goldDim : C.textDim,
                    }}>
                      今回の1行は
                    </span>
                    <span style={{
                      fontSize: 22, fontWeight: 900, lineHeight: 1,
                      color: highlight ? C.goldDim : C.text,
                      letterSpacing: 0.5,
                    }}>
                      {displayedName}
                    </span>
                    <span style={{
                      fontSize: 10, fontWeight: 700,
                      color: highlight ? C.goldDim : C.textFaint,
                    }}>
                      {roleLabel}
                    </span>
                    <span style={{ flex: 1 }} />
                    {isMine && (
                      <button onClick={() => deleteRecording(rec.id)} style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        fontSize: 12, color: C.textGhost, padding: 0,
                      }}>x</button>
                    )}
                  </div>

                  {/* Japanese */}
                  <div style={{ padding: '20px 18px 6px', textAlign: 'center' }}>
                    <div style={{
                      fontSize: 11, color: C.textFaint,
                      letterSpacing: 2, fontWeight: 700, marginBottom: 8,
                    }}>
                      こう言った
                    </div>
                    <div style={{
                      fontSize: 22, fontWeight: 800, color: C.text,
                      lineHeight: 1.5, letterSpacing: 0.5,
                      fontFamily: "'Noto Serif JP', 'Source Serif Pro', Georgia, serif",
                    }}>
                      〝{rec.japanese}〞
                    </div>
                  </div>

                  {isConverted && exprs.length > 0 ? (
                    <>
                      {/* Arrow */}
                      <div style={{
                        textAlign: 'center', padding: '12px 0 10px',
                        position: 'relative',
                      }}>
                        <div style={{
                          position: 'absolute', top: '50%', left: '14%', right: '14%',
                          height: 1, background: `linear-gradient(90deg, transparent, ${C.goldBorder} 50%, transparent)`,
                        }} />
                        <span style={{
                          position: 'relative',
                          background: C.card,
                          padding: '4px 14px',
                          fontSize: 10, letterSpacing: 3, fontWeight: 800,
                          color: C.goldDim,
                        }}>
                          ▼ 3パターンで英語化 ▼
                        </span>
                      </div>

                      {/* Segmented control — pick the angle */}
                      {(() => {
                        const styleLabels = ['ストレート', 'ネイティブ', 'クセ強'];
                        const styleSubs = ['直球の訳', '実生活の口癖', 'とにお流'];
                        return (
                          <div style={{
                            display: 'flex', margin: '0 14px 10px',
                            borderRadius: 12, overflow: 'hidden',
                            border: `1px solid ${C.border}`,
                          }}>
                            {exprs.map((_, i) => {
                              const isActive = i === active;
                              return (
                                <button
                                  key={i}
                                  onClick={() => setActiveExpr(prev => ({ ...prev, [rec.id]: i }))}
                                  style={{
                                    flex: 1,
                                    padding: '10px 4px',
                                    border: 'none',
                                    borderLeft: i > 0 ? `1px solid ${C.border}` : 'none',
                                    background: isActive ? exprColors[i] : C.card,
                                    color: isActive ? 'white' : C.textDim,
                                    cursor: 'pointer',
                                    transition: 'background 0.15s, color 0.15s',
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                                  }}
                                >
                                  <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: 0.5 }}>
                                    {styleLabels[i] || `L${i + 1}`}
                                  </span>
                                  <span style={{
                                    fontSize: 9, fontWeight: 600,
                                    color: isActive ? 'rgba(255,255,255,0.85)' : C.textFaint,
                                    letterSpacing: 0.5,
                                  }}>
                                    {styleSubs[i] || ''}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        );
                      })()}

                      {/* English reveal */}
                      <div
                        onClick={() => speak(exprs[active])}
                        style={{
                          margin: '0 14px 12px',
                          padding: '16px 16px',
                          background: `linear-gradient(135deg, ${C.goldBg} 0%, #FEF9E7 100%)`,
                          border: `1px solid ${C.goldBorder}`,
                          borderRadius: 14,
                          cursor: 'pointer',
                          textAlign: 'center',
                        }}
                      >
                        <div style={{
                          fontSize: 20, fontWeight: 800,
                          color: exprColors[active],
                          lineHeight: 1.5, letterSpacing: 0.3,
                        }}>
                          {exprs[active]}
                        </div>
                        <div style={{
                          fontSize: 9, color: C.textFaint, marginTop: 6,
                          letterSpacing: 2, fontWeight: 600,
                        }}>
                          TAP TO HEAR
                        </div>
                      </div>

                      {/* Why */}
                      {rec.context && (
                        <div style={{
                          margin: '0 14px 14px',
                          background: C.bg, borderRadius: 12,
                          padding: '12px 14px',
                          borderLeft: `3px solid ${C.gold}`,
                        }}>
                          <div style={{
                            fontSize: 9, letterSpacing: 2.5, color: C.goldDim,
                            fontWeight: 800, marginBottom: 5,
                          }}>
                            なぜそうなるのか
                          </div>
                          <div style={{ fontSize: 12, color: C.textSub, lineHeight: 1.8 }}>{rec.context}</div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div style={{ padding: '6px 14px 16px', textAlign: 'center' }}>
                      <div style={{
                        fontSize: 11, color: C.goldDim, fontWeight: 700,
                        background: C.goldBg, padding: '6px 14px', borderRadius: 999,
                        border: `1px solid ${C.goldBorder}`,
                        display: 'inline-block',
                        letterSpacing: 1.5,
                      }}>
                        あとでとにおが英語にします
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ─── Fixed mic button ─── */}
      <div style={{
        position: 'fixed',
        bottom: 'max(28px, env(safe-area-inset-bottom, 28px))',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
      }}>
        <button onClick={isRecording ? stopRecording : startRecording} style={{
          width: 88, height: 88, borderRadius: '50%',
          border: 'none', cursor: 'pointer',
          background: isRecording
            ? `linear-gradient(135deg, ${C.red}, #EF4444)`
            : `linear-gradient(135deg, ${C.gold}, #F59E0B)`,
          color: 'white',
          boxShadow: isRecording
            ? '0 6px 32px rgba(220,38,38,0.45)'
            : '0 6px 32px rgba(212,175,55,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.2s ease',
          animation: isRecording ? 'micPulse 1s infinite' : 'none',
        }}>
          {isRecording ? (
            <div style={{ width: 24, height: 24, borderRadius: 5, background: 'white' }} />
          ) : (
            <svg width="36" height="36" viewBox="0 0 24 24" fill="white" stroke="none">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <line x1="12" y1="19" x2="12" y2="23" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          )}
        </button>
        {pendingCount > 0 && !isRecording && (
          <div style={{
            position: 'absolute', top: -2, right: -2,
            background: C.red, color: 'white',
            width: 24, height: 24, borderRadius: '50%',
            fontSize: 11, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: `2px solid ${C.bg}`,
          }}>
            {pendingCount}
          </div>
        )}
      </div>

      {/* ─── Recording overlay ─── */}
      {isRecording && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 999,
          background: 'rgba(250,250,249,0.97)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: 32,
        }}
          onClick={stopRecording}
        >
          <div style={{ display: 'flex', gap: 5, marginBottom: 40 }}>
            {[0, 1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} style={{
                width: 4, borderRadius: 2, background: C.gold,
                animation: `waveBar 0.8s ease-in-out ${i * 0.1}s infinite alternate`,
              }} />
            ))}
          </div>

          <div style={{
            color: C.text, fontSize: 24, fontWeight: 800,
            textAlign: 'center', lineHeight: 1.5,
            minHeight: 60, maxWidth: '85vw',
          }}>
            {interim || '...'}
          </div>

          <div style={{
            color: C.textFaint, fontSize: 11, marginTop: 32,
            letterSpacing: 2, fontWeight: 600,
          }}>
            TAP TO STOP
          </div>
        </div>
      )}

      <style>{`
        @keyframes micPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
        @keyframes waveBar {
          0% { height: 8px; }
          100% { height: 44px; }
        }
      `}</style>
    </div>
  );
}

export default function LifeMemberPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: C.bg }} />}>
      <LifeMemberInner />
    </Suspense>
  );
}
