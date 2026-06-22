import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const initialState = {
  // Active session
  activeLanguage: null,

  // Per-language progress: { [langId]: { completedLessons: Set, unitProgress: {} } }
  progress: {},

  // XP and streaks
  xp: 0,
  streak: 0,
  lastActiveDate: null,

  // Current lesson session
  session: null, // { lessonId, languageId, hearts, currentExerciseIndex, score, answers }
};

export const useStore = create(
  persist(
    (set, get) => ({
      ...initialState,

      // ── Language selection ──────────────────────────────────────────────
      setActiveLanguage: (langId) => set({ activeLanguage: langId }),

      // ── Session management ──────────────────────────────────────────────
      startSession: (languageId, lessonId) => {
        set({
          session: {
            languageId,
            lessonId,
            hearts: 5,
            currentExerciseIndex: 0,
            score: 0,
            correctCount: 0,
            totalCount: 0,
            answers: [],
            completed: false,
          },
        });
      },

      answerExercise: (isCorrect) => {
        const { session } = get();
        if (!session) return;
        set({
          session: {
            ...session,
            hearts: isCorrect ? session.hearts : Math.max(0, session.hearts - 1),
            score: isCorrect ? session.score + 10 : session.score,
            correctCount: isCorrect ? session.correctCount + 1 : session.correctCount,
            totalCount: session.totalCount + 1,
          },
        });
      },

      nextExercise: () => {
        const { session } = get();
        if (!session) return;
        set({
          session: {
            ...session,
            currentExerciseIndex: session.currentExerciseIndex + 1,
          },
        });
      },

      completeSession: () => {
        const { session, progress, xp } = get();
        if (!session) return;

        const langId = session.languageId;
        const lessonId = session.lessonId;
        const earnedXP = session.score;

        // Update progress
        const langProgress = progress[langId] || { completedLessons: [], xp: 0 };
        const completedLessons = langProgress.completedLessons.includes(lessonId)
          ? langProgress.completedLessons
          : [...langProgress.completedLessons, lessonId];

        // Update streak
        const today = new Date().toDateString();
        const { lastActiveDate, streak } = get();
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        const newStreak = lastActiveDate === today
          ? streak
          : lastActiveDate === yesterday
            ? streak + 1
            : 1;

        set({
          xp: xp + earnedXP,
          streak: newStreak,
          lastActiveDate: today,
          progress: {
            ...progress,
            [langId]: {
              ...langProgress,
              completedLessons,
              xp: (langProgress.xp || 0) + earnedXP,
            },
          },
          session: { ...session, completed: true },
        });
      },

      clearSession: () => set({ session: null }),

      // ── Helpers ─────────────────────────────────────────────────────────
      isLessonCompleted: (langId, lessonId) => {
        const { progress } = get();
        return progress[langId]?.completedLessons?.includes(lessonId) || false;
      },

      getLangXP: (langId) => {
        const { progress } = get();
        return progress[langId]?.xp || 0;
      },

      getCompletedCount: (langId) => {
        const { progress } = get();
        return progress[langId]?.completedLessons?.length || 0;
      },

      resetAll: () => set(initialState),
    }),
    {
      name: 'bhasha-store',
      partialize: (state) => ({
        activeLanguage: state.activeLanguage,
        progress: state.progress,
        xp: state.xp,
        streak: state.streak,
        lastActiveDate: state.lastActiveDate,
      }),
    }
  )
);
