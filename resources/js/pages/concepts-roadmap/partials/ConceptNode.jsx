import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ConceptNode({
    concept,
    position,
    selected,
    onSelect,
    onEdit,
    onDelete,
}) {
    return (
        <div
            className="group absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: position.x, top: position.y }}
        >
            {/* Edit / Delete — visible on hover, sit above the circle */}
            <div className="absolute -top-10 left-1/2 flex -translate-x-1/2 items-center gap-1 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                <Button
                    type="button"
                    size="icon"
                    variant="secondary"
                    className="size-7 rounded-full bg-background/85 shadow-md backdrop-blur hover:bg-alpha hover:text-black"
                    onClick={(e) => { e.stopPropagation(); onEdit(); }}
                    aria-label="Edit concept"
                >
                    <Pencil className="size-3" />
                </Button>
                <Button
                    type="button"
                    size="icon"
                    variant="secondary"
                    className="size-7 rounded-full bg-background/85 shadow-md backdrop-blur hover:bg-error hover:text-white"
                    onClick={(e) => { e.stopPropagation(); onDelete(); }}
                    aria-label="Delete concept"
                >
                    <Trash2 className="size-3" />
                </Button>
            </div>

            {/* Circle */}
            <button
                type="button"
                onClick={onSelect}
                className={`flex size-[66px] cursor-pointer items-center justify-center rounded-full border-2 bg-card text-2xl shadow-md transition-all duration-200 hover:border-alpha/60 hover:shadow-lg ${
                    selected
                        ? 'border-alpha ring-4 ring-alpha/20'
                        : 'border-border'
                }`}
                aria-label={concept.title}
            >
                <span aria-hidden="true">{concept.emoji || '📚'}</span>
            </button>

            {/* Title */}
            <p className="mt-2 max-w-[100px] text-center text-xs font-medium leading-tight text-foreground">
                {concept.title}
            </p>
        </div>
    );
}
