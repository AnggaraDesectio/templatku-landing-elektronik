// Error boundary: menangkap error render di subtree React dan menampilkan
// UI fallback berbahasa Indonesia. Dipasang di app.tsx mengelilingi <App />.
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { Component, type ReactNode } from 'react';

interface ErrorBoundaryProps {
    children: ReactNode;
    /** Dipanggil saat pengguna menekan "Coba lagi" (setelah state direset). */
    onReset?: () => void;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    state: ErrorBoundaryState = { hasError: false };

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        // Catat untuk diagnostik; di app nyata kirim ke layanan logging.
        console.error('ErrorBoundary menangkap error:', error, info.componentStack);
    }

    private handleReset = () => {
        this.setState({ hasError: false, error: undefined });
        this.props.onReset?.();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex min-h-[240px] items-center justify-center p-4">
                    <Card className="w-full max-w-md shadow-sm">
                        <CardHeader className="items-center text-center">
                            <div className="bg-destructive/10 text-destructive mb-2 rounded-full p-3">
                                <AlertTriangle className="h-6 w-6" />
                            </div>
                            <CardTitle className="text-base">
                                Terjadi kesalahan
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-center">
                            <p className="text-muted-foreground text-sm">
                                Maaf, ada yang tidak beres saat memuat bagian
                                ini. Silakan coba lagi.
                            </p>
                            {this.state.error?.message && (
                                <p className="bg-muted rounded-md px-3 py-2 font-mono text-xs break-all">
                                    {this.state.error.message}
                                </p>
                            )}
                            <Button onClick={this.handleReset} className="gap-2">
                                <RotateCcw className="h-4 w-4" />
                                Coba lagi
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            );
        }
        return this.props.children;
    }
}
