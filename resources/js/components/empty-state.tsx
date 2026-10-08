import { Inbox } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';

export interface EmptyStateAction {
    label: string;
    href?: string;
    onClick?: () => void;
}

export interface EmptyStateProps {
    icon?: ReactNode;
    title: string;
    description?: string;
    action?: EmptyStateAction;
    className?: string;
}

/**
 * Empty state spesifik konteks: judul jelas + 1 kalimat "data apa yang akan
 * muncul di sini" + CTA langkah berikutnya. Jangan pakai untuk placeholder
 * generik, tiap pemakaian harus menjelaskan konteksnya sendiri.
 */
export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
    return (
        <div
            className={`flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed px-6 py-12 text-center ${className ?? ''}`}
        >
            <div className="text-muted-foreground">{icon ?? <Inbox className="h-8 w-8" />}</div>
            <p className="text-sm font-medium">{title}</p>
            {description && <p className="max-w-sm text-sm text-muted-foreground">{description}</p>}
            {action &&
                (action.href ? (
                    <Button asChild size="sm" className="mt-2">
                        <Link href={action.href}>{action.label}</Link>
                    </Button>
                ) : (
                    <Button size="sm" className="mt-2" onClick={action.onClick}>
                        {action.label}
                    </Button>
                ))}
        </div>
    );
}
