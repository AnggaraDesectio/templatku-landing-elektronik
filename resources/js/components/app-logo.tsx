import { useBrand } from '@/hooks/use-brand';
import { cn } from '@/lib/utils';

/** Logo brand: kotak primary berisi inisial + nama (tanpa aset gambar). */
export function AppLogo({
    collapsed = false,
    className,
}: {
    collapsed?: boolean;
    className?: string;
}) {
    const brand = useBrand();
    if (collapsed) {
        return (
            <span
                className={cn(
                    'bg-primary text-primary-foreground flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold',
                    className,
                )}
                aria-label={brand.name}
            >
                {brand.initials}
            </span>
        );
    }
    return (
        <span className={cn('flex items-center gap-2.5', className)}>
            <span className="bg-primary text-primary-foreground flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold">
                {brand.initials}
            </span>
            <span className="truncate text-base font-semibold tracking-tight">
                {brand.name}
            </span>
        </span>
    );
}
