import { useEffect, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Printer } from 'lucide-react';

// Utilitas cetak struk termal 58mm/80mm: CSS @media print disuntik sekali,
// tombol "Cetak" hanya tampil di layar (disembunyikan saat mencetak).

// Lebar kertas termal yang umum di Indonesia.
type ThermalWidth = '58' | '80';

const WIDTH_PX: Record<ThermalWidth, string> = {
    '58': '58mm',
    '80': '80mm',
};

const STYLE_ID = 'thermal-print-css';

function injectPrintCss(width: ThermalWidth) {
    if (typeof document === 'undefined') return;
    let el = document.getElementById(STYLE_ID);
    if (!el) {
        el = document.createElement('style');
        el.id = STYLE_ID;
        document.head.appendChild(el);
    }
    el.textContent = `
        @media print {
            body * { visibility: hidden; }
            .thermal-print-area, .thermal-print-area * { visibility: visible; }
            .thermal-print-area {
                position: absolute;
                inset: 0;
                width: ${WIDTH_PX[width]};
                max-width: ${WIDTH_PX[width]};
                margin: 0 auto;
                font-family: ui-monospace, monospace;
                font-size: 12px;
                color: #000;
                background: #fff;
            }
            .thermal-print-area .no-print { display: none !important; }
        }
    `;
}

export function PrintArea({ children, width = '80' }: { children: ReactNode; width?: ThermalWidth }) {
    // Suntik CSS cetak sekali saat komponen pertama kali tampil.
    useEffect(() => {
        injectPrintCss(width);
    }, [width]);

    return (
        <div>
            <div className="no-print mb-4 flex justify-end">
                <Button onClick={() => window.print()}>
                    <Printer className="mr-2 h-4 w-4" />
                    Cetak
                </Button>
            </div>
            <div className="thermal-print-area mx-auto rounded-lg border bg-white p-4 font-mono text-[12px] text-black" style={{ maxWidth: WIDTH_PX[width] }}>
                {children}
            </div>
        </div>
    );
}

// Satu baris item pada struk.
export interface ReceiptItem {
    name: string;
    qty: number;
    price: number;
}

const rp = new Intl.NumberFormat('id-ID');

function row(left: string, right: string) {
    return (
        <div className="flex justify-between gap-2">
            <span>{left}</span>
            <span className="tnum shrink-0">{right}</span>
        </div>
    );
}

function Divider() {
    return <div className="my-1 overflow-hidden text-center">{'-'.repeat(32)}</div>;
}

export function ThermalReceipt({
    storeName,
    storeAddress,
    items,
    discount = 0,
    tax = 0,
    paid,
    footerNote,
}: {
    storeName: string;
    storeAddress?: string;
    items: ReceiptItem[];
    discount?: number;
    tax?: number;
    paid?: number;
    footerNote?: string;
}) {
    const subtotal = items.reduce((s, it) => s + it.qty * it.price, 0);
    const total = Math.max(0, subtotal - discount + tax);
    const change = paid !== undefined ? paid - total : undefined;

    return (
        <div>
            <p className="text-center font-bold">{storeName}</p>
            {storeAddress && <p className="text-center">{storeAddress}</p>}
            <Divider />
            {items.map((it, i) => (
                <div key={i} className="mb-1">
                    <p>{it.name}</p>
                    <div className="flex justify-between gap-2">
                        <span className="tnum">
                            {it.qty} x {rp.format(it.price)}
                        </span>
                        <span className="tnum shrink-0">{rp.format(it.qty * it.price)}</span>
                    </div>
                </div>
            ))}
            <Divider />
            {row('Subtotal', `Rp${rp.format(subtotal)}`)}
            {discount > 0 && row('Diskon', `-Rp${rp.format(discount)}`)}
            {tax > 0 && row('Pajak', `Rp${rp.format(tax)}`)}
            <p className="flex justify-between gap-2 font-bold">
                <span>TOTAL</span>
                <span className="tnum shrink-0">Rp{rp.format(total)}</span>
            </p>
            {paid !== undefined && (
                <>
                    {row('Tunai', `Rp${rp.format(paid)}`)}
                    {row('Kembalian', `Rp${rp.format(Math.max(0, change ?? 0))}`)}
                </>
            )}
            <Divider />
            <p className="text-center">{footerNote ?? 'Terima kasih atas kunjungan Anda'}</p>
        </div>
    );
}

export function PrintAreaDemo() {
    return (
        <PrintArea width="80">
            <ThermalReceipt
                storeName="Warung Kopi Sederhana"
                storeAddress="Jl. Asia Afrika No. 8, Bandung"
                items={[
                    { name: 'Kopi Tubruk', qty: 2, price: 12000 },
                    { name: 'Pisang Goreng (4)', qty: 1, price: 15000 },
                    { name: 'Teh Manis Hangat', qty: 1, price: 8000 },
                ]}
                discount={5000}
                tax={4200}
                paid={50000}
                footerNote="WiFi tersedia, tanya ke kasir. Sampai jumpa!"
            />
        </PrintArea>
    );
}
