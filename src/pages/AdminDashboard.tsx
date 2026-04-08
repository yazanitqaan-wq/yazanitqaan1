import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { examService, Exam } from '../services/examService';
import { 
  Users, 
  BookOpen, 
  Plus, 
  Settings, 
  BarChart3, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  MoreVertical,
  Edit,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ScrollArea } from '../components/ui/scroll-area';
import { Separator } from '../components/ui/separator';
import { cn } from '../lib/utils';

export default function AdminDashboard() {
  const admin = authService.getCurrentAdmin();
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);

  if (!admin) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    const fetchData = async () => {
      const { exams: examsData } = await examService.getExams();
      setExams(examsData);
      setLoading(false);
    };
    fetchData();
  }, []);

  const stats = [
    { label: 'إجمالي الامتحانات', value: exams.length, icon: <BookOpen className="w-5 h-5" />, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'الطلاب المسجلين', value: '1,248', icon: <Users className="w-5 h-5" />, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'امتحانات نشطة', value: exams.filter(e => e.is_active).length, icon: <Clock className="w-5 h-5" />, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'متوسط الدرجات', value: '84%', icon: <BarChart3 className="w-5 h-5" />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-serif font-bold text-foreground">لوحة التحكم</h1>
          <p className="text-muted-foreground">أهلاً بك مجدداً، أ. {admin.first_name}. إليك نظرة عامة على نشاط الأكاديمية.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl gap-2">
            <Settings className="w-4 h-4" />
            الإعدادات
          </Button>
          <Button className="rounded-xl gap-2 shadow-lg shadow-primary/20">
            <Plus className="w-4 h-4" />
            إنشاء امتحان جديد
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="border-0 shadow-sm rounded-3xl overflow-hidden">
            <CardContent className="p-6 flex items-center gap-4">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner", stat.bg, stat.color)}>
                {stat.icon}
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Exams Table/List */}
        <Card className="lg:col-span-2 border-0 shadow-sm rounded-[2rem] overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/30 px-8 py-6">
            <div>
              <CardTitle className="text-xl font-serif font-bold">الامتحانات الحالية</CardTitle>
              <CardDescription>إدارة وتعديل الامتحانات المجدولة</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-primary">عرض الكل</Button>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[500px]">
              <div className="divide-y">
                {loading ? (
                  <div className="p-12 text-center text-muted-foreground">جاري تحميل البيانات...</div>
                ) : exams.length === 0 ? (
                  <div className="p-12 text-center text-muted-foreground">لا يوجد امتحانات حالياً.</div>
                ) : (
                  exams.map((exam) => (
                    <div key={exam.id} className="p-6 hover:bg-muted/20 transition-colors flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-serif font-bold",
                          exam.is_active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                        )}>
                          {exam.title.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">{exam.title}</h4>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(exam.start_time).toLocaleDateString('ar-EG')}
                            </span>
                            <Separator orientation="vertical" className="h-3" />
                            <Badge variant={exam.is_active ? "default" : "secondary"} className="text-[10px] px-2 py-0">
                              {exam.is_active ? 'نشط الآن' : 'غير نشط'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="rounded-xl hover:bg-blue-50 hover:text-blue-600">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="rounded-xl hover:bg-red-50 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="rounded-xl">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-0 shadow-sm rounded-[2rem] overflow-hidden">
          <CardHeader className="border-b bg-muted/30 px-8 py-6">
            <CardTitle className="text-xl font-serif font-bold">آخر النشاطات</CardTitle>
            <CardDescription>تحديثات فورية لأداء الطلاب</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {[
                { user: 'أحمد محمد', action: 'أكمل امتحان القواعد', time: 'منذ دقيقتين', score: '95/100', type: 'success' },
                { user: 'سارة علي', action: 'بدأت امتحان المفردات', time: 'منذ 5 دقائق', type: 'info' },
                { user: 'خالد عمر', action: 'فشل في تسجيل الدخول', time: 'منذ 12 دقيقة', type: 'warning' },
                { user: 'ليلى حسن', action: 'أكملت امتحان القراءة', time: 'منذ 20 دقيقة', score: '88/100', type: 'success' },
              ].map((activity, i) => (
                <div key={i} className="flex gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center",
                    activity.type === 'success' ? "bg-emerald-50 text-emerald-600" :
                    activity.type === 'warning' ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"
                  )}>
                    {activity.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> :
                     activity.type === 'warning' ? <AlertCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-bold text-foreground">
                      {activity.user} <span className="font-normal text-muted-foreground">{activity.action}</span>
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{activity.time}</span>
                      {activity.score && <Badge variant="outline" className="text-[10px] font-mono">{activity.score}</Badge>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-8 rounded-xl gap-2">
              عرض سجل النشاط الكامل
              <ExternalLink className="w-3 h-3" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
