// Timeline aktivitas vertikal: dot ikon + garis penghubung,
// timestamp, judul, deskripsi, badge opsional, varian warna dot.
// Dipakai mis. di section agenda dashboard.tsx.
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

export type TimelineVariant =
    | 'default'
    | 'primary'
    | 'success'
    | 'warning'
    | 'danger'
    | 'info';

export interface TimelineItem {
    id: string;
    icon: LucideIcon;
    time: string;
    title: string;
    description?: string;
    badge?: string;
    variant?: TimelineVariant;
}

const variantClasses: Record<TimelineVariant, string> = {
    default: 'bg-muted text-muted-foreground',
    primary: 'bg-primary/10 text-primary',
    success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    danger: 'bg-destructive/10 text-destructive',
    info: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
};

export function ActivityTimeline({ items }: { items: TimelineItem[] }) {
    if (items.length === 0) {
        return (
            <p className="text-muted-foreground py-6 text-center text-sm">
                Belum ada aktivitas.
            </p>
        );
    }
    return (
        <ol className="relative">
            {items.map((item, i) => {
                const Icon = item.icon;
                const last = i === items.length - 1;
                return (
                    <li key={item.id} className="relative flex gap-4 pb-6 last:pb-0">
                        {/* Garis vertikal penghubung */}
                        {!last && (
                            <span
                                aria-hidden
                                className="bg-border absolute top-10 bottom-0 left-[17px] w-px"
                            />
                        )}
                        <div
                            className={cn(
                                'z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
                                variantClasses[item.variant ?? 'default'],
                            )}
                        >
                            <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1 pt-0.5">
                            <div className="flex flex-wrap items-center gap-2">
                                <p className="text-sm font-medium">{item.title}</p>
                                {item.badge && (
                                    <Badge variant="secondary" className="text-[10px]">
                                        {item.badge}
                                    </Badge>
                                )}
                            </div>
                            {item.description && (
                                <p className="text-muted-foreground mt-0.5 text-xs">
                                    {item.description}
                                </p>
                            )}
                            <p className="text-muted-foreground/80 mt-1 text-[11px]">
                                {item.time}
                            </p>
                        </div>
                    </li>
                );
            })}
        </ol>
    );
}
