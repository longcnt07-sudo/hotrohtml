import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { checkCode } from '@/src/lib/gemini';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Play, Sparkles, AlertCircle, CheckCircle2, Maximize2, Minimize2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';

export default function CodeChecker() {
  const [html, setHtml] = useState('<h1>Chào bạn!</h1>\n<p>Hãy thử viết code ở đây nhé.</p>');
  const [css, setCss] = useState('h1 {\n  color: #5a5a40;\n  text-align: center;\n}');
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [previewDoc, setPreviewDoc] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const doc = `
      <html>
        <head>
          <style>${css}</style>
        </head>
        <body>${html}</body>
      </html>
    `;
    setPreviewDoc(doc);
  }, [html, css]);

  const handleCheck = async () => {
    setIsLoading(true);
    const result = await checkCode(html, css);
    setFeedback(result || 'Không nhận được phản hồi từ AI.');
    setIsLoading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-12rem)]">
      <div className="flex flex-col gap-4">
        <Card className="flex-1 overflow-hidden border-warm-border">
          <CardHeader className="py-3 px-4 bg-slate-50 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-200">HTML</Badge>
                Cấu trúc trang web
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0 h-[300px]">
            <Editor
              height="100%"
              defaultLanguage="html"
              theme="vs-light"
              value={html}
              onChange={(value) => setHtml(value || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                scrollBeyondLastLine: false,
              }}
            />
          </CardContent>
        </Card>

        <Card className="flex-1 overflow-hidden border-warm-border">
          <CardHeader className="py-3 px-4 bg-slate-50 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">CSS</Badge>
                Trang trí giao diện
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0 h-[300px]">
            <Editor
              height="100%"
              defaultLanguage="css"
              theme="vs-light"
              value={css}
              onChange={(value) => setCss(value || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                scrollBeyondLastLine: false,
              }}
            />
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4">
        <Card className="flex-1 overflow-hidden border-warm-border">
          <CardHeader className="py-3 px-4 bg-slate-50 border-b flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Play className="w-4 h-4 text-green-600" />
              Kết quả hiển thị
            </CardTitle>
            <Button 
              size="sm" 
              onClick={handleCheck} 
              disabled={isLoading}
              className="bg-warm-accent hover:bg-warm-accent/90 text-white"
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                >
                  <Sparkles className="w-4 h-4" />
                </motion.div>
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              Kiểm tra lỗi với AI
            </Button>
          </CardHeader>
          <CardContent className="p-0 bg-white h-full">
            <iframe
              title="preview"
              srcDoc={previewDoc}
              className="w-full h-full border-none"
            />
          </CardContent>
        </Card>

        <AnimatePresence>
          {(isLoading || feedback) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                height: isExpanded ? 'auto' : '50%',
                zIndex: isExpanded ? 50 : 0
              }}
              exit={{ opacity: 0, y: 20 }}
              className={`transition-all duration-300 ${isExpanded ? 'absolute inset-x-0 bottom-0 top-0 m-4 sm:m-6 lg:m-8' : 'h-1/2'}`}
            >
              <Card className="h-full border-warm-border bg-warm-bg shadow-xl flex flex-col overflow-hidden">
                <CardHeader className="py-3 px-4 border-b flex flex-row items-center justify-between shrink-0 bg-white/50 backdrop-blur-sm">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-orange-500" />
                    Góp ý từ Thầy AI
                  </CardTitle>
                  {feedback && !isLoading && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="h-8 w-8 rounded-full"
                    >
                      {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="p-4 flex-1 overflow-hidden relative">
                  <ScrollArea className={`h-full pr-4 ${isExpanded ? 'max-h-full' : 'h-[200px]'}`}>
                    {isLoading ? (
                      <div className="space-y-3">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-[90%]" />
                        <Skeleton className="h-4 w-[95%]" />
                        <Skeleton className="h-4 w-[80%]" />
                        <Skeleton className="h-4 w-[85%]" />
                      </div>
                    ) : (
                      <div className="prose prose-sm max-w-none prose-slate animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <ReactMarkdown>{feedback}</ReactMarkdown>
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
