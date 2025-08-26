
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { translateText, type TranslatorInput } from '@/ai/flows/translator-flow';
import { Languages, Loader2 } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import type { Language } from '@/context/language-provider';

export default function TranslatorPage() {
  const { language, setLanguage } = useLanguage();
  const [textToTranslate, setTextToTranslate] = useState('');
  const [targetLanguage, setTargetLanguage] = useState<Language>(language);
  const [translatedText, setTranslatedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setTargetLanguage(language);
  }, [language]);

  const handleLanguageChange = (value: string) => {
    const newLang = value as Language;
    setTargetLanguage(newLang);
    setLanguage(newLang);
  };

  const handleTranslate = async () => {
    if (!textToTranslate.trim()) return;
    setIsLoading(true);
    setTranslatedText('');

    try {
      const input: TranslatorInput = {
        text: textToTranslate,
        targetLanguage: targetLanguage,
      };
      const result = await translateText(input);
      setTranslatedText(result.translatedText);
    } catch (error) {
      console.error('Translation error:', error);
      setTranslatedText('Sorry, something went wrong during translation.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Languages className="h-8 w-8 text-primary" />
        <h1 className="text-4xl font-bold font-headline">Text Translator</h1>
      </div>
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Translate Text</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid w-full gap-2">
            <Label htmlFor="text-to-translate">Text to Translate</Label>
            <Textarea
              id="text-to-translate"
              placeholder="Enter text here..."
              value={textToTranslate}
              onChange={(e) => setTextToTranslate(e.target.value)}
              rows={6}
            />
          </div>

          <div className="grid w-full max-w-sm items-center gap-2">
            <Label htmlFor="target-language">Translate to</Label>
            <Select
              value={targetLanguage}
              onValueChange={handleLanguageChange}
            >
              <SelectTrigger id="target-language">
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="Russian">Russian</SelectItem>
                <SelectItem value="Tajik">Tajik</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleTranslate} disabled={isLoading || !textToTranslate.trim()}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Translating...
              </>
            ) : (
              'Translate'
            )}
          </Button>

          {translatedText && (
            <Card className="bg-muted">
              <CardHeader>
                <CardTitle className="text-lg">Translation Result</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{translatedText}</p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
