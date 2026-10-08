import { cn } from '@/lib/utils';

function Skeleton({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn('bg-primary/10 animate-pulse rounded-md', className)}
            // Penanda loading untuk screen reader.
            role="status"
            {...props}
        >
            <span className="sr-only">Memuat…</span>
        </div>
    );
}

export { Skeleton };
