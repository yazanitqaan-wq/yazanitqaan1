-- 1. إنشاء جدول الطلاب (Students)
CREATE TABLE IF NOT EXISTS public.students (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  national_id TEXT NOT NULL UNIQUE,
  birth_date DATE NOT NULL,
  secret_code TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'student'
);

-- 2. إنشاء جدول الامتحانات (Exams)
CREATE TABLE IF NOT EXISTS public.exams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  duration INTEGER NOT NULL, -- بالدقائق
  is_active BOOLEAN DEFAULT false
);

-- 3. إنشاء جدول النتائج (Results)
CREATE TABLE IF NOT EXISTS public.results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  exam_id UUID REFERENCES public.exams(id) ON DELETE CASCADE,
  score NUMERIC NOT NULL,
  submitted_at TIMESTAMPTZ DEFAULT now()
);

-- 4. إدخال حساب الإدمن (الأستاذ يزن أبو كحيل)
INSERT INTO public.students (
  first_name, 
  last_name, 
  national_id, 
  birth_date, 
  secret_code, 
  password, 
  role
) VALUES (
  'يزن', 
  'أبو كحيل', 
  'admin', -- يمكنك تغيير الرقم الوطني للإدمن
  '1990-01-01', -- يمكنك تغيير تاريخ الميلاد
  'YAZAN-ADMIN', -- الكود السري للدخول
  'Admin@1234', -- كلمة المرور
  'admin'
) ON CONFLICT (national_id) DO NOTHING; -- لمنع التكرار إذا تم تشغيل الكود مرتين

-- 5. إعداد سياسات الأمان (RLS - Row Level Security)
-- تفعيل RLS على جميع الجداول
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.results ENABLE ROW LEVEL SECURITY;

-- سياسات جدول الطلاب: السماح بقراءة البيانات لعملية تسجيل الدخول
DROP POLICY IF EXISTS "Allow public read access to students" ON public.students;
CREATE POLICY "Allow public read access to students" ON public.students FOR SELECT USING (true);

-- سياسات جدول الامتحانات: السماح للجميع برؤية الامتحانات
DROP POLICY IF EXISTS "Allow public read access to exams" ON public.exams;
CREATE POLICY "Allow public read access to exams" ON public.exams FOR SELECT USING (true);

-- سياسات جدول النتائج: السماح بإضافة النتائج وقراءتها
DROP POLICY IF EXISTS "Allow public insert to results" ON public.results;
CREATE POLICY "Allow public insert to results" ON public.results FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read access to results" ON public.results;
CREATE POLICY "Allow public read access to results" ON public.results FOR SELECT USING (true);
