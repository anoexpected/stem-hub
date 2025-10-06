import { create } from 'zustand';
import { ExamBoard, Subject, Topic } from '@/types/database';

interface SelectionState {
    selectedExamBoard: ExamBoard | null;
    selectedSubject: Subject | null;
    selectedTopic: Topic | null;
    setExamBoard: (examBoard: ExamBoard | null) => void;
    setSubject: (subject: Subject | null) => void;
    setTopic: (topic: Topic | null) => void;
    reset: () => void;
}

export const useSelectionStore = create<SelectionState>((set) => ({
    selectedExamBoard: null,
    selectedSubject: null,
    selectedTopic: null,

    setExamBoard: (examBoard) => set({
        selectedExamBoard: examBoard,
        selectedSubject: null, // Reset downstream selections
        selectedTopic: null,
    }),

    setSubject: (subject) => set({
        selectedSubject: subject,
        selectedTopic: null, // Reset downstream selection
    }),

    setTopic: (topic) => set({ selectedTopic: topic }),

    reset: () => set({
        selectedExamBoard: null,
        selectedSubject: null,
        selectedTopic: null,
    }),
}));
