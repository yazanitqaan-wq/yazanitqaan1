import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { examService, Exam } from '../services/examService';
import ExamCard from '../components/ExamCard';
import { BookOpen, Search, Filter, LayoutGrid, List } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { cn } from '../lib/utils';

export default function Exams() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const navigate = useNavigate();
  const student = authService.getCurrentStudent();
  const admin = authService.getCurrentAdmin();
  const user = student || admin;

  if (!user) {
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
    alert(`جاري الدخول للامتحان: ${examId}\n(هذه نسخة تجريبية، سيتم إضافة واجهة الامتحان لاحقاً)`);
  };

  const filteredExams = exams.filter(exam => 
    exam.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-10 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <Badge variant="secondary" className="rounded-full px-4">قائمة الاختبارات</Badge>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground">الامتحانات المتاحة</h1>
          <p className="text-muted-foreground text-lg">اختر الامتحان المناسب وابدأ رحلة التميز اليوم.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-xl">
          <Button 
            variant={viewMode === 'grid' ? 'default' : 'ghost'} 
            size="icon" 
            onClick={() => setViewMode('grid')}
            className="rounded-lg"
          >
            <LayoutGrid className="w-4 h-4" />
          </Button>
          <Button 
            variant={viewMode === 'list' ? 'default' : 'ghost'} 
            size="icon" 
            onClick={() => setViewMode('list')}
            className="rounded-lg"
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input 
            placeholder="ابحث عن امتحان..." 
            className="h-14 pr-12 rounded-2xl bg-white dark:bg-slate-900 border-muted shadow-sm focus:ring-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="h-14 px-6 rounded-2xl gap-2 border-muted bg-white dark:bg-slate-900 shadow-sm">
          <Filter className="w-4 h-4" />
          تصفية النتائج
        </Button>
      </div>

      {/* Exams Grid/List */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 bg-muted animate-pulse rounded-[2rem]" />
          ))}
        </div>
      ) : error ? (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive p-8 rounded-[2rem] text-center space-y-4">
          <BookOpen className="w-12 h-12 mx-auto opacity-50" />
          <p className="text-xl font-bold">{error}</p>
          <Button variant="outline" onClick={() => window.location.reload()}>إعادة المحاولة</Button>
        </div>
      ) : filteredExams.length === 0 ? (
        <div className="text-center py-20 space-y-4 bg-muted/30 rounded-[2rem] border-2 border-dashed border-muted">
          <Search className="w-16 h-16 mx-auto text-muted-foreground opacity-20" />
          <p className="text-xl text-muted-foreground">لم يتم العثور على امتحانات تطابق بحثك.</p>
        </div>
      ) : (
        <div className={cn(
          "grid gap-8",
          viewMode === 'grid' ? "md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
        )}>
          {filteredExams.map((exam) => (
            <ExamCard key={exam.id} exam={exam} onEnterExam={handleEnterExam} />
          ))}
        </div>
      )}
    </div>
  );
}
