import { Plus } from 'lucide-react';
import { TransText } from '@/components/TransText';

export default function EmptyConcepts({ onAdd }) {
    return (
        <button
            type="button"
            className="group flex min-h-96 w-full flex-col items-center justify-center px-6 text-center transition-colors hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-alpha/50"
            onClick={onAdd}
        >
            <div className="mb-4 flex size-16 items-center justify-center rounded-full border-2 border-dashed border-alpha/40 bg-alpha/10 text-alpha transition-colors group-hover:border-alpha group-hover:bg-alpha group-hover:text-black">
                <Plus className="size-7" />
            </div>
            <h3 className="text-base font-semibold text-foreground">
                <TransText
                    en="Start building your concepts roadmap"
                    fr="Start building your concepts roadmap"
                    ar="Start building your concepts roadmap"
                />
            </h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                <TransText
                    en="Add your first concept to begin structuring the course journey."
                    fr="Add your first concept to begin structuring the course journey."
                    ar="Add your first concept to begin structuring the course journey."
                />
            </p>
        </button>
    );
}
