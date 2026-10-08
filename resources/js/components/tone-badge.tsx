// Badge status berbasis "tone" dari backend.
// Kontrak DemoData: status/stage = { label, tone }, tone ∈
// 'success' | 'warning' | 'destructive' | 'info'. Tanpa HTML.
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type Tone = 'success' | 'warning' | 'destructive' | 'info';

export interface ToneLabel {
    label: string;
    tone: Tone;
}

const toneClass: Record<Tone, string> = {
    success: 'bg-success/15 text-success border border-success/30',
    warning: 'bg-warning/20 text-warning-foreground border border-warning/40',
    destructive: 'bg-destructive/15 text-destructive border border-destructive/30',
    info: 'bg-info/15 text-info border border-info/30',
};

export function toneClassOf(tone: Tone): string {
    return toneClass[tone] ?? 'bg-muted text-muted-foreground';
}

export function ToneBadge({ label, tone }: ToneLabel) {
    return <Badge className={cn('border-0', toneClassOf(tone))}>{label}</Badge>;
}
