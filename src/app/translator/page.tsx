
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { translateText, type TranslatorInput } from '@/ai/flows/translator-flow';
import { Languages, Loader2, ChevronDown, Check } from 'lucide-react';

export default function TranslatorPage() {
  const [textToTranslate, setTextToTranslate] = useState('');
  const [targetLanguage, setTargetLanguage] = useState<'English' | 'Russian' | 'Tajik'>('English');
  const [translatedText, setTranslatedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLanguageChange = (value: string) => {
    setTargetLanguage(value as 'English' | 'Russian' | 'Tajik');
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
              <SelectTrigger
                id="target-language"
                className="relative group transition-all duration-300 hover:border-primary/70 hover:shadow-md"
              >
                <SelectValue
                  placeholder="Select a language"
                  className="text-foreground"
                />
              </SelectTrigger>
              <SelectContent className="border-0 shadow-lg bg-background animate-in fade-in-80">
                <SelectItem
                  value="English"
                  className="relative cursor-pointer transition-all duration-200
                           data-[highlighted]:bg-primary/10 data-[highlighted]:text-primary
                           data-[state=checked]:bg-primary/20 data-[state=checked]:text-primary
                           hover:bg-primary/5 rounded-md py-2 pl-8 pr-2"
                >
                  <span className="absolute left-2 flex items-center justify-center">
                    <Check className="h-4 w-4 opacity-0 data-[state=checked]:opacity-100 transition-opacity duration-200" />
                  </span>
                  English
                </SelectItem>
                <SelectItem
                  value="Russian"
                  className="relative cursor-pointer transition-all duration-200
                           data-[highlighted]:bg-primary/10 data-[highlighted]:text-primary
                           data-[state=checked]:bg-primary/20 data-[state=checked]:text-primary
                           hover:bg-primary/5 rounded-md py-2 pl-8 pr-2"
                >
                  <span className="absolute left-2 flex items-center justify-center">
                    <Check className="h-4 w-4 opacity-0 data-[state=checked]:opacity-100 transition-opacity duration-200" />
                  </span>
                  Russian
                </SelectItem>
                <SelectItem
                  value="Tajik"
                  className="relative cursor-pointer transition-all duration-200
                           data-[highlighted]:bg-primary/10 data-[highlighted]:text-primary
                           data-[state=checked]:bg-primary/20 data-[state=checked]:text-primary
                           hover:bg-primary/5 rounded-md py-2 pl-8 pr-2"
                >
                  <span className="absolute left-2 flex items-center justify-center">
                    <Check className="h-4 w-4 opacity-0 data-[state=checked]:opacity-100 transition-opacity duration-200" />
                  </span>
                  Tajik
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleTranslate}
            disabled={isLoading || !textToTranslate.trim()}
            className="transition-all duration-300 hover:scale-105 disabled:hover:scale-100"
          >
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
            <Card className="bg-muted border-0 shadow-lg transition-all duration-500 animate-in fade-in-500 slide-in-from-bottom-10">
              <CardHeader>
                <CardTitle className="text-lg">Translation Result</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/90 leading-relaxed">{translatedText}</p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-select-content {
          animation: slideIn 0.2s ease-out;
        }

        .select-item {
          transition: all 0.2s ease;
        }

        .select-item:hover {
          background-color: hsl(var(--primary) / 0.05);
        }

        .select-trigger:hover {
          border-color: hsl(var(--primary) / 0.7);
          box-shadow: 0 0 0 2px hsl(var(--primary) / 0.1);
        }
      `}</style>
    </div>
  );
}
