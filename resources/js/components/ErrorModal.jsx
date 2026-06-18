import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import { XCircle } from 'lucide-react';
import { useState } from 'react';

/**
 * Reusable error modal
 *
 * Props:
 * - open: boolean
 * - onOpenChange: (open: boolean) => void
 * - title?: string
 * - description?: string
 * - confirmLabel?: string
 * - onConfirm?: () => Promise<void> | void
 * - loading?: boolean
 * - children?: React.ReactNode
 */
export default function ErrorModal({
    open,
    onOpenChange,
    title = 'Error',
    description = 'Something went wrong. Please try again.',
    confirmLabel = 'OK',
    onConfirm,
    loading: loadingProp = false,
    children,
}) {
    const [internalLoading, setInternalLoading] = useState(false);
    const loading = loadingProp || internalLoading;

    const handleConfirm = async () => {
        if (onConfirm) {
            try {
                const maybePromise = onConfirm();
                if (maybePromise && typeof maybePromise.then === 'function') {
                    setInternalLoading(true);
                    await maybePromise;
                }
            } catch {
                return;
            } finally {
                setInternalLoading(false);
            }
        }

        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-light text-dark sm:max-w-[480px] dark:bg-dark dark:text-light">
                <DialogHeader className="items-center text-center sm:items-center sm:text-center">
                    <span className="mb-1 inline-flex h-12 w-12 items-center justify-center rounded-full bg-error/10 text-error">
                        <XCircle size={28} />
                    </span>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription className="text-dark/70 dark:text-light/70">
                        {description}
                    </DialogDescription>
                </DialogHeader>

                {children}

                <DialogFooter className="mt-2 sm:justify-center">
                    <Button
                        className="min-w-[120px] bg-error text-light hover:bg-error/90 disabled:opacity-70"
                        onClick={handleConfirm}
                        disabled={loading}
                    >
                        {loading ? <Spinner /> : confirmLabel}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
