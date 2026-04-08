import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, ShieldCheck, LogIn, ArrowRight, Star, Award, Users } from 'lucide-react';
import CountdownTimer from '../components/CountdownTimer';
import { examService, Exam } from '../services/examService';
import { authService } from '../services/authService';
import { cn } from '../lib/utils';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

export default function Home() {
  const [nextExam, setNextExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);
  const student = authService.getCurrentStudent();
  const admin = authService.getCurrentAdmin();
  const user = student || admin;

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
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 hero-gradient z-0" />
        <div className="absolute inset-0 opacity-20 z-0" style={{ backgroundImage: 'radial-gradient(var(--secondary) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center space-y-8">
          <Badge variant="secondary" className="px-4 py-1 text-sm rounded-full animate-bounce">
            أكاديمية اللغة الإنجليزية المتميزة
          </Badge>
          
          <h1 className="text-6xl md:text-8xl font-serif font-bold text-white leading-tight text-balance">
            طريقك نحو <span className="text-secondary italic">الاحتراف</span> في الإنجليزية
          </h1>
          
          <p className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto font-light leading-relaxed">
            منصة الأستاذ يزن أبو كحيل المتطورة للامتحانات الإلكترونية. تجربة تعليمية فريدة تجمع بين الدقة والابتكار.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            {!user ? (
              <Link to="/login">
                <Button size="lg" className="rounded-2xl px-10 py-7 text-lg bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-xl shadow-secondary/20">
                  ابدأ رحلتك الآن
                  <ArrowRight className="mr-2 w-5 h-5" />
                </Button>
              </Link>
            ) : (
              <Link to="/exams">
                <Button size="lg" className="rounded-2xl px-10 py-7 text-lg bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-xl shadow-secondary/20">
                  تصفح الامتحانات
                  <BookOpen className="mr-2 w-5 h-5" />
                </Button>
              </Link>
            )}
            <Button size="lg" variant="outline" className="rounded-2xl px-10 py-7 text-lg text-white border-white/20 hover:bg-white/10 backdrop-blur-sm">
              تعرف علينا
            </Button>
          </div>
        </div>
      </section>

      {/* Countdown Section */}
      {nextExam && (
        <section className="max-w-5xl mx-auto px-4 -mt-32 relative z-20">
          <Card className="glass border-0 shadow-2xl rounded-[2rem] overflow-hidden">
            <CardContent className="p-8 md:p-12 flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1 space-y-4 text-center md:text-right">
                <Badge className="bg-primary/10 text-primary border-0">الامتحان القادم</Badge>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">{nextExam.title}</h2>
                <p className="text-muted-foreground">استعد جيداً، الامتحان سيبدأ قريباً جداً. تأكد من مراجعة الدروس المطلوبة.</p>
              </div>
              <div className="flex-shrink-0 bg-primary/5 p-8 rounded-3xl border border-primary/10">
                <CountdownTimer targetDate={nextExam.start_time} />
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-serif font-bold">لماذا تختار منصتنا؟</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">نحن نوفر لك بيئة تعليمية متكاملة تساعدك على تحقيق أهدافك الأكاديمية بكل سهولة ويسر.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: 'أمان تام', desc: 'نظام حماية متطور يضمن خصوصية بياناتك ونزاهة الامتحانات.', icon: <ShieldCheck className="w-8 h-8" />, color: 'bg-blue-500' },
            { title: 'دقة المواعيد', desc: 'نظام جدولة دقيق للامتحانات مع تنبيهات مستمرة لضمان عدم فوات أي اختبار.', icon: <Clock className="w-8 h-8" />, color: 'bg-amber-500' },
            { title: 'تقارير مفصلة', desc: 'تحليل شامل لأدائك في كل امتحان لمساعدتك على معرفة نقاط قوتك وضعفك.', icon: <Award className="w-8 h-8" />, color: 'bg-emerald-500' },
          ].map((f, i) => (
            <Card key={i} className="group hover:shadow-2xl transition-all duration-500 border-0 bg-white dark:bg-slate-900 rounded-[2rem] p-4">
              <CardContent className="p-8 space-y-6">
                <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg transform group-hover:rotate-12 transition-transform", f.color)}>
                  {f.icon}
                </div>
                <h3 className="text-2xl font-serif font-bold">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-primary py-24 text-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {[
            { label: 'طالب مسجل', value: '1,200+', icon: <Users className="w-6 h-6" /> },
            { label: 'امتحان مكتمل', value: '5,000+', icon: <BookOpen className="w-6 h-6" /> },
            { label: 'تقييم إيجابي', value: '98%', icon: <Star className="w-6 h-6" /> },
            { label: 'ساعة تعليمية', value: '10k+', icon: <Clock className="w-6 h-6" /> },
          ].map((s, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-center text-secondary mb-4">{s.icon}</div>
              <div className="text-4xl md:text-5xl font-serif font-bold">{s.value}</div>
              <div className="text-white/60 text-sm uppercase tracking-widest">{s.label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
