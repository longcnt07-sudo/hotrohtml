import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Code2, Info, Menu, X, FileText, Sparkles, Clock } from 'lucide-react';
import CodeChecker from './components/CodeChecker';
import Documents from './components/Documents';
import { motion, AnimatePresence } from 'motion/react';
import { Toaster } from '@/components/ui/sonner';
import { Progress } from '@/components/ui/progress';

export default function App() {
  const [activeTab, setActiveTab] = useState('checker');
  const [studySeconds, setStudySeconds] = useState(0);
  const DAILY_GOAL_MINUTES = 30;

  useEffect(() => {
    const timer = setInterval(() => {
      setStudySeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (hours > 0) {
      return `${hours} giờ ${minutes} phút`;
    }
    if (minutes > 0) {
      return `${minutes} phút ${seconds} giây`;
    }
    return `${seconds} giây`;
  };

  const progressPercentage = Math.min((studySeconds / (DAILY_GOAL_MINUTES * 60)) * 100, 100);

  return (
    <div className="min-h-screen bg-warm-bg flex flex-col font-sans">
      <Toaster position="top-center" />
      {/* Header */}
      <header className="bg-white border-b border-warm-border sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="w-10 h-10 bg-warm-accent rounded-xl flex items-center justify-center text-white shadow-lg shadow-warm-accent/20"
            >
              <Code2 className="w-6 h-6" />
            </motion.div>
            <div>
              <h1 className="text-xl font-serif font-bold text-slate-900 leading-tight">
                Học Lập Trình Web
              </h1>
              <p className="text-[10px] text-slate-400 font-bold tracking-[0.2em] uppercase">
                Hỗ trợ học sinh dân tộc thiểu số
              </p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6">
              <button className="text-sm font-medium text-slate-500 hover:text-warm-accent transition-colors">Hướng dẫn</button>
              <button 
                onClick={() => setActiveTab('documents')}
                className={`text-sm font-medium transition-colors ${activeTab === 'documents' ? 'text-warm-accent' : 'text-slate-500 hover:text-warm-accent'}`}
              >
                Tài liệu
              </button>
            </div>
            <div className="h-6 w-px bg-warm-border" />
            <div className="flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-full border border-warm-border">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                L
              </div>
              <span className="text-sm font-semibold text-slate-700">Chào, bạn Long!</span>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <TabsList className="bg-white/50 backdrop-blur-sm border border-warm-border p-1 h-14 rounded-xl shadow-sm">
              <TabsTrigger 
                value="checker" 
                className="data-[state=active]:bg-warm-accent data-[state=active]:text-white data-[state=active]:shadow-md px-8 h-12 rounded-lg transition-all font-medium"
              >
                <Code2 className="w-4 h-4 mr-2" />
                Kiểm tra mã nguồn
              </TabsTrigger>
              <TabsTrigger 
                value="documents" 
                className="data-[state=active]:bg-warm-accent data-[state=active]:text-white data-[state=active]:shadow-md px-8 h-12 rounded-lg transition-all font-medium"
              >
                <FileText className="w-4 h-4 mr-2" />
                Tài liệu học tập
              </TabsTrigger>
            </TabsList>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4 text-sm text-slate-600 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-2xl border border-warm-border shadow-sm min-w-[300px]"
            >
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-end mb-1">
                  <p className="font-bold text-slate-900 leading-none">Tiến độ hôm nay</p>
                  <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                    {Math.round(progressPercentage)}%
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-2">Bạn đã học được: <span className="font-semibold text-slate-700">{formatTime(studySeconds)}</span></p>
                <Progress value={progressPercentage} className="h-1.5 bg-slate-100" />
              </div>
            </motion.div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <TabsContent value="checker" className="m-0 focus-visible:outline-none">
                <CodeChecker />
              </TabsContent>
              <TabsContent value="documents" className="m-0 focus-visible:outline-none">
                <Documents />
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-warm-border py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="text-left">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-warm-accent rounded-lg flex items-center justify-center text-white">
                  <Code2 className="w-5 h-5" />
                </div>
                <span className="font-serif font-bold text-lg">Học Lập Trình Web</span>
              </div>
              <p className="text-sm text-slate-400 max-w-xs">
                Sứ mệnh của chúng tôi là mang kiến thức công nghệ đến với mọi học sinh, không để ai bị bỏ lại phía sau.
              </p>
            </div>
            <div className="flex justify-center gap-8">
              <a href="#" className="text-sm text-slate-500 hover:text-warm-accent transition-colors">Về dự án</a>
              <a href="#" className="text-sm text-slate-500 hover:text-warm-accent transition-colors">Cộng đồng</a>
              <a href="#" className="text-sm text-slate-500 hover:text-warm-accent transition-colors">Hỗ trợ</a>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500 mb-2">© 2025 Dự án hỗ trợ học sinh lập trình HTML & CSS</p>
              <div className="flex justify-end gap-4">
                <a href="#" className="text-xs text-slate-400 hover:text-warm-accent">Điều khoản</a>
                <a href="#" className="text-xs text-slate-400 hover:text-warm-accent">Bảo mật</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
