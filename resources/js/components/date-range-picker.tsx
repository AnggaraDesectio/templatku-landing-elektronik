import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { CalendarDays } from 'lucide-react';

// Pilihan rentang tanggal dengan preset siap pakai + input tanggal manual.
// Tanpa kalender visual (primitif kalender belum ada di ui/), jadi pakai
// input date bawaan browser yang sudah dirapikan gayanya.

// Rentang tanggal absolut (jam disetel ke awal/akhir hari oleh preset).
export interface DateRange {
    from: Date;
    to: Date;
}

interface Preset {
    label: string;
    get: () => DateRange;
}

function startOfDay(d: Date): Date {
    const c = new Date(d);
    c.setHours(0, 0, 0, 0);
    return c;
}

function endOfDay(d: Date): Date {
    const c = new Date(d);
    c.setHours(23, 59, 59, 999);
    return c;
}

function addDays(d: Date, n: number): Date {
    const c = new Date(d);
    c.setDate(c.getDate() + n);
    return c;
}

const PRESETS: Preset[] = [
    {
        label: 'Hari ini',
        get: () => ({ from: startOfDay(new Date()), to: endOfDay(new Date()) }),
    },
    {
        label: '7 hari terakhir',
        get: () => ({ from: startOfDay(addDays(new Date(), -6)), to: endOfDay(new Date()) }),
    },
    {
        label: '30 hari terakhir',
        get: () => ({ from: startOfDay(addDays(new Date(), -29)), to: endOfDay(new Date()) }),
    },
    {
        label: 'Bulan ini',
        get: () => {
            const now = new Date();
            return {
                from: startOfDay(new Date(now.getFullYear(), now.getMonth(), 1)),
                to: endOfDay(new Date()),
            };
        },
    },
];

// Nama bulan pendek ala Indonesia untuk label trigger.
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

function fmt(d: Date): string {
    return `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]} ${d.getFullYear()}`;
}

function fmtRange(r: DateRange): string {
    const sameMonth = r.from.getMonth() === r.to.getMonth() && r.from.getFullYear() === r.to.getFullYear();
    if (sameMonth) {
        return `${r.from.getDate()}, ${fmt(r.to)}`;
    }
    return `${fmt(r.from)}, ${fmt(r.to)}`;
}

function toInputValue(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

function fromInputValue(v: string): Date | null {
    const parts = v.split('-').map(Number);
    if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return null;
    const [y, m, d] = parts;
    const date = new Date(y, m - 1, d);
    if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) return null;
    return date;
}

export function DateRangePicker({
    value,
    onChange,
    className,
}: {
    value?: DateRange;
    onChange?: (r: DateRange) => void;
    className?: string;
}) {
    const [open, setOpen] = useState(false);
    const [internal, setInternal] = useState<DateRange>(() => PRESETS[1].get());
    const [activePreset, setActivePreset] = useState<string | null>(PRESETS[1].label);

    // Mode terkendali: value dari luar; tak terkendali: state internal.
    const range = value ?? internal;

    useEffect(() => {
        if (value) setActivePreset(null);
    }, [value]);

    function commit(next: DateRange, presetLabel: string | null) {
        if (next.to < next.from) {
            next = { from: next.from, to: endOfDay(next.from) };
        }
        setInternal(next);
        setActivePreset(presetLabel);
        onChange?.(next);
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn('justify-start gap-2 font-normal', !range && 'text-muted-foreground', className)}
                >
                    <CalendarDays className="h-4 w-4 shrink-0" />
                    <span className="tnum">{range ? fmtRange(range) : 'Pilih rentang'}</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-72 p-3">
                <div className="grid grid-cols-2 gap-1.5">
                    {PRESETS.map((p) => (
                        <Button
                            key={p.label}
                            variant={activePreset === p.label ? 'secondary' : 'ghost'}
                            size="sm"
                            className="justify-start text-xs"
                            onClick={() => commit(p.get(), p.label)}
                        >
                            {p.label}
                        </Button>
                    ))}
                </div>
                <Separator className="my-3" />
                <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1.5">
                        <Label htmlFor="drp-from" className="text-xs text-muted-foreground">
                            Dari
                        </Label>
                        <Input
                            id="drp-from"
                            type="date"
                            value={toInputValue(range.from)}
                            max={toInputValue(range.to)}
                            className="text-xs"
                            onChange={(e) => {
                                const d = fromInputValue(e.target.value);
                                if (d) commit({ from: startOfDay(d), to: range.to }, null);
                            }}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="drp-to" className="text-xs text-muted-foreground">
                            Sampai
                        </Label>
                        <Input
                            id="drp-to"
                            type="date"
                            value={toInputValue(range.to)}
                            min={toInputValue(range.from)}
                            className="text-xs"
                            onChange={(e) => {
                                const d = fromInputValue(e.target.value);
                                if (d) commit({ from: range.from, to: endOfDay(d) }, null);
                            }}
                        />
                    </div>
                </div>
                <Button size="sm" className="mt-3 w-full" onClick={() => setOpen(false)}>
                    Terapkan
                </Button>
            </PopoverContent>
        </Popover>
    );
}

// Demo untuk galeri komponen: terkendali agar galeri bisa menampilkan hasilnya.
export function DateRangePickerDemo() {
    const [range, setRange] = useState<DateRange>(PRESETS[1].get());
    return (
        <div className="flex flex-col gap-3">
            <DateRangePicker value={range} onChange={setRange} />
            <p className="text-xs text-muted-foreground">
                Laporan penjualan Bandung: <span className="tnum font-medium text-foreground">{fmtRange(range)}</span>
            </p>
        </div>
    );
}
