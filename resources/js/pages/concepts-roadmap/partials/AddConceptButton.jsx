import { Plus } from 'lucide-react';

export default function AddConceptButton({ position, onAdd }) {
    return (
        <div
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: position.x, top: position.y }}
        >
            <button
                type="button"
                onClick={onAdd}
                aria-label="Add concept"
                className="flex size-[66px] cursor-pointer items-center justify-center rounded-full border-2 border-dashed border-alpha/50 bg-alpha/5 text-alpha shadow-sm transition-all duration-200 hover:border-alpha hover:bg-alpha/15 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-alpha/50"
            >
                <Plus className="size-5" />
            </button>
        </div>
    );
}
