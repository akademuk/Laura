import { COURSES } from '@/lib/mock-data';
import CoursePage from './CourseDetailClient';

export function generateStaticParams() {
  return COURSES.map((course) => ({
    slug: course.slug,
  }));
}

export default function Page() {
  return <CoursePage />;
}
