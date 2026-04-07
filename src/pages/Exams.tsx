import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { examService, Exam } from '../services/examService';
import ExamCard from '../components/ExamCard';
import { BookOpen } from 'lucide-react';

export default function Exams() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const student = authService.getCurrentStudent();

  if (!student) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    const fetchExams = async () => {
      const { exams: data, error: fetchError } = await examService.getExams();
      if (fetchError) {
        setError(fetchError);
      } else {
        setExams(data);
      }
      setLoading(false);
    };
    fetchExams();
  }, []);

  const handleEnterExam = (examId: string) => {
    // In a real app, this would navigate to the actual exam taking interface
    // For this prototype, we'll just show an alert or navigate to a placeholder
    alert(`جاري الدخول للامتحان: ${examId}\n(هذه نسخة تجريبية، سيتم إضافة واجهة الامتحان لاحقاً)`);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 border-b border-gray-200 pb-6">
        <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
          <BookOpen className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">الامتحانات</h1>
          <p className="text-gray-500 mt-1">قائمة الامتحانات المتاحة والمجدولة</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100">
          {error}
        </div>
      ) : exams.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">لا يوجد امتحانات</h3>
          <p className="text-gray-500">لم يتم جدولة أي امتحانات حالياً.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam) => (
            <ExamCard key={exam.id} exam={exam} onEnterExam={handleEnterExam} />
          ))}
        </div>
      )}
    </div>
  );
}
