'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { createContent, type ContentCreatorInput, type ContentCreatorOutput } from '@/ai/flows/content-creator-flow';
import { Loader2, PenSquare, Sparkles, Tag, FileText } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';

export default function AICreatorPage() {
  const [prompt, setPrompt] = useState('');
  const [tone, setTone] = useState<'formal' | 'casual'>('casual');
  const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium');
  
  const [generatedContent, setGeneratedContent] = useState<ContentCreatorOutput | null>(null);
  const [editableTitle, setEditableTitle] = useState('');
  const [editableBody, setEditableBody] = useState('');
  const [editableTags, setEditableTags] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  if (!user) {
    router.push('/login');
    return null;
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setGeneratedContent(null);
    setEditableTitle('');
    setEditableBody('');
    setEditableTags([]);

    try {
      const input: ContentCreatorInput = {
        prompt,
        tone,
        length,
      };
      const result = await createContent(input);
      setGeneratedContent(result);
      setEditableTitle(result.meta.title);
      setEditableBody(result.markdown);
      setEditableTags(result.meta.tags);
    } catch (error) {
      console.error('Ошибка генерации контента:', error);
      setEditableBody('К сожалению, при генерации контента произошла ошибка. Пожалуйста, попробуйте еще раз.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePublish = () => {
      // Placeholder for publish logic as per user request
      alert('Функция публикации с реальным бэкендом еще не реализована.');
  };

  return (
    <div className="container mx-auto px-4 py-8">
       <div className="flex items-center gap-4 mb-8">
        <PenSquare className="h-8 w-8 text-primary" />
        <h1 className="text-4xl font-bold font-headline">AI-Контент</h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Control Panel */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Генератор контента</CardTitle>
              <CardDescription>Опишите контент, который вы хотите создать.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="prompt">Промпт</Label>
                <Textarea
                  id="prompt"
                  placeholder="например, пост в блоге о преимуществах удаленной работы"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tone">Тон</Label>
                <Select value={tone} onValueChange={(v) => setTone(v as any)}>
                  <SelectTrigger id="tone">
                    <SelectValue placeholder="Выберите тон" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="casual">Неформальный</SelectItem>
                    <SelectItem value="formal">Формальный</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="length">Длина</Label>
                <Select value={length} onValueChange={(v) => setLength(v as any)}>
                  <SelectTrigger id="length">
                    <SelectValue placeholder="Выберите длину" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Короткий</SelectItem>
                    <SelectItem value="medium">Средний</SelectItem>
                    <SelectItem value="long">Длинный</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleGenerate} disabled={isLoading || !prompt.trim()} className="w-full">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                {isLoading ? 'Генерация...' : 'Сгенерировать контент'}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Editor/Preview */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Сгенерированный контент</CardTitle>
              <CardDescription>Просмотрите и отредактируйте сгенерированный AI контент ниже.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading && (
                  <div className="flex flex-col items-center justify-center h-96 rounded-lg bg-muted">
                    <Loader2 className="h-12 w-12 text-primary animate-spin mb-4"/>
                    <p className="text-lg text-muted-foreground">Генерируем ваш контент...</p>
                  </div>
              )}
              {!isLoading && !generatedContent && (
                   <div className="flex flex-col items-center justify-center h-96 rounded-lg bg-muted/50">
                    <FileText className="h-12 w-12 text-muted-foreground/50 mb-4"/>
                    <p className="text-lg text-muted-foreground">Ваш сгенерированный контент появится здесь.</p>
                  </div>
              )}
              {generatedContent && !isLoading && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="generated-title">Заголовок</Label>
                        <Input 
                            id="generated-title"
                            value={editableTitle}
                            onChange={(e) => setEditableTitle(e.target.value)}
                            className="text-2xl font-bold font-headline h-auto p-2"
                        />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="generated-body">Тело (Markdown)</Label>
                        <Textarea 
                            id="generated-body"
                            value={editableBody}
                            onChange={(e) => setEditableBody(e.target.value)}
                            className="min-h-[400px] leading-relaxed font-mono text-sm"
                            rows={15}
                        />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="generated-tags">Теги</Label>
                        <div className="flex flex-wrap gap-2">
                          {editableTags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="flex items-center gap-1">
                              <Tag className="h-3 w-3" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <Input
                          id="generated-tags"
                          value={editableTags.join(', ')}
                          onChange={(e) => setEditableTags(e.target.value.split(',').map(t => t.trim()))}
                          placeholder="тег1, тег2, тег3"
                        />
                    </div>
                  </div>
              )}
            </CardContent>
            <CardFooter>
                <Button onClick={handlePublish} disabled={!generatedContent}>Опубликовать</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
