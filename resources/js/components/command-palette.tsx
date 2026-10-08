// Command palette (⌘K / Ctrl+K): navigasi cepat antar halaman.
// Dibuka dari AuthenticatedLayout (listener keydown di sana).
// Dibangun di atas ui/dialog (Radix), tanpa dependency tambahan.
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from '@/components/ui/dialog';
import { useT } from '@/lib/i18n';
import { navItemLabel, navSections } from '@/lib/nav';
import { cn } from '@/lib/utils';
import { router } from '@inertiajs/react';
import { Printer, Search, type LucideIcon } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

export interface PaletteItem {
    id: string;
    label: string;
    hint?: string;
    icon?: LucideIcon;
    run: () => void;
}

/** Skor fuzzy sederhana: cocok subsequence, bonus kontigu & awal kata. */
function fuzzyScore(text: string, query: string): number | null {
    const t = text.toLowerCase();
    const q = query.toLowerCase().trim();
    if (!q) return 0;
    let ti = 0;
    let qi = 0;
    let score = 0;
    let last = -2;
    while (ti < t.length && qi < q.length) {
        if (t[ti] === q[qi]) {
            score += (ti === last + 1 ? 2 : 1) + (ti === 0 || t[ti - 1] === ' ' ? 2 : 0);
            last = ti;
            qi++;
        }
        ti++;
    }
    return qi === q.length ? score : null;
}

function usePaletteItems(): PaletteItem[] {
    const t = useT();
    return useMemo(() => {
        const pages: PaletteItem[] = navSections.flatMap((s) =>
            s.items.map((it) => ({
                id: `page:${it.to}`,
                label: navItemLabel(t, it),
                hint: it.to,
                icon: it.icon,
                run: () => router.visit(it.to),
            })),
        );
        // Aksi ekstra (bukan navigasi halaman).
        const actions: PaletteItem[] = [
            {
                id: 'action:print',
                label: 'Cetak halaman ini',
                hint: 'window.print',
                icon: Printer,
                run: () => window.print(),
            },
        ];
        // Dedup halaman yang path-nya sama (mis. '/').
        const seen = new Set<string>();
        return [...pages, ...actions].filter((p) => {
            if (seen.has(p.id)) return false;
            seen.add(p.id);
            return true;
        });
    }, [t]);
}

export function CommandPalette({
    open,
    onOpenChange,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const items = usePaletteItems();
    const [query, setQuery] = useState('');
    const [active, setActive] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    const results = useMemo(() => {
        const scored = items
            .map((it) => ({ it, score: fuzzyScore(it.label, query) }))
            .filter((r) => r.score !== null)
            .sort((a, b) => (b.score as number) - (a.score as number));
        return scored.map((r) => r.it);
    }, [items, query]);

    // Reset state tiap kali dibuka; fokus ke input.
    useEffect(() => {
        if (open) {
            setQuery('');
            setActive(0);
            const id = requestAnimationFrame(() => inputRef.current?.focus());
            return () => cancelAnimationFrame(id);
        }
    }, [open ]);

    useEffect(() => {
        setActive(0);
    }, [query]);

    const choose = (item: PaletteItem) => {
        onOpenChange(false);
        item.run();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="top-[12%] max-w-lg translate-y-0 gap-0 overflow-hidden p-0"
                aria-describedby={undefined}
            >
                <DialogTitle className="sr-only">Pencarian cepat</DialogTitle>
                <div className="flex items-center gap-2 border-b px-4">
                    <Search className="text-muted-foreground h-4 w-4 shrink-0" />
                    <input
                        ref={inputRef}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        // Placeholder bukan label: tambahkan aria-label eksplisit.
                        aria-label="Cari halaman atau aksi"
                        role="combobox"
                        aria-expanded="true"
                        aria-controls="palette-listbox"
                        aria-activedescendant={
                            results[active]
                                ? `palette-option-${results[active].id}`
                                : undefined
                        }
                        onKeyDown={(e) => {
                            if (e.key === 'ArrowDown') {
                                e.preventDefault();
                                setActive((a) =>
                                    Math.min(a + 1, results.length - 1),
                                );
                            } else if (e.key === 'ArrowUp') {
                                e.preventDefault();
                                setActive((a) => Math.max(a - 1, 0));
                            } else if (e.key === 'Enter') {
                                e.preventDefault();
                                const item = results[active];
                                if (item) choose(item);
                            }
                        }}
                        placeholder="Ketik untuk mencari halaman…"
                        className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                    />
                    <kbd className="bg-muted text-muted-foreground hidden rounded px-1.5 py-0.5 text-[10px] font-medium sm:block">
                        ESC
                    </kbd>
                </div>
                <div
                    id="palette-listbox"
                    role="listbox"
                    aria-label="Hasil pencarian"
                    className="max-h-[320px] overflow-y-auto p-2"
                >
                    {results.length === 0 ? (
                        <p className="text-muted-foreground px-3 py-8 text-center text-sm">
                            Tidak ada hasil untuk “{query}”.
                        </p>
                    ) : (
                        results.map((item, i) => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.id}
                                    id={`palette-option-${item.id}`}
                                    role="option"
                                    aria-selected={i === active}
                                    onMouseEnter={() => setActive(i)}
                                    onClick={() => choose(item)}
                                    className={cn(
                                        'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors',
                                        i === active
                                            ? 'bg-primary text-primary-foreground'
                                            : 'hover:bg-muted',
                                    )}
                                >
                                    {Icon && (
                                        <Icon className="h-4 w-4 shrink-0 opacity-70" />
                                    )}
                                    <span className="flex-1 truncate font-medium">
                                        {item.label}
                                    </span>
                                    {item.hint && (
                                        <span
                                            className={cn(
                                                'truncate text-xs',
                                                i === active
                                                    ? 'text-primary-foreground/70'
                                                    : 'text-muted-foreground',
                                            )}
                                        >
                                            {item.hint}
                                        </span>
                                    )}
                                </button>
                            );
                        })
                    )}
                </div>
                <div className="text-muted-foreground flex items-center gap-4 border-t px-4 py-2.5 text-[11px]">
                    <span>
                        <kbd className="bg-muted rounded px-1 font-medium">↑↓</kbd>{' '}
                        navigasi
                    </span>
                    <span>
                        <kbd className="bg-muted rounded px-1 font-medium">↵</kbd>{' '}
                        pilih
                    </span>
                    <span className="ml-auto">ESC untuk tutup</span>
                </div>
            </DialogContent>
        </Dialog>
    );
}
