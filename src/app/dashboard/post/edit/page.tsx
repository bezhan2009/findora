"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { useData } from "@/hooks/use-data";
import { ImagePlus, Loader2 } from "lucide-react";
import type { Post } from "@/lib/types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import dynamic from "next/dynamic";

const formSchema = z.object({
  type: z.enum(["photo", "video"], { required_error: "Выберите тип поста." }),
  media: z.any(),
  url: z.string().optional(),
  caption: z.string().max(280, "Подпись не может превышать 280 символов."),
}).refine(data => data.type === 'video' ? !!data.url : !!data.media, {
  message: "Для видео требуется URL, для фото - файл.",
  path: ["media"],
});

function EditPostPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { addPost } = useData();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "photo",
      url: "",
      caption: "",
    },
  });

  const { isSubmitting } = form.formState;
  const postType = form.watch("type");

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) return;

    let mediaUrl = '';
    if (values.type === 'video') {
        mediaUrl = values.url || '';
    } else if (values.media && values.media.length > 0) {
        const file = values.media[0] as File;
        mediaUrl = URL.createObjectURL(file);
    }
    
    const newPost: Post = {
      id: `post-${Date.now()}`,
      type: values.type,
      url: mediaUrl,
      caption: values.caption,
      likes: 0,
      comments: [],
    };

    addPost(user.username, newPost);
    router.push(`/profile/${user.username}`);
  }
  
  const mediaRef = {...form.register("media")};

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
             <div className="flex items-center gap-4 mb-2">
                <ImagePlus className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold font-headline">Создать новый пост</h1>
            </div>
            <CardDescription>
              Поделитесь изображением или видео со своими подписчиками.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Тип поста</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex space-x-4"
                        >
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="photo" />
                            </FormControl>
                            <FormLabel className="font-normal">Фото</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="video" />
                            </FormControl>
                            <FormLabel className="font-normal">Видео (YouTube)</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {postType === 'video' ? (
                     <FormField
                      control={form.control}
                      name="url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL видео (YouTube)</FormLabel>
                          <FormControl>
                            <Input placeholder="https://www.youtube.com/watch?v=..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                ) : (
                    <FormField
                      control={form.control}
                      name="media"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Файл изображения</FormLabel>
                          <FormControl>
                            <Input type="file" accept="image/*" {...mediaRef} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                )}
                <FormField
                  control={form.control}
                  name="caption"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Подпись</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Что у вас на уме?" rows={4} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Опубликовать пост
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default dynamic(() => Promise.resolve(EditPostPage), { ssr: false });
