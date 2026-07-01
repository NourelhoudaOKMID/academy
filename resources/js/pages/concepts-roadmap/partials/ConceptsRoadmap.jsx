import { CANVAS_WIDTH, getCanvasHeight, getNodePosition } from './conceptHelpers';
import AddConceptButton from './AddConceptButton';
import ConceptNode from './ConceptNode';
import ConceptPath from './ConceptPath';
import EmptyConcepts from './EmptyConcepts';
import RoadmapBackground from './RoadmapBackground';

export default function ConceptsRoadmap({
    concepts,
    selectedConcept,
    onSelectConcept,
    onAddConcept,
    onEditConcept,
    onDeleteConcept,
}) {
    if (concepts.length === 0) {
        return <EmptyConcepts onAdd={onAddConcept} />;
    }

    const canvasHeight = getCanvasHeight(concepts.length);

    return (
        <div
            className="relative mx-auto overflow-hidden rounded-lg border border-border bg-card"
            style={{ width: CANVAS_WIDTH, height: canvasHeight }}
        >
            <RoadmapBackground />

            {/* SVG layer — paths connecting consecutive nodes */}
            <svg
                className="absolute inset-0 h-full w-full text-muted-foreground/40"
                aria-hidden="true"
            >
                {concepts.map((concept, index) => {
                    if (index === 0) return null;
                    return (
                        <ConceptPath
                            key={concept.id}
                            from={getNodePosition(index - 1)}
                            to={getNodePosition(index)}
                        />
                    );
                })}
                <ConceptPath
                    from={getNodePosition(concepts.length - 1)}
                    to={getNodePosition(concepts.length)}
                />
            </svg>

            {/* Concept nodes */}
            {concepts.map((concept, index) => (
                <ConceptNode
                    key={concept.id}
                    concept={concept}
                    position={getNodePosition(index)}
                    selected={selectedConcept?.id === concept.id}
                    onSelect={() => onSelectConcept(concept)}
                    onEdit={() => onEditConcept(concept)}
                    onDelete={() => onDeleteConcept(concept)}
                />
            ))}

            {/* Add button positioned after the last concept */}
            <AddConceptButton
                position={getNodePosition(concepts.length)}
                onAdd={onAddConcept}
            />
        </div>
    );
}
