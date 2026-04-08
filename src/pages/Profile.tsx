import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { examService } from '../services/examService';
import { User, Award, Calendar, BookOpen, Mail, ShieldCheck, Fingerprint, GraduationCap, ArrowLeft, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ScrollArea } from '../components/ui/scroll-area';
import { Separator } from '../components/ui/separator';
import { cn } from '../lib/utils';

export default function Profile() {
  const student = authService.getCurrentStudent();
  const admin = authService.getCurrentAdmin();
  const user = student || admin;
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    const fetchResults = async () => {
      if (student) {
        const { results: data } = await examService.getStudentResults(student.id);
        setResults(data || []);
      }
      setLoading(false);
    };
    fetchResults();
  }, [student?.id]);

  const averageScore = results.length > 0 
    ? Math.round(results.reduce((acc, curr) => acc + curr.score, 0) / results.length) 
    : 0;

  return (
    <div className="space-y-10 pb-20">
      {/* Profile Header Card */}
      <Card className="border-0 shadow-2xl rounded-[2.5rem] overflow-hidden bg-white dark:bg-slate-900">
        <div className="h-48 hero-gradient relative">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        </div>
        <CardContent className="px-8 pb-10 relative">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-8 -mt-20 md:-mt-16 mb-8">
            <div className="w-40 h-40 bg-white dark:bg-slate-900 rounded-[2.5rem] p-3 shadow-2xl">
              <div className="w-full h-full bg-primary/10 rounded-[2rem] flex items-center justify-center text-primary">
                {admin ? <ShieldCheck className="w-20 h-20" /> : <GraduationCap className="w-20 h-20" />}
              </div>
            </div>
            <div className="text-center md:text-right flex-1 space-y-2">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <h1 className="text-4xl font-serif font-bold text-foreground">{user.first_name} {user.last_name}</h1>
                <Badge variant="secondary" className="rounded-full px-4 py-1 text-sm font-medium">
                  {admin ? 'أستاذ / مدير النظام' : 'طالب متميز'}
                </Badge>
              </div>
              <p className="text-muted-foreground text-lg flex items-center justify-center md:justify-start gap-2">
                <Mail className="w-4 h-4" />
                {admin ? admin.username : `الرقم الوطني: ${student?.national_id}`}
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="rounded-xl">تعديل الملف</Button>
              <Button className="rounded-xl shadow-lg shadow-primary/20">تحميل التقرير</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Sidebar Info */}
        <div className="space-y-8">
          <Card className="border-0 shadow-sm rounded-[2rem] overflow-hidden">
            <CardHeader className="bg-muted/30 border-b px-8 py-6">
              <CardTitle className="text-xl font-serif font-bold flex items-center gap-3">
                <Fingerprint className="w-5 h-5 text-primary" />
                بيانات الحساب
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              {student ? (
                <>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">تاريخ الميلاد</p>
                    <p className="text-lg font-bold text-foreground">{student.birth_date}</p>
                  </div>
                  <Separator />
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">الكود السري</p>
                    <div className="flex items-center justify-between bg-muted/50 p-3 rounded-xl">
                      <code className="text-lg font-mono font-bold text-primary">{student.secret_code}</code>
                      <Badge variant="outline" className="text-[10px]">خاص</Badge>
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">اسم المستخدم</p>
                    <p className="text-lg font-bold text-foreground">{admin?.username}</p>
                  </div>
                  <Separator />
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">الصلاحيات</p>
                    <p className="text-lg font-bold text-foreground">إدارة كاملة للنظام</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm rounded-[2rem] overflow-hidden bg-primary text-primary-foreground">
            <CardContent className="p-8 space-y-8">
              <div className="flex items-center justify-between">
                <Award className="w-10 h-10 opacity-50" />
                <Badge variant="secondary" className="bg-white/20 text-white border-0">المستوى الحالي</Badge>
              </div>
              <div className="space-y-2">
                <p className="text-4xl font-serif font-bold">{averageScore}%</p>
                <p className="text-primary-foreground/70">متوسط درجاتك في جميع الامتحانات</p>
              </div>
              <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                <div className="bg-white h-full transition-all duration-1000" style={{ width: `${averageScore}%` }} />
              </div>
              <div className="flex justify-between text-xs font-medium uppercase tracking-widest">
                <span>مبتدئ</span>
                <span>محترف</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content - Results */}
        <Card className="lg:col-span-2 border-0 shadow-sm rounded-[2rem] overflow-hidden">
          <CardHeader className="bg-muted/30 border-b px-8 py-6 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-serif font-bold flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-primary" />
                سجل الامتحانات
              </CardTitle>
              <CardDescription>نتائجك وتفاصيل أدائك السابقة</CardDescription>
            </div>
            <Badge variant="outline" className="rounded-full">{results.length} امتحان</Badge>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[600px]">
              {loading ? (
                <div className="p-12 text-center text-muted-foreground">جاري تحميل النتائج...</div>
              ) : results.length === 0 ? (
                <div className="p-20 text-center space-y-4">
                  <Award className="w-16 h-16 mx-auto text-muted-foreground opacity-20" />
                  <p className="text-xl text-muted-foreground">لم تقم بتقديم أي امتحانات بعد.</p>
                  <Button variant="outline" className="rounded-xl">استكشف الامتحانات</Button>
                </div>
              ) : (
                <div className="divide-y">
                  {results.map((result) => (
                    <div key={result.id} className="p-8 hover:bg-muted/20 transition-all flex items-center justify-between group">
                      <div className="flex items-start gap-6">
                        <div className={cn(
                          "w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-serif font-bold shadow-sm",
                          result.score >= 90 ? "bg-emerald-100 text-emerald-700" :
                          result.score >= 70 ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"
                        )}>
                          {result.score}%
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                            {result.exams?.title || 'امتحان اللغة الإنجليزية'}
                          </h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {format(new Date(result.submitted_at), 'd MMMM yyyy', { locale: ar })}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {format(new Date(result.submitted_at), 'h:mm a', { locale: ar })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="rounded-xl opacity-0 group-hover:opacity-100 transition-all">
                        <ArrowLeft className="w-5 h-5" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
