import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';
import { Menu, X, LogOut, User, Home, BookOpen, LayoutDashboard } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from './ui/button';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const student = authService.getCurrentStudent();
  const admin = authService.getCurrentAdmin();
  const user = student || admin;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const navLinks = [
    { name: 'الرئيسية', path: '/', icon: <Home className="w-4 h-4" /> },
    { name: 'الامتحانات', path: '/exams', icon: <BookOpen className="w-4 h-4" /> },
    { name: 'ملفي الشخصي', path: '/profile', icon: <User className="w-4 h-4" /> },
  ];

  if (admin) {
    navLinks.push({ name: 'لوحة التحكم', path: '/admin', icon: <LayoutDashboard className="w-4 h-4" /> });
  }

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 py-3",
      scrolled ? "bg-background/80 backdrop-blur-lg border-b shadow-sm" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-3 group" onClick={closeMenu}>
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <span className="text-primary-foreground font-serif font-bold text-2xl">Y</span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-xl text-foreground leading-none">أ. يزن أبو كحيل</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-sans">English Academy</span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {user && navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
                  location.pathname === link.path
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="hidden md:flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-xs font-bold text-foreground">{user.first_name} {user.last_name}</span>
                <span className="text-[10px] text-muted-foreground">{admin ? 'أستاذ' : 'طالب'}</span>
              </div>
              <Button variant="destructive" size="sm" onClick={handleLogout} className="rounded-xl gap-2">
                <LogOut className="w-4 h-4" />
                خروج
              </Button>
            </div>
          ) : (
            <Link to="/login" className="hidden md:block">
              <Button variant="default" className="rounded-xl px-6">تسجيل الدخول</Button>
            </Link>
          )}

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-xl bg-muted text-foreground hover:bg-muted/80 transition-colors"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={cn(
        "fixed inset-0 top-[72px] bg-background/95 backdrop-blur-xl z-40 md:hidden transition-all duration-300",
        isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"
      )}>
        <div className="p-6 space-y-4">
          {user && navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={closeMenu}
              className={cn(
                "flex items-center gap-4 p-4 rounded-2xl text-lg font-medium transition-all",
                location.pathname === link.path
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
          {!user && (
            <Link to="/login" onClick={closeMenu}>
              <Button className="w-full py-6 text-lg rounded-2xl">تسجيل الدخول</Button>
            </Link>
          )}
          {user && (
            <Button variant="destructive" className="w-full py-6 text-lg rounded-2xl gap-3" onClick={handleLogout}>
              <LogOut className="w-5 h-5" />
              تسجيل خروج
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
