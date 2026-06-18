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
import { AlertTriangle } from 'lucide-react';
import { useState } from 'react';

/**
 * Reusable warning modal
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
export default function WarningModal({
    open,
    onOpenChange,
    title = 'Warning',
    description = 'Please review this information before continuing.',
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
                    <span className="mb-1 inline-flex h-12 w-12 items-center justify-center rounded-full bg-alpha/10 text-alpha">
                        <AlertTriangle size={28} />
                    </span>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription className="text-dark/70 dark:text-light/70">
                        {description}
                    </DialogDescription>
                </DialogHeader>

                {children}

                <DialogFooter className="mt-2 sm:justify-center">
                    <Button
                        className="bg-alpha min-w-[120px] hover:bg-alpha/90 disabled:opacity-70"
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
