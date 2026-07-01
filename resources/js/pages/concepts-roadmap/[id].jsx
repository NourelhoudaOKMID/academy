import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import CourseConceptRoadmap from './index';

export default function CourseConceptRoadmapPage({ course }) {
    return (
        <AppLayout>
            <Head title="Concepts Roadmap" />
            <CourseConceptRoadmap course={course} />
        </AppLayout>
    );
}
