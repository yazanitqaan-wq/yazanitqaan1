import React, { useState, useEffect } from 'react';
import { differenceInSeconds, format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Clock, Calendar, PlayCircle } from 'lucide-react';
import { Exam } from '../services/examService';
import { cn } from '../utils/cn';

interface ExamCardProps {
  key?: React.Key;
  exam: Exam;
  onEnterExam: (examId: string) => void;
}

export default function ExamCard({ exam, onEnterExam }: ExamCardProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const checkReady = () => {
      const target = new Date(exam.start_time);
      const now = new Date();
      setIsReady(differenceInSeconds(target, now) <= 0);
    };

    checkReady();
    const timer = setInterval(checkReady, 1000);
    return () => clearInterval(timer);
  }, [exam.start_time]);

  const startDate = new Date(exam.start_time);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-gray-900">{exam.title}</h3>
          <span className={cn(
            "px-3 py-1 rounded-full text-xs font-semibold",
            exam.is_active && isReady ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
          )}>
            {exam.is_active && isReady ? 'متاح الآن' : 'غير متاح'}
          </span>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center text-gray-600">
            <Calendar className="w-5 h-5 ml-2 text-blue-500" />
            <span>{format(startDate, 'EEEE, d MMMM yyyy', { locale: ar })}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Clock className="w-5 h-5 ml-2 text-blue-500" />
            <span>{format(startDate, 'h:mm a', { locale: ar })}</span>
            <span className="mx-2 text-gray-300">|</span>
            <span>المدة: {exam.duration} دقيقة</span>
          </div>
        </div>

        <button
          onClick={() => onEnterExam(exam.id)}
          disabled={!isReady || !exam.is_active}
          className={cn(
            "w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-colors",
            isReady && exam.is_active
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          )}
        >
          <PlayCircle className="w-5 h-5" />
          {isReady && exam.is_active ? 'دخول الامتحان' : 'الامتحان لم يبدأ بعد'}
        </button>
      </div>
    </div>
  );
}
