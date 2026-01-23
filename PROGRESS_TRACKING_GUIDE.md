# User Progress Tracking Implementation Guide

## Overview
Two new tables have been created to track user progress through MCQ sets:
- `user_mcqset_progress` - Tracks overall progress for each quiz session
- `user_mcqset_answers` - Stores individual answers for each question

## Database Schema

### user_mcqset_progress
Tracks a user's overall progress through an MCQ set.

**Key Fields:**
- `user_id` - References auth.users
- `mcqset_id` - References mcqsets
- `status` - 'not_started', 'in_progress', or 'completed'
- `current_question_index` - Current position in quiz
- `answered_count` - Total questions answered
- `correct_count` - Total correct answers
- `started_at`, `completed_at`, `last_accessed_at` - Timestamps

**Unique Constraint:** One progress record per user per mcqset

### user_mcqset_answers
Stores individual answers for each question.

**Key Fields:**
- `progress_id` - References user_mcqset_progress
- `mcq_id` - References mcqs
- `question_order_index` - Position in the quiz
- `user_answer` - The answer selected (A, B, C, etc.)
- `is_correct` - Whether the answer was correct
- `time_spent_seconds` - Optional time tracking

**Unique Constraint:** One answer per question per progress session

### Automatic Features
- **Auto-updating counts**: Triggers automatically update `answered_count` and `correct_count`
- **Last accessed tracking**: Updates `last_accessed_at` when answers are recorded
- **RLS enabled**: Users can only access their own progress data

## Integration Examples

### 1. Initialize Progress on Quiz Start

```typescript
import { supabase } from '../lib/supabase';
import type { Tables, TablesInsert } from '../types/database.types';

async function initializeProgress(
  userId: string,
  mcqsetId: string,
  totalQuestions: number
) {
  // Check if progress already exists
  const { data: existing } = await supabase
    .from('user_mcqset_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('mcqset_id', mcqsetId)
    .single();

  if (existing) {
    // Resume existing progress
    return existing;
  }

  // Create new progress
  const { data, error } = await supabase
    .from('user_mcqset_progress')
    .insert({
      user_id: userId,
      mcqset_id: mcqsetId,
      total_questions: totalQuestions,
      status: 'in_progress',
      current_question_index: 0,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}
```

### 2. Save Answer When User Confirms

```typescript
async function saveAnswer(
  progressId: string,
  mcqId: string,
  questionOrderIndex: number,
  userAnswer: string,
  correctAnswer: string,
  timeSpentSeconds?: number
) {
  const isCorrect = userAnswer === correctAnswer;

  const { error } = await supabase
    .from('user_mcqset_answers')
    .insert({
      progress_id: progressId,
      mcq_id: mcqId,
      question_order_index: questionOrderIndex,
      user_answer: userAnswer,
      is_correct: isCorrect,
      time_spent_seconds: timeSpentSeconds,
    });

  if (error) throw error;

  // Counts are automatically updated by triggers
}
```

### 3. Update Current Position

```typescript
async function updateCurrentQuestion(
  progressId: string,
  currentIndex: number
) {
  const { error } = await supabase
    .from('user_mcqset_progress')
    .update({
      current_question_index: currentIndex,
    })
    .eq('id', progressId);

  if (error) throw error;
}
```

### 4. Mark Quiz as Completed

```typescript
async function completeQuiz(progressId: string) {
  const { error } = await supabase
    .from('user_mcqset_progress')
    .update({
      status: 'completed',
      completed_at: new Date().toISOString(),
    })
    .eq('id', progressId);

  if (error) throw error;
}
```

### 5. Fetch Progress with Answers

```typescript
async function getProgressWithAnswers(
  userId: string,
  mcqsetId: string
) {
  const { data: progress, error } = await supabase
    .from('user_mcqset_progress')
    .select(`
      *,
      user_mcqset_answers (
        *,
        mcqs (
          question,
          options,
          correct_answer,
          explanation
        )
      )
    `)
    .eq('user_id', userId)
    .eq('mcqset_id', mcqsetId)
    .single();

  if (error) throw error;
  return progress;
}
```

### 6. Get All User's Quiz History

```typescript
async function getUserQuizHistory(userId: string) {
  const { data, error } = await supabase
    .from('user_mcqset_progress')
    .select(`
      *,
      mcqsets (
        topic,
        description,
        subjects (
          name,
          eng_name
        )
      )
    `)
    .eq('user_id', userId)
    .order('last_accessed_at', { ascending: false });

  if (error) throw error;
  return data;
}
```

## Modifying the Quiz Component

Here's how to integrate progress tracking into your existing `[id].tsx`:

```typescript
// Add these state variables
const [progressId, setProgressId] = useState<string | null>(null);
const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());

// Initialize progress when quiz loads
useEffect(() => {
  if (mcqSet && userId) {
    initializeProgress(userId, id, mcqSet.mcqset_questions.length)
      .then(progress => {
        setProgressId(progress.id);
        // Optionally resume from saved position
        if (progress.current_question_index > 0) {
          setCurrentQuestionIndex(progress.current_question_index);
        }
      });
  }
}, [mcqSet, userId, id]);

// Save answer when confirmed
const handleNext = async () => {
  if (!isAnswerConfirmed && selectedAnswer && progressId && currentQuestion) {
    // Calculate time spent
    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
    
    // Save answer to database
    await saveAnswer(
      progressId,
      currentQuestion.id,
      currentQuestionIndex,
      selectedAnswer,
      currentQuestion.correct_answer,
      timeSpent
    );
    
    setIsAnswerConfirmed(true);
    setAnsweredQuestions(prev => new Set(prev).add(currentQuestionIndex));
    if (selectedAnswer) {
      setUserAnswers(prev => new Map(prev).set(currentQuestionIndex, selectedAnswer));
    }
    return;
  }

  // Handle next question navigation...
  // Update current position in database
  if (progressId) {
    const nextIndex = findNextQuestion();
    await updateCurrentQuestion(progressId, nextIndex);
    setQuestionStartTime(Date.now());
  }
};

// Complete quiz when all questions answered
useEffect(() => {
  if (allQuestionsCompleted && progressId) {
    completeQuiz(progressId);
  }
}, [allQuestionsCompleted, progressId]);
```

## API Endpoints (Backend)

If you need backend API endpoints, here are examples:

### GET /api/progress/:mcqsetId
Fetch user's progress for a specific quiz

### POST /api/progress/:mcqsetId
Initialize or resume progress

### PUT /api/progress/:progressId/answer
Save an answer

### PUT /api/progress/:progressId/complete
Mark quiz as completed

## Statistics & Analytics

You can build powerful analytics using this data:

```sql
-- User's average score across all quizzes
SELECT 
  AVG(CAST(correct_count AS FLOAT) / NULLIF(total_questions, 0) * 100) as avg_score
FROM user_mcqset_progress
WHERE user_id = 'user-uuid' AND status = 'completed';

-- Subject-wise performance
SELECT 
  s.name as subject,
  COUNT(*) as quizzes_taken,
  AVG(CAST(p.correct_count AS FLOAT) / NULLIF(p.total_questions, 0) * 100) as avg_score
FROM user_mcqset_progress p
JOIN mcqsets m ON p.mcqset_id = m.id
JOIN subjects s ON m.subject_id = s.id
WHERE p.user_id = 'user-uuid' AND p.status = 'completed'
GROUP BY s.id, s.name;

-- Question types that need improvement
SELECT 
  qt.name as question_type,
  COUNT(*) as total_attempts,
  SUM(CASE WHEN a.is_correct THEN 1 ELSE 0 END) as correct_answers,
  CAST(SUM(CASE WHEN a.is_correct THEN 1 ELSE 0 END) AS FLOAT) / COUNT(*) * 100 as accuracy
FROM user_mcqset_answers a
JOIN mcqs m ON a.mcq_id = m.id
JOIN question_types qt ON m.question_type_id = qt.id
JOIN user_mcqset_progress p ON a.progress_id = p.id
WHERE p.user_id = 'user-uuid'
GROUP BY qt.id, qt.name
ORDER BY accuracy ASC;
```

## Next Steps

1. **Add Supabase client** to your project if not already configured
2. **Create helper functions** for progress tracking
3. **Integrate into quiz component** using the examples above
4. **Build analytics dashboard** to show user progress
5. **Add resume functionality** to let users continue incomplete quizzes
6. **Implement leaderboards** comparing users' scores
7. **Add study recommendations** based on weak areas

## Security Notes

- RLS policies ensure users can only access their own data
- All queries automatically filter by authenticated user
- No additional authorization checks needed in your app code
- Triggers handle count updates automatically - no race conditions
