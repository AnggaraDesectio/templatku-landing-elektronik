import { Link } from '@inertiajs/react';
import { ChevronRight, Home } from 'lucide-react';
import type { ReactNode } from 'react';

export function PageHeader({
    title,
    description,
    breadcrumbs,
    actions,
}: {
    title: string;
    description?: string;
    breadcrumbs?: { label: string; href?: string }[];
    actions?: ReactNode;
}) {
    return (
        <div className="mb-5 space-y-3">
            <nav
                aria-label="Breadcrumb"
                className="text-muted-foreground flex items-center gap-1 text-xs"
            >
                <Link
                    href="/"
                    className="hover:text-foreground inline-flex items-center gap-1"
                >
                    <Home className="h-3.5 w-3.5" /> Beranda
                </Link>
                {breadcrumbs?.map((b, i) => (
                    <span key={i} className="inline-flex items-center gap-1">
                        <ChevronRight className="h-3.5 w-3.5" />
                        {b.href ? (
                            <Link href={b.href} className="hover:text-foreground">
                                {b.label}
                            </Link>
                        ) : (
                            <span className="text-foreground">{b.label}</span>
                        )}
                    </span>
                ))}
            </nav>
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 sm:flex sm:items-center sm:justify-between">
                <div className="min-w-0">
                    <h1 className="text-foreground truncate text-xl font-semibold tracking-tight sm:text-2xl">
                        {title}
                    </h1>
                    {description && (
                        <p className="text-muted-foreground mt-1 text-sm">
                            {description}
                        </p>
                    )}
                </div>
                {actions && (
                    <div className="flex shrink-0 items-center gap-2">
                        {actions}
                    </div>
                )}
            </div>
        </div>
    );
}
