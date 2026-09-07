import { AnimatePresence, motion } from 'framer-motion';
import { Bell, CheckCheck } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import type { NotificationItem } from '../../types/api';

function timeAgo(iso: string): string {
    const then = new Date(iso).getTime();
    if (Number.isNaN(then)) return '';
    const diff = Date.now() - then;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
}

export function NotificationsBell() {
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState<NotificationItem[]>([]);
    const [unread, setUnread] = useState(0);
    const [loading, setLoading] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const refresh = async () => {
        try {
            const [list, countRes] = await Promise.all([
                api.notifications().catch(() => null),
                api.notificationsUnread().catch(() => null),
            ]);
            if (list) {
                setItems(list.notifications);
                setUnread(list.unread_count ?? countRes?.unread_count ?? 0);
            } else if (countRes) {
                setUnread(countRes.unread_count);
            }
        } catch {
            /* bell stays silent on failure */
        }
    };

    useEffect(() => {
        refresh();
        const interval = setInterval(refresh, 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const close = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', close);
        return () => document.removeEventListener('mousedown', close);
    }, []);

    const openBell = async () => {
        const opening = !open;
        setLoading(true);
        setOpen(opening);
        if (opening) await refresh();
        setLoading(false);
    };

    const markAllRead = async () => {
        try {
            await api.notificationsMarkAllRead();
            setItems((prev) => prev.map((n) => ({ ...n, is_read: true })));
            setUnread(0);
        } catch {
            /* ignore */
        }
    };

    const markOneRead = async (n: NotificationItem) => {
        if (!n.is_read) {
            try {
                await api.notificationMarkRead(n.id).catch(() => null);
                setUnread((u) => Math.max(0, u - 1));
            } catch {
                /* ignore */
            }
        }
        if (n.link) {
            setOpen(false);
            window.open(n.link, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <div ref={ref} className="relative">
            <button
                onClick={openBell}
                className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-surface text-ink-sec transition-colors hover:bg-elevated hover:text-ink"
                aria-label="Notifications"
            >
                <Bell size={16} strokeWidth={2} />
                {unread > 0 && (
                    <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-burgundy px-1 text-[10px] font-semibold text-white">
                        {unread > 99 ? '99+' : unread}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{ duration: 0.12 }}
                        className="absolute right-0 top-full z-50 mt-1.5 w-80 rounded-xl border border-line bg-surface shadow-card-hover"
                    >
                        <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
                            <p className="text-sm font-semibold text-ink">Notifications</p>
                            {unread > 0 && (
                                <button
                                    onClick={markAllRead}
                                    className="flex items-center gap-1 text-xs font-medium text-accent hover:underline"
                                >
                                    <CheckCheck size={13} /> Mark all read
                                </button>
                            )}
                        </div>

                        <div className="max-h-80 overflow-y-auto">
                            {loading && items.length === 0 ? (
                                <p className="px-4 py-8 text-center text-sm text-ink-sec">Loading…</p>
                            ) : items.length === 0 ? (
                                <p className="px-4 py-10 text-center text-sm text-ink-sec">
                                    No notifications yet. Notifications about job matches will appear here.
                                </p>
                            ) : (
                                items.map((n) => (
                                    <button
                                        key={n.id}
                                        onClick={() => markOneRead(n)}
                                        className={`block w-full border-b border-line/60 px-4 py-3 text-left transition-colors hover:bg-elevated ${
                                            n.is_read ? '' : 'bg-accent-soft/40'
                                        }`}
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <p className="text-sm font-medium text-ink">{n.title}</p>
                                            {!n.is_read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent" />}
                                        </div>
                                        {n.message && <p className="mt-0.5 text-xs text-ink-sec">{n.message}</p>}
                                        <p className="mt-1 text-[11px] text-ink-ter">{timeAgo(n.created_at || '')}</p>
                                    </button>
                                ))
                            )}
                        </div>

                        <div className="border-t border-line p-1.5">
                            <button
                                onClick={() => {
                                    setOpen(false);
                                    navigate('/jobs');
                                }}
                                className="block w-full rounded-md px-3 py-2 text-center text-sm font-medium text-accent transition-colors hover:bg-elevated"
                            >
                                Find more roles
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}