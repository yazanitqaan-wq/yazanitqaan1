import { supabase } from './supabaseClient';

export interface Student {
  id: string;
  first_name: string;
  last_name: string;
  national_id: string;
  birth_date: string;
  secret_code: string;
}

export const authService = {
  async login(secretCode: string, password: string): Promise<{ student: Student | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('secret_code', secretCode)
        .eq('password', password)
        .single();

      if (error) throw error;
      if (!data) throw new Error('بيانات الدخول غير صحيحة');

      // Store in local storage for session
      localStorage.setItem('student_session', JSON.stringify(data));
      return { student: data, error: null };
    } catch (err: any) {
      return { student: null, error: err.message || 'حدث خطأ أثناء تسجيل الدخول' };
    }
  },

  async getMyInfo(nationalId: string, birthDate: string, firstName: string, lastName: string) {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('secret_code, password')
        .eq('national_id', nationalId)
        .eq('birth_date', birthDate)
        .eq('first_name', firstName)
        .eq('last_name', lastName)
        .single();

      if (error) throw error;
      if (!data) throw new Error('لم يتم العثور على طالب بهذه البيانات');

      return { credentials: data, error: null };
    } catch (err: any) {
      return { credentials: null, error: err.message || 'حدث خطأ أثناء استرجاع البيانات' };
    }
  },

  logout() {
    localStorage.removeItem('student_session');
  },

  getCurrentStudent(): Student | null {
    const session = localStorage.getItem('student_session');
    return session ? JSON.parse(session) : null;
  }
};
