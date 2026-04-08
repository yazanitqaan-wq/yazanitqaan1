import React, { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import GetInfoModal from '../components/GetInfoModal';
import { KeyRound, Lock, UserCircle2, GraduationCap, UserCog, ArrowLeft } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

export default function Login() {
  const [loginType, setLoginType] = useState<'student' | 'teacher'>('student');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  if (authService.getCurrentStudent() || authService.getCurrentAdmin()) {
    return <Navigate to="/" replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (loginType === 'student') {
      const { student, error: loginError } = await authService.login(identifier, password);
      if (loginError) {
        setError(loginError);
        setLoading(false);
      } else if (student) {
        navigate('/');
      }
    } else {
      const { admin, error: loginError } = await authService.loginAdmin(identifier, password);
      if (loginError) {
        setError(loginError);
        setLoading(false);
      } else if (admin) {
        navigate('/');
      }
    }
  };

  const handleCredentialsFound = (code: string, pass: string) => {
    setLoginType('student');
    setIdentifier(code);
    setPassword(pass);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side: Image/Branding */}
      <div className="hidden lg:flex flex-col justify-between p-12 hero-gradient text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-secondary-foreground font-serif font-bold text-3xl">Y</span>
            </div>
            <span className="font-serif font-bold text-2xl tracking-tight">أكاديمية يزن أبو كحيل</span>
          </div>
          
          <div className="space-y-6 max-w-lg">
            <h1 className="text-6xl font-serif font-bold leading-tight">مستقبلك يبدأ بكلمة واحدة.</h1>
            <p className="text-xl text-white/70 font-light leading-relaxed">
              انضم إلى مئات الطلاب الذين حققوا التميز في اللغة الإنجليزية من خلال نظامنا التعليمي المبتكر.
            </p>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-8 text-sm text-white/50 uppercase tracking-widest font-medium">
          <span>English</span>
          <div className="w-1 h-1 bg-white/30 rounded-full" />
          <span>Exams</span>
          <div className="w-1 h-1 bg-white/30 rounded-full" />
          <span>Success</span>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden flex justify-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-xl">
              <span className="text-primary-foreground font-serif font-bold text-4xl">Y</span>
            </div>
          </div>

          <Card className="border-0 shadow-2xl rounded-[2.5rem] overflow-hidden bg-white dark:bg-slate-900">
            <CardHeader className="space-y-2 text-center pt-10">
              <CardTitle className="text-3xl font-serif font-bold">مرحباً بك مجدداً</CardTitle>
              <CardDescription className="text-base">
                {loginType === 'student' ? 'أدخل بياناتك للوصول للامتحانات' : 'لوحة تحكم المعلم'}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              <Tabs defaultValue="student" className="w-full mb-8" onValueChange={(v) => setLoginType(v as any)}>
                <TabsList className="grid w-full grid-cols-2 h-12 rounded-xl bg-muted p-1">
                  <TabsTrigger value="student" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">طالب</TabsTrigger>
                  <TabsTrigger value="teacher" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">أستاذ</TabsTrigger>
                </TabsList>
              </Tabs>

              <form onSubmit={handleLogin} className="space-y-6">
                {error && (
                  <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center font-medium animate-shake">
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="identifier" className="mr-1 text-sm font-semibold text-foreground/70">
                      {loginType === 'student' ? 'الكود السري' : 'اسم المستخدم'}
                    </Label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                        {loginType === 'student' ? <KeyRound className="h-5 w-5" /> : <UserCircle2 className="h-5 w-5" />}
                      </div>
                      <Input
                        id="identifier"
                        type="text"
                        required
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        className="h-14 pr-12 rounded-2xl border-muted bg-muted/30 focus:bg-white transition-all text-lg"
                        placeholder={loginType === 'student' ? 'أدخل الكود السري' : 'اسم المستخدم'}
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="mr-1 text-sm font-semibold text-foreground/70">كلمة المرور</Label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                        <Lock className="h-5 w-5" />
                      </div>
                      <Input
                        id="password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-14 pr-12 rounded-2xl border-muted bg-muted/30 focus:bg-white transition-all text-lg"
                        placeholder="••••••••"
                        dir="ltr"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <Button type="submit" disabled={loading} className="w-full h-14 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 transition-all active:scale-[0.98]">
                    {loading ? 'جاري الدخول...' : 'تسجيل الدخول'}
                  </Button>
                  
                  {loginType === 'student' && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setIsModalOpen(true)}
                      className="w-full h-12 rounded-2xl text-muted-foreground hover:text-primary hover:bg-primary/5"
                    >
                      نسيت بياناتك؟ استرجعها هنا
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="text-center">
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="w-4 h-4" />
              العودة للرئيسية
            </Link>
          </div>
        </div>
      </div>

      <GetInfoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCredentialsFound={handleCredentialsFound}
      />
    </div>
  );
}
