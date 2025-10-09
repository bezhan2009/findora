
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
      console.error('Content generation error:', error);
      setEditableBody('Sorry, something went wrong while generating content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePublish = () => {
      // Placeholder for publish logic as per user request
      alert('Publish functionality with a real backend is not yet implemented.');
  };

  return (
    <div className="container mx-auto px-4 py-8">
       <div className="flex items-center gap-4 mb-8">
        <PenSquare className="h-8 w-8 text-primary" />
        <h1 className="text-4xl font-bold font-headline">AI Content Creator</h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Control Panel */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Content Generator</CardTitle>
              <CardDescription>Describe the content you want to create.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="prompt">Prompt</Label>
                <Textarea
                  id="prompt"
                  placeholder="e.g., A blog post about the benefits of remote work"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tone">Tone</Label>
                <Select value={tone} onValueChange={(v) => setTone(v as any)}>
                  <SelectTrigger id="tone">
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="formal">Formal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="length">Length</Label>
                <Select value={length} onValueChange={(v) => setLength(v as any)}>
                  <SelectTrigger id="length">
                    <SelectValue placeholder="Select length" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Short</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="long">Long</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleGenerate} disabled={isLoading || !prompt.trim()} className="w-full">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                {isLoading ? 'Generating...' : 'Generate Content'}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Editor/Preview */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Generated Content</CardTitle>
              <CardDescription>Review and edit the AI-generated content below.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading && (
                  <div className="flex flex-col items-center justify-center h-96 rounded-lg bg-muted">
                    <Loader2 className="h-12 w-12 text-primary animate-spin mb-4"/>
                    <p className="text-lg text-muted-foreground">Generating your content...</p>
                  </div>
              )}
              {!isLoading && !generatedContent && (
                   <div className="flex flex-col items-center justify-center h-96 rounded-lg bg-muted/50">
                    <FileText className="h-12 w-12 text-muted-foreground/50 mb-4"/>
                    <p className="text-lg text-muted-foreground">Your generated content will appear here.</p>
                  </div>
              )}
              {generatedContent && !isLoading && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="generated-title">Title</Label>
                        <Input 
                            id="generated-title"
                            value={editableTitle}
                            onChange={(e) => setEditableTitle(e.target.value)}
                            className="text-2xl font-bold font-headline h-auto p-2"
                        />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="generated-body">Body (Markdown)</Label>
                        <Textarea 
                            id="generated-body"
                            value={editableBody}
                            onChange={(e) => setEditableBody(e.target.value)}
                            className="min-h-[400px] leading-relaxed font-mono text-sm"
                            rows={15}
                        />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="generated-tags">Tags</Label>
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
                          placeholder="tag1, tag2, tag3"
                        />
                    </div>
                  </div>
              )}
            </CardContent>
            <CardFooter>
                <Button onClick={handlePublish} disabled={!generatedContent}>Publish</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
