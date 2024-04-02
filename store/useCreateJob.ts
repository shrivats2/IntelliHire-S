import { create } from "zustand";

interface CreateJobState {
  job_title: string;
  job_domain: string;
  job_description: string;
  questions_added: any[];

  setTitle: (job_title: string) => void;
  setDomain: (job_domain: string) => void;
  setDescription: (job_description: string) => void;

  setQuestions: (questions: any[]) => void;
  updateQuestion: (quiz_id: any, updatedQuestion: any) => void;
  deleteQuestion: (quiz_idToDelete: any) => void;
  reset: () => void;
}

const useCreateJob = create<CreateJobState>((set) => ({
  job_title: "",
  job_domain: "",
  job_description: "",
  questions_added: [],

  setTitle: (job_title: string) => {
    set({ job_title });
  },
  setDomain: (job_domain: string) => {
    set({ job_domain });
  },
  setDescription: (job_description: string) => {
    set({ job_description: job_description });
  },

  setQuestions: (questions: any[]) => {
    set((state) => ({
      questions_added: [...state.questions_added, ...questions],
    }));
  },
  updateQuestion: (quiz_id: any, updatedQuestion: any) => {
    set((state) => ({
      questions_added: state.questions_added.map((question) =>
        question.quiz_id === quiz_id ? updatedQuestion : question
      ),
    }));
  },
  deleteQuestion: (quiz_idToDelete: any) => {
    set((state) => ({
      questions_added: state.questions_added.filter(
        (question) => question.quiz_id !== quiz_idToDelete
      ),
    }));
  },
  reset: () => {
    set((state) => ({
      job_title: "",
      job_domain: "",
      job_description: "",
      questions_added: [],
    }));
  },
}));

export default useCreateJob;
