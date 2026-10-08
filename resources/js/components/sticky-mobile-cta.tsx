import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MessageCircle, Phone, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

// Bilah aksi lengket di bawah layar khusus mobile (disembunyikan di md+).
// Aman untuk notch/home-indicator via safe-area-inset-bottom.

type CtaVariant = 'whatsapp' | 'cart' | 'call';

const VARIANT_STYLE: Record<CtaVariant, { bar: string; button: string; icon: typeof MessageCircle }> = {
    whatsapp: {
        bar: 'border-green-500/20',
        button: 'bg-[#25D366] text-white hover:bg-[#1fb857]',
        icon: MessageCircle,
    },
    cart: {
        bar: 'border-border',
        button: '',
        icon: ShoppingCart,
    },
    call: {
        bar: 'border-blue-500/20',
        button: 'bg-blue-600 text-white hover:bg-blue-700',
        icon: Phone,
    },
};

export function StickyMobileCta({
    variant,
    title,
    subtitle,
    actionLabel,
    onAction,
    price,
}: {
    variant: CtaVariant;
    title: string;
    subtitle?: string;
    actionLabel: string;
    onAction?: () => void;
    price?: string;
}) {
    const style = VARIANT_STYLE[variant];
    const Icon = style.icon;

    return (
        <div
            className="fixed inset-x-0 bottom-0 z-40 md:hidden"
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
            <div className={cn('border-t bg-background/85 backdrop-blur-md', style.bar)}>
                <div className="flex items-center gap-3 px-4 py-3">
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">{title}</p>
                        {subtitle && <p className="truncate text-xs text-muted-foreground">{subtitle}</p>}
                        {price && (
                            <p className="tnum text-sm font-bold text-primary">{price}</p>
                        )}
                    </div>
                    <Button size="lg" className={cn('shrink-0 gap-2', style.button)} onClick={onAction}>
                        <Icon className="h-4 w-4" />
                        {actionLabel}
                    </Button>
                </div>
            </div>
        </div>
    );
}

export function StickyMobileCtaDemo() {
    // Demo: contoh varian keranjang; di galeri hanya tampil pratinjaunya.
    return (
        <div className="relative h-24 overflow-hidden rounded-lg border bg-muted/40">
            <div className="absolute inset-x-0 bottom-0 md:hidden">
                <div className="border-t bg-background/85 backdrop-blur-md">
                    <div className="flex items-center gap-3 px-4 py-3">
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold">Kopi Robusta Gayo 250g</p>
                            <p className="truncate text-xs text-muted-foreground">Toko Kopi Nusantara · Bandung</p>
                            <p className="tnum text-sm font-bold text-primary">Rp 68.000</p>
                        </div>
                        <Button
                            size="lg"
                            className="shrink-0 gap-2"
                            // Pratinjau galeri: tombol memberi umpan balik,
                            // bukan diam.
                            onClick={() =>
                                toast.info(
                                    'Ini hanya pratinjau galeri komponen.',
                                )
                            }
                        >
                            <ShoppingCart className="h-4 w-4" />
                            Keranjang
                        </Button>
                    </div>
                </div>
            </div>
            <p className="p-3 text-xs text-muted-foreground">
                Pratinjau bilah bawah (hanya tampil di layar &lt; md)
            </p>
        </div>
    );
}
