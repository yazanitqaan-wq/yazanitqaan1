import { supabase } from './supabaseClient';

export interface Exam {
  id: string;
  title: string;
  start_time: string;
  duration: number; // in minutes
  is_active: boolean;
}

export interface ExamResult {
  id: string;
  student_id: string;
  exam_id: string;
  score: number;
  submitted_at: string;
}

export const examService = {
  async getExams(): Promise<{ exams: Exam[]; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('exams')
        .select('*')
        .order('start_time', { ascending: true });

      if (error) throw error;
      return { exams: data || [], error: null };
    } catch (err: any) {
      return { exams: [], error: err.message || 'حدث خطأ أثناء جلب الامتحانات' };
    }
  },

  async getStudentResults(studentId: string): Promise<{ results: any[]; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('results')
        .select(`
          *,
          exams ( title )
        `)
        .eq('student_id', studentId)
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      return { results: data || [], error: null };
    } catch (err: any) {
      return { results: [], error: err.message || 'حدث خطأ أثناء جلب النتائج' };
    }
  },

  async submitExam(studentId: string, examId: string, score: number): Promise<{ success: boolean; error: string | null }> {
    try {
      const { error } = await supabase
        .from('results')
        .insert([
          { student_id: studentId, exam_id: examId, score, submitted_at: new Date().toISOString() }
        ]);

      if (error) throw error;
      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err.message || 'حدث خطأ أثناء تسليم الامتحان' };
    }
  }
};
