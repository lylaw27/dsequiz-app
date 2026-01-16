// Shared types for quiz and subject data

export type MCQSet = {
  id: string;
  topic: string;
  description: string | null;
  count: number;
  subject_id: string;
  created_at: string | null;
  updated_at: string | null;
};

export type Subject = {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type QuizData = {
  id: string;
  title: string;
  quizCount: number;
  icon: string;
  iconColor: string;
  bgColor: string;
  peopleJoined: number;
  avatars: string[];
};

// Helper function to map MCQSet to QuizData
export const mapMCQSetToQuizData = (mcqSet: MCQSet, index: number): QuizData => {
  const colors = [
    { icon: '#6366f1', bg: '#e0e7ff' },
    { icon: '#ec4899', bg: '#fce7f3' },
    { icon: '#10b981', bg: '#d1fae5' },
    { icon: '#f59e0b', bg: '#fef3c7' },
    { icon: '#8b5cf6', bg: '#ede9fe' },
  ];
  
  const icons = [
    'function-outline',
    'help-circle-outline',
    'bar-chart-outline',
    'book-outline',
    'school-outline',
  ];

  const colorIndex = index % colors.length;
  const iconIndex = index % icons.length;

  return {
    id: mcqSet.id,
    title: mcqSet.topic,
    quizCount: mcqSet.count,
    icon: icons[iconIndex],
    iconColor: colors[colorIndex].icon,
    bgColor: colors[colorIndex].bg,
    peopleJoined: Math.floor(Math.random() * 500) + 100,
    avatars: [
      `https://img.heroui.chat/image/avatar?w=400&h=400&u=${index * 3 + 1}`,
      `https://img.heroui.chat/image/avatar?w=400&h=400&u=${index * 3 + 2}`,
      `https://img.heroui.chat/image/avatar?w=400&h=400&u=${index * 3 + 3}`,
    ],
  };
};

// Helper function to map Subject to QuizData for display
export const mapSubjectToQuizData = (subject: Subject, index: number): QuizData => {
  const colors = [
    { icon: '#6366f1', bg: '#e0e7ff' },
    { icon: '#ec4899', bg: '#fce7f3' },
    { icon: '#10b981', bg: '#d1fae5' },
    { icon: '#f59e0b', bg: '#fef3c7' },
    { icon: '#8b5cf6', bg: '#ede9fe' },
  ];
  
  const icons = [
    'book-outline',
    'library-outline',
    'school-outline',
    'reader-outline',
    'newspaper-outline',
  ];

  const colorIndex = index % colors.length;
  const iconIndex = index % icons.length;

  return {
    id: subject.id,
    title: subject.name,
    quizCount: 0,
    icon: icons[iconIndex],
    iconColor: colors[colorIndex].icon,
    bgColor: colors[colorIndex].bg,
    peopleJoined: Math.floor(Math.random() * 500) + 100,
    avatars: [
      `https://img.heroui.chat/image/avatar?w=400&h=400&u=${index * 3 + 1}`,
      `https://img.heroui.chat/image/avatar?w=400&h=400&u=${index * 3 + 2}`,
      `https://img.heroui.chat/image/avatar?w=400&h=400&u=${index * 3 + 3}`,
    ],
  };
};
