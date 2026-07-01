import { router } from '@inertiajs/react';
import { ArrowLeft, Layers3, Plus } from 'lucide-react';
import { TransText } from '@/components/TransText';
import { Button } from '@/components/ui/button';
import { index as coursesIndex } from '@/routes/courses';

export default function RoadmapTopBar({ course, conceptCount, onAdd }) {
    return (
        <div className="relative overflow-hidden rounded-lg border border-border bg-card shadow-xs">
            <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,var(--color-alpha),transparent_72%)]" />
            <div className="flex items-center justify-between gap-4 p-4">
                <div className="flex items-center gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => router.visit(coursesIndex().url)}
                        aria-label="Back to courses"
                    >
                        <ArrowLeft className="size-4" />
                    </Button>
                    <div className="flex items-center gap-2">
                        <span className="text-xl" aria-hidden="true">
                            {course?.emoji || '📚'}
                        </span>
                        <h1 className="text-lg font-semibold text-foreground">
                            {course?.title}
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1.5 text-xs font-medium text-muted-foreground">
                        <Layers3 className="size-4 text-alpha" />
                        {conceptCount ?? 0}{' '}
                        <TransText en="concepts" fr="concepts" ar="concepts" />
                    </span>
                    <Button
                        type="button"
                        className="bg-alpha"
                        onClick={onAdd}
                    >
                        <Plus />
                        <TransText
                            en="Add Concept"
                            fr="Add Concept"
                            ar="Add Concept"
                        />
                    </Button>
                </div>
            </div>
        </div>
    );
}
