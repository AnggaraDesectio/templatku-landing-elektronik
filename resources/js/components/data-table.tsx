import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    ArrowUpDown,
    ChevronLeft,
    ChevronRight,
    MoreHorizontal,
    Pencil,
    Plus,
    Rows3,
    Search,
    Trash2,
} from 'lucide-react';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { toast } from 'sonner';
import { EmptyState } from '@/components/empty-state';

export interface Column<T> {
    key: string;
    header: string;
    render?: (row: T) => ReactNode;
    sortValue?: (row: T) => string | number;
    className?: string;
    mobileHidden?: boolean;
}

export interface FilterOption {
    key: string;
    label: string;
    options: { value: string; label: string }[];
    /**
     * Opsional (mundur-kompatibel). Bila tidak diisi, nilai filter
     * dicocokkan dengan kesetaraan string pada kolom `key`.
     */
    match?: (row: any, value: string) => boolean;
}

export interface BulkAction {
    label: string;
    onSelect: (ids: (string | number)[]) => void;
    variant?: 'default' | 'destructive';
}

export interface DataTableProps<T extends { id: string | number }> {
    columns: Column<T>[];
    rows: T[];
    searchKeys?: (keyof T)[];
    searchPlaceholder?: string;
    filters?: FilterOption[];
    bulkActions?: BulkAction[];
    pageSize?: number;
    onAdd?: () => void;
    addLabel?: string;
    onEdit?: (row: T) => void;
    onDelete?: (row: T) => void;
    onRowClick?: (row: T) => void;
    renderMobileCard?: (row: T) => ReactNode;
    emptyTitle?: string;
    emptyDescription?: string;
    extraActions?: ReactNode;
    extraRowActions?: (row: T) => ReactNode;
}

type Density = 'comfortable' | 'compact';
const DENSITY_KEY = 'tpl-table-density';
const SEARCH_DEBOUNCE_MS = 300;

function defaultMatch(row: any, key: string, value: string): boolean {
    return (
        String(row?.[key] ?? '').toLowerCase() === value.toLowerCase()
    );
}

export function DataTable<T extends { id: string | number }>({
    columns,
    rows,
    searchKeys,
    searchPlaceholder = 'Cari…',
    filters,
    bulkActions,
    pageSize = 8,
    onAdd,
    addLabel = 'Tambah',
    onEdit,
    onDelete,
    onRowClick,
    renderMobileCard,
    emptyTitle = 'Belum ada data',
    emptyDescription = 'Data akan tampil di sini setelah ditambahkan.',
    extraActions,
    extraRowActions,
}: DataTableProps<T>) {
    const [q, setQ] = useState('');
    const [dq, setDq] = useState('');
    const [sortKey, setSortKey] = useState<string | null>(null);
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
    const [page, setPage] = useState(1);
    const [filterVals, setFilterVals] = useState<Record<string, string>>({});
    const [confirm, setConfirm] = useState<T | null>(null);
    const [selected, setSelected] = useState<Set<string | number>>(new Set());
    const [density, setDensity] = useState<Density>(() => {
        try {
            return typeof window !== 'undefined' &&
                window.localStorage.getItem(DENSITY_KEY) === 'compact'
                ? 'compact'
                : 'comfortable';
        } catch {
            return 'comfortable';
        }
    });

    // Pencarian di-debounce 300ms agar tidak memfilter ulang tiap ketikan.
    useEffect(() => {
        const id = window.setTimeout(() => setDq(q), SEARCH_DEBOUNCE_MS);
        return () => window.clearTimeout(id);
    }, [q]);

    const setDensityPersisted = (d: Density) => {
        setDensity(d);
        try {
            window.localStorage.setItem(DENSITY_KEY, d);
        } catch {
            /* localStorage tidak tersedia, abaikan */
        }
    };

    // Seleksi hanya berlaku untuk baris yang terlihat: reset saat
    // pencarian/filter/halaman berubah.
    useEffect(() => {
        setSelected(new Set());
    }, [dq, filterVals, page]);

    const selectable = !!bulkActions && bulkActions.length > 0;

    const filtered = useMemo(() => {
        let list = [...rows];
        if (dq && searchKeys) {
            const needle = dq.toLowerCase();
            list = list.filter((r) =>
                searchKeys.some((k) =>
                    String(r[k] ?? '')
                        .toLowerCase()
                        .includes(needle),
                ),
            );
        }
        filters?.forEach((f) => {
            const v = filterVals[f.key];
            if (v && v !== 'all') {
                const match = f.match ?? ((row: any, val: string) => defaultMatch(row, f.key, val));
                list = list.filter((r) => match(r, v));
            }
        });
        if (sortKey) {
            const col = columns.find((c) => c.key === sortKey);
            if (col?.sortValue) {
                list.sort((a, b) => {
                    const av = col.sortValue!(a);
                    const bv = col.sortValue!(b);
                    if (av < bv) return sortDir === 'asc' ? -1 : 1;
                    if (av > bv) return sortDir === 'asc' ? 1 : -1;
                    return 0;
                });
            }
        }
        return list;
    }, [rows, dq, filterVals, sortKey, sortDir, filters, searchKeys, columns]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    const current = Math.min(page, totalPages);
    const paged = filtered.slice((current - 1) * pageSize, current * pageSize);

    const visibleIds = paged.map((r) => r.id);
    const allVisible =
        visibleIds.length > 0 && visibleIds.every((id) => selected.has(id));
    const someVisible = visibleIds.some((id) => selected.has(id));

    const toggleOne = (id: string | number) =>
        setSelected((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });

    const toggleAllVisible = () =>
        setSelected((prev) => {
            const next = new Set(prev);
            if (visibleIds.every((id) => next.has(id)))
                visibleIds.forEach((id) => next.delete(id));
            else visibleIds.forEach((id) => next.add(id));
            return next;
        });

    const toggleSort = (key: string) => {
        if (sortKey === key) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
        else {
            setSortKey(key);
            setSortDir('asc');
        }
    };

    const handleRowKeyDown = (e: React.KeyboardEvent, row: T) => {
        if (!onRowClick) return;
        // Biarkan checkbox menangani Enter/Spasi sendiri.
        if ((e.target as HTMLElement).closest?.('[role="checkbox"]'))
            return;
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onRowClick(row);
        }
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                <div className="flex flex-wrap items-center gap-2">
                    {searchKeys && (
                        <div className="relative min-w-0 flex-1 sm:min-w-[240px] sm:flex-none">
                            <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                            <Input
                                value={q}
                                onChange={(e) => {
                                    setQ(e.target.value);
                                    setPage(1);
                                }}
                                placeholder={searchPlaceholder}
                                className="pl-9"
                                aria-label={searchPlaceholder}
                            />
                        </div>
                    )}
                    {filters?.map((f) => (
                        <Select
                            key={f.key}
                            value={filterVals[f.key] ?? 'all'}
                            onValueChange={(v) => {
                                setFilterVals({ ...filterVals, [f.key]: v });
                                setPage(1);
                            }}
                        >
                            <SelectTrigger className="w-[160px]">
                                <SelectValue placeholder={f.label} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    Semua {f.label}
                                </SelectItem>
                                {f.options.map((o) => (
                                    <SelectItem key={o.value} value={o.value}>
                                        {o.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    ))}
                    <Button
                        variant="outline"
                        size="icon"
                        className={cn(
                            'h-9 w-9',
                            density === 'compact' && 'bg-muted',
                        )}
                        aria-label={
                            density === 'compact'
                                ? 'Ubah ke tampilan nyaman'
                                : 'Ubah ke tampilan ringkas'
                        }
                        title={
                            density === 'compact'
                                ? 'Tampilan nyaman'
                                : 'Tampilan ringkas'
                        }
                        onClick={() =>
                            setDensityPersisted(
                                density === 'compact'
                                    ? 'comfortable'
                                    : 'compact',
                            )
                        }
                    >
                        <Rows3 className="h-4 w-4" />
                    </Button>
                </div>
                <div className="flex flex-wrap items-center justify-end gap-2">
                    {extraActions}
                    {onAdd && (
                        <Button onClick={onAdd} className="gap-2">
                            <Plus className="h-4 w-4" /> {addLabel}
                        </Button>
                    )}
                </div>
            </div>

            {selectable && selected.size > 0 && (
                <div className="bg-muted/60 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-lg border px-3 py-2">
                    <span className="text-xs font-semibold">
                        {selected.size} terpilih
                    </span>
                    <span className="text-muted-foreground text-[11px]">
                        berlaku untuk baris yang terlihat
                    </span>
                    <div className="ml-auto flex flex-wrap items-center gap-2">
                        {bulkActions!.map((a) => (
                            <Button
                                key={a.label}
                                size="sm"
                                variant={
                                    a.variant === 'destructive'
                                        ? 'destructive'
                                        : 'outline'
                                }
                                onClick={() => {
                                    a.onSelect([...selected]);
                                    setSelected(new Set());
                                }}
                            >
                                {a.label}
                            </Button>
                        ))}
                    </div>
                </div>
            )}

            {filtered.length === 0 ? (
                <EmptyState
                    title={emptyTitle}
                    description={emptyDescription}
                    action={
                        onAdd
                            ? { label: addLabel, onClick: onAdd }
                            : undefined
                    }
                />
            ) : (
                <>
                    {/* Mobile cards */}
                    <div className="grid gap-3 md:hidden">
                        {paged.map((row) => (
                            <div
                                key={row.id}
                                className={cn(
                                    'bg-card rounded-xl border shadow-sm',
                                    density === 'compact' ? 'p-2.5' : 'p-4',
                                    onRowClick &&
                                        'focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none',
                                )}
                                // Kartu mobile bisa diklik: sediakan peran + keyboard.
                                role={onRowClick ? 'button' : undefined}
                                tabIndex={onRowClick ? 0 : undefined}
                                onKeyDown={(e) => handleRowKeyDown(e, row)}
                                onClick={() => onRowClick?.(row)}
                            >
                                {selectable && (
                                    <div
                                        className="mb-2 flex justify-end"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <Checkbox
                                            checked={selected.has(row.id)}
                                            onCheckedChange={() =>
                                                toggleOne(row.id)
                                            }
                                            aria-label="Pilih baris"
                                        />
                                    </div>
                                )}
                                {renderMobileCard ? (
                                    renderMobileCard(row)
                                ) : (
                                    <div className="space-y-1.5">
                                        {columns
                                            .filter((c) => !c.mobileHidden)
                                            .map((c) => (
                                                <div
                                                    key={c.key}
                                                    className="flex items-start justify-between gap-3 text-sm"
                                                >
                                                    <span className="text-muted-foreground shrink-0 text-xs font-medium">
                                                        {c.header}
                                                    </span>
                                                    <span className="min-w-0 text-right">
                                                        {c.render
                                                            ? c.render(row)
                                                            : (row as any)[
                                                                  c.key
                                                              ]}
                                                    </span>
                                                </div>
                                            ))}
                                    </div>
                                )}
                                {(onEdit || onDelete || extraRowActions) && (
                                    <div className="mt-3 flex items-center justify-end gap-2 border-t pt-3">
                                        {extraRowActions &&
                                            extraRowActions(row)}
                                        {onEdit && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onEdit(row);
                                                }}
                                            >
                                                <Pencil className="mr-1 h-3.5 w-3.5" />{' '}
                                                Edit
                                            </Button>
                                        )}
                                        {onDelete && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-destructive hover:text-destructive"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setConfirm(row);
                                                }}
                                            >
                                                <Trash2 className="mr-1 h-3.5 w-3.5" />{' '}
                                                Hapus
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Desktop table */}
                    <div className="bg-card hidden overflow-hidden rounded-xl border shadow-sm md:block">
                        <div className="overflow-x-auto">
                            <Table
                                className={
                                    density === 'compact'
                                        ? '[&_td]:py-1 [&_th]:h-auto [&_th]:py-1.5'
                                        : ''
                                }
                            >
                                <TableHeader>
                                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                                        {selectable && (
                                            <TableHead
                                                className="w-10"
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                            >
                                                <Checkbox
                                                    checked={
                                                        allVisible
                                                            ? true
                                                            : someVisible
                                                              ? 'indeterminate'
                                                              : false
                                                    }
                                                    onCheckedChange={
                                                        toggleAllVisible
                                                    }
                                                    aria-label="Pilih semua baris yang terlihat"
                                                />
                                            </TableHead>
                                        )}
                                        {columns.map((c) => (
                                            <TableHead
                                                key={c.key}
                                                className={c.className}
                                            >
                                                {c.sortValue ? (
                                                    <button
                                                        onClick={() =>
                                                            toggleSort(c.key)
                                                        }
                                                        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-xs font-semibold tracking-wide uppercase"
                                                    >
                                                        {c.header}
                                                        <ArrowUpDown className="h-3 w-3" />
                                                    </button>
                                                ) : (
                                                    <span className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                                                        {c.header}
                                                    </span>
                                                )}
                                            </TableHead>
                                        ))}
                                        {(onEdit ||
                                            onDelete ||
                                            extraRowActions) && (
                                            <TableHead className="w-10" />
                                        )}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paged.map((row) => (
                                        <TableRow
                                            key={row.id}
                                            className={cn(
                                                onRowClick
                                                    ? 'cursor-pointer focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-inset focus-visible:outline-none'
                                                    : '',
                                            )}
                                            // Baris bisa diklik: buat fokus keyboard (Enter) bisa memicunya juga.
                                            tabIndex={onRowClick ? 0 : undefined}
                                            onKeyDown={(e) =>
                                                handleRowKeyDown(e, row)
                                            }
                                            onClick={() => onRowClick?.(row)}
                                        >
                                            {selectable && (
                                                <TableCell
                                                    className="w-10"
                                                    onClick={(e) =>
                                                        e.stopPropagation()
                                                    }
                                                >
                                                    <Checkbox
                                                        checked={selected.has(
                                                            row.id,
                                                        )}
                                                        onCheckedChange={() =>
                                                            toggleOne(row.id)
                                                        }
                                                        aria-label="Pilih baris"
                                                    />
                                                </TableCell>
                                            )}
                                            {columns.map((c) => (
                                                <TableCell
                                                    key={c.key}
                                                    className={c.className}
                                                >
                                                    {c.render
                                                        ? c.render(row)
                                                        : (row as any)[c.key]}
                                                </TableCell>
                                            ))}
                                            {(onEdit ||
                                                onDelete ||
                                                extraRowActions) && (
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger
                                                            asChild
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8"
                                                                aria-label="Aksi baris"
                                                                onClick={(e) =>
                                                                    e.stopPropagation()
                                                                }
                                                            >
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            {extraRowActions && (
                                                                <div className="border-b p-1 md:hidden lg:block">
                                                                    {extraRowActions(
                                                                        row,
                                                                    )}
                                                                </div>
                                                            )}
                                                            {onEdit && (
                                                                <DropdownMenuItem
                                                                    onClick={(
                                                                        e,
                                                                    ) => {
                                                                        e.stopPropagation();
                                                                        onEdit(
                                                                            row,
                                                                        );
                                                                    }}
                                                                >
                                                                    <Pencil className="mr-2 h-4 w-4" />{' '}
                                                                    Edit
                                                                </DropdownMenuItem>
                                                            )}
                                                            {onDelete && (
                                                                <DropdownMenuItem
                                                                    className="text-destructive focus:text-destructive"
                                                                    onClick={(
                                                                        e,
                                                                    ) => {
                                                                        e.stopPropagation();
                                                                        setConfirm(
                                                                            row,
                                                                        );
                                                                    }}
                                                                >
                                                                    <Trash2 className="mr-2 h-4 w-4" />{' '}
                                                                    Hapus
                                                                </DropdownMenuItem>
                                                            )}
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    <div className="text-muted-foreground flex items-center justify-between gap-2 text-xs">
                        <span>
                            Menampilkan {(current - 1) * pageSize + 1}–
                            {Math.min(current * pageSize, filtered.length)} dari{' '}
                            {filtered.length}
                        </span>
                        <div className="flex items-center gap-1">
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                aria-label="Halaman sebelumnya"
                                onClick={() =>
                                    setPage((p) => Math.max(1, p - 1))
                                }
                                disabled={current === 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <span className="text-foreground px-2">
                                {current} / {totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                aria-label="Halaman berikutnya"
                                onClick={() =>
                                    setPage((p) => Math.min(totalPages, p + 1))
                                }
                                disabled={current === totalPages}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </>
            )}

            <AlertDialog
                open={!!confirm}
                onOpenChange={(o) => !o && setConfirm(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus data ini?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Data akan
                            dihapus secara permanen.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={() => {
                                if (confirm && onDelete) {
                                    onDelete(confirm);
                                    toast.success('Data berhasil dihapus');
                                }
                                setConfirm(null);
                            }}
                        >
                            Ya, hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

export function StatusBadge({ value }: { value: string }) {
    const v = value.toLowerCase();
    let cls = 'bg-muted text-muted-foreground';
    if (
        ['selesai', 'disetujui', 'aktif', 'baik', 'approved'].some((s) =>
            v.includes(s),
        )
    )
        cls = 'bg-success/15 text-success border border-success/30';
    else if (
        ['proses', 'diajukan', 'menunggu', 'pending', 'pemeliharaan'].some(
            (s) => v.includes(s),
        )
    )
        cls = 'bg-warning/20 text-warning-foreground border border-warning/40';
    else if (
        ['ditolak', 'rusak', 'kadaluarsa', 'expired'].some((s) => v.includes(s))
    )
        cls = 'bg-destructive/15 text-destructive border border-destructive/30';
    else if (['disposisi', 'draft', 'info'].some((s) => v.includes(s)))
        cls = 'bg-info/15 text-info border border-info/30';
    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${cls}`}
        >
            {value}
        </span>
    );
}
