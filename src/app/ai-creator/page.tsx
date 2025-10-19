
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { createContent, type ContentCreatorInput, type ContentCreatorOutput } from '@/ai/flows/content-creator-flow';
import { Loader2, PenSquare, Sparkles, Tag, FileText, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useData } from '@/hooks/use-data';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import type { Service } from '@/lib/types';
import Image from 'next/image';

type ImageMeta = {
    url: string;
    alt: string;
    caption: string;
}

export default function AICreatorPage() {
  const [prompt, setPrompt] = useState('');
  const [tone, setTone] = useState<'formal' | 'casual'>('casual');
  const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium');
  
  const [generatedContent, setGeneratedContent] = useState<ContentCreatorOutput | null>(null);
  const [editableTitle, setEditableTitle] = useState('');
  const [editableBody, setEditableBody] = useState('');
  const [editableTags, setEditableTags] = useState<string[]>([]);
  const [editableImages, setEditableImages] = useState<ImageMeta[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { addService, categories } = useData();
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
    setEditableImages([]);

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
      setEditableImages(result.meta.images);
    } catch (error) {
      console.error('Ошибка генерации контента:', error);
      setEditableBody('К сожалению, при генерации контента произошла ошибка. Пожалуйста, попробуйте еще раз.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePublish = () => {
    if (!generatedContent || !user) return;

    // A simple heuristic to pick a category based on tags
    const categoryName = categories.find(cat => editableTags.some(tag => cat.name.toLowerCase().includes(tag.toLowerCase())))?.name || categories[0]?.name || "General";

    const newService: Service = {
      id: `service-${Date.now()}`,
      title: editableTitle,
      description: generatedContent.meta.summary, // Using summary for short description
      category: categoryName,
      price: Math.floor(Math.random() * (200 - 50 + 1)) + 50, // Random price for demo
      images: editableImages.map(img => img.url),
      rating: 0,
      reviewsCount: 0,
      reviews: [],
      provider: {
        name: user.name,
        username: user.username,
        avatar: user.avatar,
      },
    };

    addService(newService);
    router.push(`/services/${newService.id}`);
  };

  const handleImageURLChange = (index: number, newUrl: string) => {
    const updatedImages = [...editableImages];
    updatedImages[index].url = newUrl;
    setEditableImages(updatedImages);
  }

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
                            className="min-h-[250px] leading-relaxed font-mono text-sm"
                            rows={10}
                        />
                    </div>
                     <div className="space-y-2">
                        <Label>Изображения</Label>
                        <div className="space-y-4">
                            {editableImages.map((image, index) => (
                                <div key={index} className="flex items-start gap-4">
                                    <div className="relative w-24 h-24 rounded-md overflow-hidden shrink-0">
                                        <Image src={image.url} alt={image.alt} fill className="object-cover" />
                                    </div>
                                    <div className="flex-grow space-y-2">
                                        <Input 
                                            value={image.url}
                                            onChange={(e) => handleImageURLChange(index, e.target.value)}
                                            placeholder="URL изображения"
                                        />
                                        <p className="text-xs text-muted-foreground px-2">{image.caption}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
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
                <Button onClick={handlePublish} disabled={!generatedContent}>Опубликовать как товар/услугу</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

    