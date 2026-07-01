import { useState } from 'react';
import { router } from '@inertiajs/react';
import {
    store as storeConceptRoute,
    update as updateConceptRoute,
    destroy as destroyConceptRoute,
} from '@/routes/courses/concepts-roadmap/concepts';
import ConceptModal from './partials/ConceptModal';
import ConceptsRoadmap from './partials/ConceptsRoadmap';
import RoadmapTopBar from './partials/RoadmapTopBar';
import { emptyConceptForm } from './partials/conceptHelpers';

export default function CourseConceptRoadmap({ course }) {
    const concepts = course?.concepts ?? [];
    const [selectedConcept, setSelectedConcept] = useState(null);
    const [isConceptModalOpen, setIsConceptModalOpen] = useState(false);
    const [conceptForm, setConceptForm] = useState(emptyConceptForm);

    const handleAddConcept = () => {
        setConceptForm(emptyConceptForm);
        setSelectedConcept(null);
        setIsConceptModalOpen(true);
    };

    const handleEditConcept = (concept) => {
        setConceptForm({
            title: concept.title ?? '',
            emoji: concept.emoji ?? '',
            description: concept.description ?? '',
            type: concept.type ?? '',
        });
        setSelectedConcept(concept);
        setIsConceptModalOpen(true);
    };

    const handleDeleteConcept = (concept) => {
        if (!window.confirm(`Delete "${concept.title}"?`)) return;
        router.delete(destroyConceptRoute({ course, concept }).url, {
            preserveScroll: true,
            onSuccess: () => setSelectedConcept(null),
        });
    };

    const handleSubmitConcept = (event) => {
        event.preventDefault();
        if (!selectedConcept) {
            router.post(storeConceptRoute(course.id).url, conceptForm, {
                preserveScroll: true,
                onSuccess: () => {
                    setIsConceptModalOpen(false);
                    setConceptForm(emptyConceptForm);
                    setSelectedConcept(null);
                },
            });
        } else {
            router.put(updateConceptRoute({ course, concept: selectedConcept }).url, conceptForm, {
                preserveScroll: true,
                onSuccess: () => {
                    setIsConceptModalOpen(false);
                    setConceptForm(emptyConceptForm);
                    setSelectedConcept(null);
                },
            });
        }
    };

    return (
        <div className="min-h-screen bg-light p-4 dark:bg-dark md:p-6">
            <RoadmapTopBar
                course={course}
                conceptCount={concepts.length}
                onAdd={handleAddConcept}
            />

            <div className="mt-6">
                <ConceptsRoadmap
                    course={course}
                    concepts={concepts}
                    selectedConcept={selectedConcept}
                    onSelectConcept={setSelectedConcept}
                    onAddConcept={handleAddConcept}
                    onEditConcept={handleEditConcept}
                    onDeleteConcept={handleDeleteConcept}
                />
            </div>

            <ConceptModal
                    course={course}

                open={isConceptModalOpen}
                onOpenChange={setIsConceptModalOpen}
                form={conceptForm}
                setForm={setConceptForm}
                onSubmit={handleSubmitConcept}
                isEditing={Boolean(selectedConcept)}
            />
        </div>
    );
}
