import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { examService } from '../services/examService';
import { User, Award, Calendar, BookOpen } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

export default function Profile() {
  const student = authService.getCurrentStudent();
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  if (!student) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    const fetchResults = async () => {
      const { results: data } = await examService.getStudentResults(student.id);
      setResults(data);
      setLoading(false);
    };
    fetchResults();
  }, [student.id]);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Profile Header */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-blue-600 h-32"></div>
        <div className="px-8 pb-8 relative">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-16 sm:-mt-12 mb-6">
            <div className="w-32 h-32 bg-white rounded-full p-2 shadow-lg">
              <div className="w-full h-full bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                <User className="w-16 h-16" />
              </div>
            </div>
            <div className="text-center sm:text-right pb-2">
              <h1 className="text-3xl font-bold text-gray-900">{student.first_name} {student.last_name}</h1>
              <p className="text-gray-500 mt-1 flex items-center justify-center sm:justify-start gap-2">
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-md font-medium">طالب</span>
                الرقم الوطني: {student.national_id}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Sidebar Info */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-500" />
              المعلومات الشخصية
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">تاريخ الميلاد</p>
                <p className="font-medium text-gray-900">{student.birth_date}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">الكود السري</p>
                <p className="font-mono font-medium text-gray-900">{student.secret_code}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-500" />
              إحصائيات
            </h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-2xl font-bold text-blue-600">{results.length}</div>
                <div className="text-xs text-gray-500 mt-1">امتحانات مكتملة</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-2xl font-bold text-green-600">
                  {results.length > 0 ? Math.round(results.reduce((acc, curr) => acc + curr.score, 0) / results.length) : 0}%
                </div>
                <div className="text-xs text-gray-500 mt-1">متوسط الدرجات</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Results */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-blue-500" />
              سجل الامتحانات
            </h3>

            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <Award className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">لم تقم بتقديم أي امتحانات بعد.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {results.map((result) => (
                  <div key={result.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{result.exams?.title || 'امتحان غير معروف'}</h4>
                        <div className="flex items-center text-sm text-gray-500 mt-1 gap-1">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(result.submitted_at), 'd MMMM yyyy - h:mm a', { locale: ar })}
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{result.score}%</div>
                      <div className="text-xs text-gray-500">النتيجة</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
