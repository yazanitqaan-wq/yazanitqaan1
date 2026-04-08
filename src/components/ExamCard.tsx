import React, { useState, useEffect } from 'react';
import { differenceInSeconds, format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Clock, Calendar, PlayCircle, ArrowRight } from 'lucide-react';
import { Exam } from '../services/examService';
import { cn } from '../lib/utils';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

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
  const isActive = exam.is_active && isReady;

  return (
    <Card className="group border-0 shadow-sm hover:shadow-2xl transition-all duration-500 rounded-[2rem] overflow-hidden bg-white dark:bg-slate-900 flex flex-col">
      <CardHeader className="p-0 relative h-48 overflow-hidden">
        <div className={cn(
          "absolute inset-0 transition-transform duration-700 group-hover:scale-110",
          isActive ? "bg-emerald-600" : "bg-primary"
        )} />
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
        
        <div className="absolute top-4 right-4 flex gap-2">
          {isActive && (
            <Badge className="bg-white text-emerald-600 border-0 animate-pulse">نشط الآن</Badge>
          )}
          <Badge variant="secondary" className="bg-white/20 text-white backdrop-blur-md border-0">
            {exam.duration} دقيقة
          </Badge>
        </div>

        <div className="absolute bottom-4 right-4 left-4">
          <h3 className="text-2xl font-serif font-bold text-white line-clamp-2">{exam.title}</h3>
        </div>
      </CardHeader>

      <CardContent className="p-8 flex-grow space-y-6">
        <div className="flex flex-col gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4 text-primary" />
            <span>{format(startDate, 'EEEE, d MMMM yyyy', { locale: ar })}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4 text-primary" />
            <span>{format(startDate, 'h:mm a', { locale: ar })}</span>
          </div>
        </div>

        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
          هذا الامتحان مصمم لتقييم مهاراتك في {exam.title}. تأكد من مراجعة الدروس المطلوبة قبل البدء.
        </p>

        <div className="flex items-center gap-4 pt-2">
          <div className="flex -space-x-2 space-x-reverse">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-muted flex items-center justify-center text-[10px] font-bold">
                {String.fromCharCode(64 + i)}
              </div>
            ))}
          </div>
          <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">+40 طالب شاركوا</span>
        </div>
      </CardContent>

      <CardFooter className="p-8 pt-0">
        <Button 
          onClick={() => onEnterExam(exam.id)}
          disabled={!isActive}
          className={cn(
            "w-full h-14 rounded-2xl text-lg font-bold transition-all group-hover:shadow-xl",
            isActive 
              ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20" 
              : "bg-muted text-muted-foreground cursor-not-allowed"
          )}
        >
          {isActive ? 'ابدأ الامتحان الآن' : isReady ? 'انتهى وقت الامتحان' : 'انتظر موعد البدء'}
          <ArrowRight className="mr-2 w-5 h-5 transition-transform group-hover:-translate-x-1" />
        </Button>
      </CardFooter>
    </Card>
  );
}
