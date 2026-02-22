import { COURSES, LESSONS } from '@/lib/mock-data';
import LessonPage from './LessonPlayerClient';

export function generateStaticParams() {
  const params: { slug: string; lessonId: string }[] = [];

  for (const course of COURSES) {
    for (const lesson of LESSONS.filter((l) => l.course_id === course.id)) {
      params.push({
        slug: course.slug,
        lessonId: lesson.id,
      });
    }
  }

  return params;
}

export default function Page() {
  return <LessonPage />;
}
