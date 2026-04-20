import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Download, 
  ExternalLink, 
  Book, 
  X,
  ChevronLeft,
  Printer,
  Upload,
  Trash2
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

const DOCUMENTS = [
  {
    id: 1,
    title: 'Cẩm nang HTML cơ bản',
    description: 'Tài liệu tổng hợp các thẻ HTML quan trọng nhất cho người mới bắt đầu.',
    type: 'PDF',
    topic: 'HTML',
    size: '1.2 MB',
    content: `
# Cẩm nang HTML cơ bản

## 1. Giới thiệu về HTML
HTML (HyperText Markup Language) là ngôn ngữ đánh dấu siêu văn bản, được sử dụng để tạo cấu trúc cho các trang web.

## 2. Cấu trúc cơ bản của một trang HTML
Mọi trang web đều bắt đầu với cấu trúc này:
\`\`\`html
<!DOCTYPE html>
<html>
<head>
    <title>Tiêu đề trang web</title>
</head>
<body>
    <h1>Chào mừng đến với thế giới lập trình!</h1>
    <p>Đây là đoạn văn đầu tiên của bạn.</p>
</body>
</html>
\`\`\`

## 3. Các thẻ HTML phổ biến
- **Tiêu đề (Headings):** \`<h1>\` đến \`<h6>\`
- **Đoạn văn (Paragraph):** \`<p>\`
- **Liên kết (Link):** \`<a href="url">Nội dung</a>\`
- **Hình ảnh (Image):** \`<img src="duong-dan-anh.jpg" alt="mo-ta-anh">\`
- **Danh sách (List):** \`<ul>\`, \`<ol>\`, \`<li>\`

## 4. Lời khuyên cho người mới
Hãy luôn đóng các thẻ của bạn và sử dụng các thẻ có ý nghĩa (semantic tags) để trình duyệt và công cụ tìm kiếm hiểu rõ hơn về trang web của bạn.
    `
  },
  {
    id: 2,
    title: 'CSS Cheat Sheet',
    description: 'Bảng tra cứu nhanh các thuộc tính CSS phổ biến và cách dùng.',
    type: 'PDF',
    topic: 'CSS',
    size: '0.8 MB',
    content: `
# CSS Cheat Sheet - Tra cứu nhanh

## 1. Cách nhúng CSS
- **Inline:** \`<h1 style="color: blue;">\`
- **Internal:** Trong thẻ \`<style>\` ở \`<head>\`
- **External:** Sử dụng thẻ \`<link rel="stylesheet" href="style.css">\`

## 2. Các Selector cơ bản
- **Thẻ:** \`p { color: red; }\`
- **Class:** \`.my-class { font-size: 16px; }\`
- **ID:** \`#my-id { background: yellow; }\`

## 3. Các thuộc tính phổ biến
- **Màu sắc:** \`color\`, \`background-color\`
- **Font:** \`font-family\`, \`font-size\`, \`font-weight\`
- **Box Model:** \`margin\`, \`padding\`, \`border\`, \`width\`, \`height\`
- **Bố cục:** \`display\`, \`position\`, \`flex\`, \`grid\`

## 4. Đơn vị trong CSS
- **Tuyệt đối:** \`px\`, \`pt\`
- **Tương đối:** \`%\`, \`em\`, \`rem\`, \`vw\`, \`vh\`
    `
  },
  {
    id: 3,
    title: 'Hướng dẫn xây dựng trang web đầu tiên',
    description: 'Từng bước tạo ra một trang giới thiệu bản thân đơn giản.',
    type: 'DOCX',
    topic: 'HTML',
    size: '2.5 MB',
    content: `
# Xây dựng trang web đầu tiên của bạn

Chào mừng bạn đến với bài hướng dẫn thực hành! Hôm nay chúng ta sẽ cùng nhau tạo một trang "Giới thiệu bản thân".

## Bước 1: Chuẩn bị cấu trúc (HTML)
Hãy tạo một file \`index.html\` và thêm các thông tin sau:
- Tên của bạn trong thẻ \`<h1>\`
- Một đoạn giới thiệu ngắn trong thẻ \`<p>\`
- Sở thích của bạn trong một danh sách \`<ul>\`

## Bước 2: Làm đẹp (CSS)
Tạo file \`style.css\` để:
- Thay đổi màu nền của trang web.
- Căn giữa nội dung.
- Đổi font chữ cho dễ nhìn hơn.

## Bước 3: Kiểm tra
Mở file \`index.html\` bằng trình duyệt để xem thành quả của bạn!

## Thử thách thêm:
Hãy thử thêm một hình ảnh của bạn hoặc một tấm ảnh phong cảnh mà bạn yêu thích vào trang web nhé.
    `
  },
];

export default function Documents() {
  const [selectedDoc, setSelectedDoc] = useState<any | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'reader'>('grid');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterTopic, setFilterTopic] = useState<string>('all');
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadingIds, setDownloadingIds] = useState<Set<number>>(new Set());

  // Load uploaded docs from localStorage
  const [uploadedDocs, setUploadedDocs] = useState<any[]>(() => {
    const saved = localStorage.getItem('uploaded_documents');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('uploaded_documents', JSON.stringify(uploadedDocs));
  }, [uploadedDocs]);

  const allDocuments = [...DOCUMENTS, ...uploadedDocs];

  const filteredDocuments = allDocuments.filter(doc => {
    const matchesType = filterType === 'all' || doc.type === filterType;
    const matchesTopic = filterTopic === 'all' || (doc.topic && doc.topic === filterTopic) || (doc.isUploaded && filterTopic === 'Khác');
    return matchesType && matchesTopic;
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const newDoc = {
        id: Date.now(),
        title: file.name,
        description: `Tài liệu tải lên vào ${new Date().toLocaleDateString('vi-VN')}`,
        type: file.name.split('.').pop()?.toUpperCase() || 'FILE',
        topic: 'Khác',
        size: `${(file.size / 1024).toFixed(1)} KB`,
        content: content,
        isUploaded: true
      };
      setUploadedDocs(prev => [newDoc, ...prev]);
      toast.success(`Đã tải lên tệp: ${file.name}`);
    };
    reader.readAsText(file);
    // Reset input
    event.target.value = '';
  };

  const deleteUploadedDoc = (id: number) => {
    setUploadedDocs(prev => prev.filter(doc => doc.id !== id));
    toast.info("Đã xóa tài liệu tải lên.");
  };

  const handleDownloadAll = () => {
    if (isDownloadingAll) return;
    
    setIsDownloadingAll(true);
    setDownloadProgress(0);
    
    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsDownloadingAll(false);
            toast.success("Đã tải xuống tất cả tài liệu thành công!");
          }, 500);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const handleDownloadIndividual = (id: number, title: string) => {
    if (downloadingIds.has(id)) return;
    
    setDownloadingIds(prev => new Set(prev).add(id));
    
    // Simulate download
    setTimeout(() => {
      setDownloadingIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      toast.success(`Đã tải xuống: ${title}`);
    }, 1500);
  };

  const openReader = (doc: any) => {
    setSelectedDoc(doc);
    setViewMode('reader');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeReader = () => {
    setViewMode('grid');
    setSelectedDoc(null);
  };

  if (viewMode === 'reader' && selectedDoc) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-warm-border shadow-sm">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={closeReader}
              className="rounded-full hover:bg-slate-100"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-serif font-bold text-slate-900 leading-tight">{selectedDoc.title}</h2>
                <p className="text-xs text-slate-500">Định dạng: {selectedDoc.type} • {selectedDoc.size}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="border-slate-200" onClick={() => window.print()}>
              <Printer className="w-4 h-4 mr-2" />
              In tài liệu
            </Button>
            <Button 
              onClick={() => handleDownloadIndividual(selectedDoc.id, selectedDoc.title)}
              className="bg-warm-accent hover:bg-warm-accent/90 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Tải về máy
            </Button>
          </div>
        </div>

        <div className="bg-white p-8 md:p-16 shadow-sm border border-warm-border rounded-xl min-h-[600px]">
          <div className="max-w-3xl mx-auto">
            <div className="prose prose-slate max-w-none prose-headings:font-serif prose-headings:text-slate-900 prose-p:text-slate-700 prose-li:text-slate-700 prose-code:bg-slate-100 prose-code:p-1 prose-code:rounded prose-pre:bg-slate-900 prose-pre:text-slate-100">
              <ReactMarkdown>{selectedDoc.content}</ReactMarkdown>
            </div>
          </div>
        </div>

        <div className="flex justify-center py-8">
          <Button 
            variant="outline" 
            onClick={closeReader}
            className="border-warm-border text-slate-500 hover:bg-slate-50"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Quay lại danh sách
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif text-warm-accent">Tài liệu học tập</h2>
          <p className="text-slate-500">Xem trực tuyến hoặc tải về các tài liệu hướng dẫn chi tiết về HTML & CSS.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".txt,.md,.html,.css,.js"
              onChange={handleFileUpload}
            />
            <Button 
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="border-warm-accent text-warm-accent hover:bg-warm-accent hover:text-white"
            >
              <Upload className="w-4 h-4 mr-2" />
              Tải lên tài liệu
            </Button>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Button 
              onClick={handleDownloadAll}
              disabled={isDownloadingAll}
              className="bg-warm-accent hover:bg-warm-accent/90 text-white shadow-sm min-w-[200px]"
            >
              {isDownloadingAll ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="mr-2"
                >
                  <Download className="w-4 h-4" />
                </motion.div>
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              {isDownloadingAll ? `Đang nén... ${downloadProgress}%` : 'Tải tất cả tài liệu (.zip)'}
            </Button>
            <AnimatePresence>
              {isDownloadingAll && (
                <motion.div 
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "100%" }}
                  exit={{ opacity: 0 }}
                  className="w-full"
                >
                  <Progress value={downloadProgress} className="h-1 bg-slate-100" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-xl border border-warm-border shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-slate-500">Loại tệp:</span>
          <div className="flex bg-slate-50 p-1 rounded-lg border border-slate-100">
            {['all', 'PDF', 'DOCX'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${filterType === type ? 'bg-white text-warm-accent shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {type === 'all' ? 'Tất cả' : type}
              </button>
            ))}
          </div>
        </div>
        <div className="h-6 w-px bg-slate-100 hidden sm:block" />
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-slate-500">Chủ đề:</span>
          <div className="flex bg-slate-50 p-1 rounded-lg border border-slate-100">
            {['all', 'HTML', 'CSS', 'Khác'].map((topic) => (
              <button
                key={topic}
                onClick={() => setFilterTopic(topic)}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${filterTopic === topic ? 'bg-white text-warm-accent shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {topic === 'all' ? 'Tất cả' : topic}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocuments.map((doc) => (
          <Card key={doc.id} className="border-warm-border hover:shadow-lg transition-all group bg-white relative">
            {doc.isUploaded && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteUploadedDoc(doc.id)}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-red-500 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
            <CardHeader className="pb-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 shadow-sm ${doc.isUploaded ? 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white' : 'bg-orange-50 text-orange-600 group-hover:bg-warm-accent group-hover:text-white'}`}>
                <FileText className="w-7 h-7" />
              </div>
              <CardTitle className="text-xl font-serif text-slate-900">{doc.title}</CardTitle>
              <CardDescription className="line-clamp-2 text-slate-500 mt-2">{doc.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-xs font-medium text-slate-400 mb-6 bg-slate-50 p-2 rounded-lg">
                <span className="flex items-center gap-1.5">
                  <Book className="w-3.5 h-3.5" />
                  {doc.type}
                </span>
                <span>{doc.size}</span>
              </div>
              <div className="flex gap-3">
                <Button 
                  onClick={() => openReader(doc)}
                  variant="outline" 
                  size="sm" 
                  className="flex-1 border-warm-border text-warm-accent hover:bg-warm-accent hover:text-white transition-colors"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Đọc nội dung
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => handleDownloadIndividual(doc.id, doc.title)}
                  disabled={downloadingIds.has(doc.id)}
                  className="bg-slate-100 text-slate-600 hover:bg-slate-200 border-none px-3 relative overflow-hidden"
                >
                  {downloadingIds.has(doc.id) ? (
                    <motion.div
                      animate={{ y: [0, -20, 20, 0] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                    >
                      <Download className="w-4 h-4" />
                    </motion.div>
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-warm-border bg-warm-bg/30 border-dashed">
        <CardContent className="p-10 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Book className="w-6 h-6 text-warm-accent" />
            </div>
            <h3 className="text-xl font-serif mb-3 text-slate-900">Bạn cần thêm tài liệu khác?</h3>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              Nếu bạn đang tìm kiếm một chủ đề cụ thể chưa có ở đây, hãy nhắn tin cho Thầy AI để được hỗ trợ biên soạn tài liệu mới nhé!
            </p>
            <Button variant="outline" className="border-warm-accent text-warm-accent hover:bg-warm-accent hover:text-white">Gửi yêu cầu tài liệu</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
