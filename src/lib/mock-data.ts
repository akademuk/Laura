/**
 * ============================================================================
 * LAURA LMS — Mock Data
 * ============================================================================
 * Realistic seed data for local development and UI prototyping.
 * Mirrors the production Supabase schema exactly.
 * ============================================================================
 */

import {
  type User,
  type Course,
  type Module,
  type Lesson,
  type Attachment,
  type Enrollment,
  type CourseProgress,
  type LessonProgress,
  type HomeworkSubmission,
  type HomeworkReview,
  type CourseCard,
  type CourseWithModules,
  type LessonFull,
  type HomeworkFeedItem,
  type AdminStudentRow,
  UserRole,
  PublishStatus,
  EnrollmentStatus,
  LessonStatus,
  HomeworkStatus,
} from '@/types/lms';

// ─── Users ──────────────────────────────────────────────────────────────────

export const USERS: User[] = [
  {
    id: 'usr-laura-001',
    email: 'laura@laura-courses.com',
    full_name: 'Лаура Александровська',
    avatar_url: null,
    role: UserRole.Admin,
    created_at: '2025-01-15T10:00:00Z',
    updated_at: '2026-02-20T08:00:00Z',
    last_login_at: '2026-02-20T08:00:00Z',
  },
  {
    id: 'usr-student-001',
    email: 'ivan@example.com',
    full_name: 'Іван Петренко',
    avatar_url: null,
    role: UserRole.Student,
    created_at: '2025-06-10T14:30:00Z',
    updated_at: '2026-02-19T16:45:00Z',
    last_login_at: '2026-02-19T16:45:00Z',
  },
  {
    id: 'usr-student-002',
    email: 'olena@example.com',
    full_name: 'Олена Коваленко',
    avatar_url: null,
    role: UserRole.Student,
    created_at: '2025-08-22T09:15:00Z',
    updated_at: '2026-02-18T11:20:00Z',
    last_login_at: '2026-02-18T11:20:00Z',
  },
  {
    id: 'usr-student-003',
    email: 'dmytro@example.com',
    full_name: 'Дмитро Шевченко',
    avatar_url: null,
    role: UserRole.Student,
    created_at: '2025-09-05T12:00:00Z',
    updated_at: '2026-02-17T14:30:00Z',
    last_login_at: '2026-02-17T14:30:00Z',
  },
  {
    id: 'usr-curator-001',
    email: 'maria@laura-courses.com',
    full_name: 'Марія Бондаренко',
    avatar_url: null,
    role: UserRole.Curator,
    created_at: '2025-04-01T08:00:00Z',
    updated_at: '2026-02-20T07:30:00Z',
    last_login_at: '2026-02-20T07:30:00Z',
  },
];

// ─── Courses ────────────────────────────────────────────────────────────────

export const COURSES: Course[] = [
  {
    id: 'crs-001',
    title: 'Архітектура Відділу Продажів',
    slug: 'sales-architecture',
    description:
      'Побудова команди, яка робить X2. Від групового найму та онбордингу до впровадження скриптів та «Книги продажів» як основи масштабування.',
    short_description: 'Побудова відділу продажів з нуля до масштабування.',
    cover_url: null,
    status: PublishStatus.Published,
    author_id: 'usr-laura-001',
    module_order: ['mod-001', 'mod-002', 'mod-003'],
    total_lessons: 12,
    estimated_duration_min: 480,
    created_at: '2025-03-01T10:00:00Z',
    updated_at: '2026-01-15T12:00:00Z',
  },
  {
    id: 'crs-002',
    title: 'Системоутворюючий Маркетинг',
    slug: 'systematic-marketing',
    description:
      'Перетворення хаосу в трафіку на прогнозовану систему лідогенерації. Розробка архітектури лендингів, налаштування CRM-логіки та мультиканальних воронок.',
    short_description: 'Прогнозована система лідогенерації та воронок.',
    cover_url: null,
    status: PublishStatus.Published,
    author_id: 'usr-laura-001',
    module_order: ['mod-004', 'mod-005', 'mod-006'],
    total_lessons: 15,
    estimated_duration_min: 600,
    created_at: '2025-05-10T10:00:00Z',
    updated_at: '2026-02-01T09:00:00Z',
  },
  {
    id: 'crs-003',
    title: 'Стратегічне Управління Бізнесом',
    slug: 'strategic-management',
    description:
      'Операційний менеджмент без вигорання. Вибудова міждепартаментної взаємодії, управління підрядниками та масштабування на рівні стратегічних партнерств.',
    short_description: 'Операційний менеджмент та стратегічне масштабування.',
    cover_url: null,
    status: PublishStatus.Draft,
    author_id: 'usr-laura-001',
    module_order: ['mod-007', 'mod-008'],
    total_lessons: 10,
    estimated_duration_min: 400,
    created_at: '2026-01-20T10:00:00Z',
    updated_at: '2026-02-18T15:00:00Z',
  },
];

// ─── Modules ────────────────────────────────────────────────────────────────

export const MODULES: Module[] = [
  // Course 1: Sales Architecture
  {
    id: 'mod-001',
    course_id: 'crs-001',
    title: 'Фундамент відділу продажів',
    description: 'Структура, ролі та KPI для побудови ефективного відділу.',
    sort_order: 0,
    lesson_order: ['les-001', 'les-002', 'les-003', 'les-004'],
    status: PublishStatus.Published,
    created_at: '2025-03-01T10:00:00Z',
    updated_at: '2025-12-01T10:00:00Z',
  },
  {
    id: 'mod-002',
    course_id: 'crs-001',
    title: 'Груповий найм та онбординг',
    description: 'Як знайти та інтегрувати в команду 500+ кандидатів.',
    sort_order: 1,
    lesson_order: ['les-005', 'les-006', 'les-007', 'les-008'],
    status: PublishStatus.Published,
    created_at: '2025-03-15T10:00:00Z',
    updated_at: '2025-12-15T10:00:00Z',
  },
  {
    id: 'mod-003',
    course_id: 'crs-001',
    title: 'Книга продажів та скрипти',
    description: 'Створення 86-сторінкової книги продажів для масштабування.',
    sort_order: 2,
    lesson_order: ['les-009', 'les-010', 'les-011', 'les-012'],
    status: PublishStatus.Published,
    created_at: '2025-04-01T10:00:00Z',
    updated_at: '2026-01-10T10:00:00Z',
  },
  // Course 2: Systematic Marketing
  {
    id: 'mod-004',
    course_id: 'crs-002',
    title: 'Архітектура лідогенерації',
    description: 'Побудова системи, яка генерує ліди прогнозовано.',
    sort_order: 0,
    lesson_order: ['les-013', 'les-014', 'les-015', 'les-016', 'les-017'],
    status: PublishStatus.Published,
    created_at: '2025-05-10T10:00:00Z',
    updated_at: '2025-11-20T10:00:00Z',
  },
  {
    id: 'mod-005',
    course_id: 'crs-002',
    title: 'CRM-логіка та воронки',
    description: 'Налаштування мультиканальних воронок та CRM-систем.',
    sort_order: 1,
    lesson_order: ['les-018', 'les-019', 'les-020', 'les-021', 'les-022'],
    status: PublishStatus.Published,
    created_at: '2025-06-01T10:00:00Z',
    updated_at: '2025-12-05T10:00:00Z',
  },
  {
    id: 'mod-006',
    course_id: 'crs-002',
    title: 'Аналітика та оптимізація',
    description: 'Трекінг, A/B тестування та масштабування каналів.',
    sort_order: 2,
    lesson_order: ['les-023', 'les-024', 'les-025', 'les-026', 'les-027'],
    status: PublishStatus.Published,
    created_at: '2025-07-01T10:00:00Z',
    updated_at: '2026-01-20T10:00:00Z',
  },
  // Course 3: Strategic Management
  {
    id: 'mod-007',
    course_id: 'crs-003',
    title: 'Операційна система бізнесу',
    description: 'Міждепартаментна взаємодія та процеси без хаосу.',
    sort_order: 0,
    lesson_order: ['les-028', 'les-029', 'les-030', 'les-031', 'les-032'],
    status: PublishStatus.Draft,
    created_at: '2026-01-20T10:00:00Z',
    updated_at: '2026-02-10T10:00:00Z',
  },
  {
    id: 'mod-008',
    course_id: 'crs-003',
    title: 'Стратегічні партнерства',
    description: 'Масштабування через партнерства рівня OKKO та Fishka.',
    sort_order: 1,
    lesson_order: ['les-033', 'les-034', 'les-035', 'les-036', 'les-037'],
    status: PublishStatus.Draft,
    created_at: '2026-02-01T10:00:00Z',
    updated_at: '2026-02-18T10:00:00Z',
  },
];

// ─── Lessons (Course 1, Module 1 — detailed) ────────────────────────────────

export const LESSONS: Lesson[] = [
  {
    id: 'les-001',
    module_id: 'mod-001',
    course_id: 'crs-001',
    title: 'Чому 90% відділів продажів не працюють',
    slug: 'why-sales-fail',
    sort_order: 0,
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    video_provider: 'youtube',
    video_duration_sec: 1260,
    content_html:
      '<h2>Основні причини невдач</h2><p>У цьому уроці ми розглянемо системні помилки, які допускають 90% керівників при побудові відділів продажів. Від відсутності структури до хаотичного найму — кожна помилка коштує бізнесу тисячі доларів.</p><h3>Ключові тези:</h3><ul><li>Відсутність чіткої оргструктури</li><li>Найм без системи оцінки</li><li>Немає книги продажів та скриптів</li><li>KPI не прив\'язані до бізнес-цілей</li></ul>',
    has_homework: true,
    homework_task:
      'Проаналізуйте свій поточний відділ продажів (або відділ компанії, яку ви знаєте). Опишіть 3 головні проблеми та запропонуйте рішення для кожної. Формат: текст або посилання на Google Doc.',
    attachments: [],
    status: PublishStatus.Published,
    created_at: '2025-03-01T10:00:00Z',
    updated_at: '2025-12-01T10:00:00Z',
  },
  {
    id: 'les-002',
    module_id: 'mod-001',
    course_id: 'crs-001',
    title: 'Оргструктура ідеального відділу',
    slug: 'ideal-org-structure',
    sort_order: 1,
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    video_provider: 'youtube',
    video_duration_sec: 1800,
    content_html:
      '<h2>Побудова оргструктури</h2><p>Розглянемо різні моделі оргструктур: від плоских команд до ієрархічних відділів. Як обрати правильну модель для вашого бізнесу та етапу розвитку.</p>',
    has_homework: false,
    homework_task: null,
    attachments: [],
    status: PublishStatus.Published,
    created_at: '2025-03-05T10:00:00Z',
    updated_at: '2025-12-05T10:00:00Z',
  },
  {
    id: 'les-003',
    module_id: 'mod-001',
    course_id: 'crs-001',
    title: 'KPI та система мотивації',
    slug: 'kpi-motivation',
    sort_order: 2,
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    video_provider: 'youtube',
    video_duration_sec: 2100,
    content_html:
      '<h2>Система KPI</h2><p>Як створити систему KPI, яка мотивує, а не демотивує. Реальні приклади з Boss Auto та інших проєктів Лаури.</p>',
    has_homework: true,
    homework_task:
      'Розробіть систему KPI для відділу продажів з 5 менеджерів. Включіть: основні метрики, систему бонусів, та dashboard для відстеження.',
    attachments: [],
    status: PublishStatus.Published,
    created_at: '2025-03-10T10:00:00Z',
    updated_at: '2025-12-10T10:00:00Z',
  },
  {
    id: 'les-004',
    module_id: 'mod-001',
    course_id: 'crs-001',
    title: 'Бюджетування відділу продажів',
    slug: 'sales-budgeting',
    sort_order: 3,
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    video_provider: 'youtube',
    video_duration_sec: 1500,
    content_html:
      '<h2>Бюджет відділу</h2><p>Як розрахувати бюджет на відділ продажів, включаючи ФОП, інструменти, навчання та рекламу.</p>',
    has_homework: false,
    homework_task: null,
    attachments: [],
    status: PublishStatus.Published,
    created_at: '2025-03-15T10:00:00Z',
    updated_at: '2025-12-15T10:00:00Z',
  },
];

// ─── Attachments ────────────────────────────────────────────────────────────

export const ATTACHMENTS: Attachment[] = [
  {
    id: 'att-001',
    lesson_id: 'les-001',
    title: 'Чек-лист: Аудит відділу продажів',
    file_url: '/files/sales-audit-checklist.pdf',
    file_type: 'pdf',
    file_size_bytes: 245_000,
    sort_order: 0,
    created_at: '2025-03-01T10:00:00Z',
  },
  {
    id: 'att-002',
    lesson_id: 'les-001',
    title: 'Шаблон оргструктури (Excel)',
    file_url: '/files/org-structure-template.xlsx',
    file_type: 'xlsx',
    file_size_bytes: 128_000,
    sort_order: 1,
    created_at: '2025-03-01T10:00:00Z',
  },
  {
    id: 'att-003',
    lesson_id: 'les-003',
    title: 'KPI Dashboard Template',
    file_url: '/files/kpi-dashboard.xlsx',
    file_type: 'xlsx',
    file_size_bytes: 312_000,
    sort_order: 0,
    created_at: '2025-03-10T10:00:00Z',
  },
];

// ─── Enrollments ────────────────────────────────────────────────────────────

export const ENROLLMENTS: Enrollment[] = [
  {
    id: 'enr-001',
    user_id: 'usr-student-001',
    course_id: 'crs-001',
    status: EnrollmentStatus.Active,
    enrolled_at: '2025-07-01T10:00:00Z',
    last_accessed_at: '2026-02-19T16:45:00Z',
  },
  {
    id: 'enr-002',
    user_id: 'usr-student-001',
    course_id: 'crs-002',
    status: EnrollmentStatus.Active,
    enrolled_at: '2025-09-15T10:00:00Z',
    last_accessed_at: '2026-02-18T14:20:00Z',
  },
  {
    id: 'enr-003',
    user_id: 'usr-student-002',
    course_id: 'crs-001',
    status: EnrollmentStatus.Active,
    enrolled_at: '2025-09-01T10:00:00Z',
    last_accessed_at: '2026-02-17T09:30:00Z',
  },
  {
    id: 'enr-004',
    user_id: 'usr-student-003',
    course_id: 'crs-002',
    status: EnrollmentStatus.Paused,
    enrolled_at: '2025-10-10T10:00:00Z',
    last_accessed_at: '2026-01-05T11:00:00Z',
  },
];

// ─── Course Progress ────────────────────────────────────────────────────────

export const COURSE_PROGRESS: CourseProgress[] = [
  {
    enrollment_id: 'enr-001',
    user_id: 'usr-student-001',
    course_id: 'crs-001',
    completed_lessons: 5,
    total_lessons: 12,
    percentage: 42,
    last_lesson_id: 'les-003',
    updated_at: '2026-02-19T16:45:00Z',
  },
  {
    enrollment_id: 'enr-002',
    user_id: 'usr-student-001',
    course_id: 'crs-002',
    completed_lessons: 3,
    total_lessons: 15,
    percentage: 20,
    last_lesson_id: 'les-015',
    updated_at: '2026-02-18T14:20:00Z',
  },
  {
    enrollment_id: 'enr-003',
    user_id: 'usr-student-002',
    course_id: 'crs-001',
    completed_lessons: 10,
    total_lessons: 12,
    percentage: 83,
    last_lesson_id: 'les-011',
    updated_at: '2026-02-17T09:30:00Z',
  },
  {
    enrollment_id: 'enr-004',
    user_id: 'usr-student-003',
    course_id: 'crs-002',
    completed_lessons: 1,
    total_lessons: 15,
    percentage: 7,
    last_lesson_id: 'les-013',
    updated_at: '2026-01-05T11:00:00Z',
  },
];

// ─── Lesson Progress ────────────────────────────────────────────────────────

export const LESSON_PROGRESS: LessonProgress[] = [
  {
    id: 'lp-001',
    user_id: 'usr-student-001',
    lesson_id: 'les-001',
    course_id: 'crs-001',
    status: LessonStatus.Completed,
    video_position_sec: 1260,
    video_completed: true,
    started_at: '2025-07-02T10:00:00Z',
    completed_at: '2025-07-02T11:30:00Z',
  },
  {
    id: 'lp-002',
    user_id: 'usr-student-001',
    lesson_id: 'les-002',
    course_id: 'crs-001',
    status: LessonStatus.Completed,
    video_position_sec: 1800,
    video_completed: true,
    started_at: '2025-07-05T14:00:00Z',
    completed_at: '2025-07-05T15:00:00Z',
  },
  {
    id: 'lp-003',
    user_id: 'usr-student-001',
    lesson_id: 'les-003',
    course_id: 'crs-001',
    status: LessonStatus.InProgress,
    video_position_sec: 840,
    video_completed: false,
    started_at: '2026-02-19T16:00:00Z',
    completed_at: null,
  },
];

// ─── Homework Submissions ───────────────────────────────────────────────────

export const HOMEWORK_SUBMISSIONS: HomeworkSubmission[] = [
  {
    id: 'hw-sub-001',
    user_id: 'usr-student-001',
    lesson_id: 'les-001',
    course_id: 'crs-001',
    content:
      'Аналіз відділу продажів компанії X:\n\n1. Проблема: відсутність CRM — рішення: впровадити Pipedrive.\n2. Проблема: немає скриптів — рішення: створити книгу продажів.\n3. Проблема: хаотичний найм — рішення: груповий найм за методологією Лаури.',
    attachment_url: 'https://docs.google.com/document/d/example',
    status: HomeworkStatus.Approved,
    submitted_at: '2025-07-03T09:00:00Z',
    updated_at: '2025-07-04T14:00:00Z',
  },
  {
    id: 'hw-sub-002',
    user_id: 'usr-student-002',
    lesson_id: 'les-001',
    course_id: 'crs-001',
    content:
      'Провела аудит свого відділу продажів. Основні проблеми: низька конверсія з ліда в угоду, відсутність системи onboarding для нових менеджерів, немає регулярних планерок.',
    attachment_url: null,
    status: HomeworkStatus.Pending,
    submitted_at: '2026-02-16T11:30:00Z',
    updated_at: '2026-02-16T11:30:00Z',
  },
  {
    id: 'hw-sub-003',
    user_id: 'usr-student-001',
    lesson_id: 'les-003',
    course_id: 'crs-001',
    content:
      'Система KPI для відділу з 5 менеджерів: 1) Кількість дзвінків/день, 2) Конверсія в зустріч, 3) Середній чек, 4) LTV клієнта, 5) NPS.',
    attachment_url: null,
    status: HomeworkStatus.Rejected,
    submitted_at: '2026-02-19T17:00:00Z',
    updated_at: '2026-02-20T09:00:00Z',
  },
];

// ─── Homework Reviews ───────────────────────────────────────────────────────

export const HOMEWORK_REVIEWS: HomeworkReview[] = [
  {
    id: 'hw-rev-001',
    submission_id: 'hw-sub-001',
    reviewer_id: 'usr-curator-001',
    reviewer: {
      id: 'usr-curator-001',
      full_name: 'Марія Бондаренко',
      avatar_url: null,
      role: UserRole.Curator,
    },
    comment:
      'Чудова робота! Дуже структурований аналіз. Рекомендую також додати метрики для оцінки ефективності кожного рішення.',
    status: HomeworkStatus.Approved,
    created_at: '2025-07-04T14:00:00Z',
  },
  {
    id: 'hw-rev-002',
    submission_id: 'hw-sub-003',
    reviewer_id: 'usr-curator-001',
    reviewer: {
      id: 'usr-curator-001',
      full_name: 'Марія Бондаренко',
      avatar_url: null,
      role: UserRole.Curator,
    },
    comment:
      'Добрий початок, але потрібно деталізувати: додайте конкретні цільові значення для кожного KPI, систему бонусів (% від перевиконання), та опишіть dashboard для відстеження.',
    status: HomeworkStatus.Rejected,
    created_at: '2026-02-20T09:00:00Z',
  },
];

// ─── Composed Mock Objects (for direct UI consumption) ──────────────────────

/** Student dashboard course cards with progress */
export const MOCK_COURSE_CARDS: CourseCard[] = COURSES.filter(
  (c) => c.status === PublishStatus.Published
).map((course) => {
  const progress = COURSE_PROGRESS.find(
    (p) => p.course_id === course.id && p.user_id === 'usr-student-001'
  );
  return {
    ...course,
    progress: progress ?? {
      enrollment_id: '',
      user_id: 'usr-student-001',
      course_id: course.id,
      completed_lessons: 0,
      total_lessons: course.total_lessons,
      percentage: 0,
      last_lesson_id: null,
      updated_at: new Date().toISOString(),
    },
  };
});

/** Course 1 with full module/lesson tree */
export const MOCK_COURSE_WITH_MODULES: CourseWithModules = {
  ...COURSES[0],
  modules: MODULES.filter((m) => m.course_id === 'crs-001')
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((mod) => ({
      ...mod,
      lessons: LESSONS.filter((l) => l.module_id === mod.id)
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((l) => {
          const lp = LESSON_PROGRESS.find(
            (p) => p.lesson_id === l.id && p.user_id === 'usr-student-001'
          );
          const hw = HOMEWORK_SUBMISSIONS.find(
            (s) => s.lesson_id === l.id && s.user_id === 'usr-student-001'
          );
          return {
            id: l.id,
            title: l.title,
            sort_order: l.sort_order,
            video_duration_sec: l.video_duration_sec,
            has_homework: l.has_homework,
            status: l.status,
            user_status: lp?.status ?? LessonStatus.Available,
            homework_status: hw?.status ?? HomeworkStatus.NotSubmitted,
          };
        }),
    })),
};

/** Full lesson data for the player view */
export const MOCK_LESSON_FULL: LessonFull = {
  ...LESSONS[0],
  attachments: ATTACHMENTS.filter((a) => a.lesson_id === 'les-001'),
  progress: LESSON_PROGRESS.find(
    (p) => p.lesson_id === 'les-001' && p.user_id === 'usr-student-001'
  ) ?? null,
  homework_submission: HOMEWORK_SUBMISSIONS.find(
    (s) => s.lesson_id === 'les-001' && s.user_id === 'usr-student-001'
  ) ?? null,
};

/** Admin homework review feed */
export const MOCK_HOMEWORK_FEED: HomeworkFeedItem[] = HOMEWORK_SUBMISSIONS.map(
  (submission) => {
    const student = USERS.find((u) => u.id === submission.user_id)!;
    const lesson = LESSONS.find((l) => l.id === submission.lesson_id);
    const course = COURSES.find((c) => c.id === submission.course_id);
    const reviews = HOMEWORK_REVIEWS.filter(
      (r) => r.submission_id === submission.id
    );
    return {
      submission,
      student: {
        id: student.id,
        full_name: student.full_name,
        avatar_url: student.avatar_url,
        role: student.role,
      },
      lesson_title: lesson?.title ?? 'Unknown',
      course_title: course?.title ?? 'Unknown',
      reviews,
    };
  }
);

/** Admin student management table rows */
export const MOCK_ADMIN_STUDENTS: AdminStudentRow[] = USERS.filter(
  (u) => u.role === UserRole.Student
).map((user) => {
  const userEnrollments = ENROLLMENTS.filter((e) => e.user_id === user.id);
  return {
    user: {
      id: user.id,
      full_name: user.full_name,
      avatar_url: user.avatar_url,
      role: user.role,
    },
    enrollments: userEnrollments.map((e) => {
      const course = COURSES.find((c) => c.id === e.course_id)!;
      const progress = COURSE_PROGRESS.find(
        (p) => p.user_id === user.id && p.course_id === e.course_id
      );
      return {
        course_id: e.course_id,
        course_title: course.title,
        status: e.status,
        progress: progress ?? {
          enrollment_id: e.id,
          user_id: user.id,
          course_id: e.course_id,
          completed_lessons: 0,
          total_lessons: course.total_lessons,
          percentage: 0,
          last_lesson_id: null,
          updated_at: new Date().toISOString(),
        },
      };
    }),
    last_login_at: user.last_login_at,
  };
});
