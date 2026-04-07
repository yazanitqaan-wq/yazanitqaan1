import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, ShieldCheck } from 'lucide-react';
import CountdownTimer from '../components/CountdownTimer';
import { examService, Exam } from '../services/examService';

export default function Home() {
  const [nextExam, setNextExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExams = async () => {
      const { exams } = await examService.getExams();
      const upcoming = exams.find(e => new Date(e.start_time) > new Date() || e.is_active);
      if (upcoming) {
        setNextExam(upcoming);
      }
      setLoading(false);
    };
    fetchExams();
  }, []);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-12 px-4 sm:px-6 lg:px-8 bg-white rounded-3xl shadow-sm border border-gray-100">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
          منصة الامتحانات الإلكترونية
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-8">
          أهلاً بك في منصة الأستاذ يزن أبو كحيل للامتحانات الإلكترونية. استعد لاختبار مهاراتك في اللغة الإنجليزية.
        </p>
        
        {loading ? (
          <div className="h-32 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : nextExam ? (
          <div className="bg-blue-50 rounded-2xl p-6 sm:p-10 max-w-3xl mx-auto border border-blue-100">
            <h2 className="text-2xl font-bold text-blue-900 mb-6">الامتحان القادم: {nextExam.title}</h2>
            <CountdownTimer targetDate={nextExam.start_time} />
            <div className="mt-8">
              <Link
                to="/exams"
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10 transition-colors shadow-sm"
              >
                الذهاب للامتحانات
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-2xl p-8 max-w-2xl mx-auto border border-gray-200">
            <p className="text-lg text-gray-600">لا يوجد امتحانات مجدولة حالياً.</p>
          </div>
        )}
      </section>

      {/* Instructions Section */}
      <section className="grid md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">تسجيل الدخول الآمن</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            استخدم الكود السري وكلمة المرور الخاصة بك للدخول. يمكنك استرجاعها باستخدام بياناتك الشخصية.
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">الالتزام بالوقت</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            يبدأ الامتحان في الوقت المحدد وينتهي تلقائياً عند انتهاء المدة المخصصة. تأكد من استعدادك.
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">النتائج الفورية</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            تظهر نتيجتك فور تسليم الامتحان ويمكنك مراجعة سجل امتحاناتك السابقة من ملفك الشخصي.
          </p>
        </div>
      </section>
    </div>
  );
}
