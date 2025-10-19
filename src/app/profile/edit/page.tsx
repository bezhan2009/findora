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
import { Loader2, UserCog } from "lucide-react";
import { useEffect } from "react";

const formSchema = z.object({
  name: z.string().min(2, "Имя должно содержать не менее 2 символов."),
  username: z.string().min(3, "Имя пользователя должно содержать не менее 3 символов."),
  avatar: z.string().url("Введите действительный URL аватара.").optional().or(z.literal('')),
  location: z.string().min(2, "Местоположение должно содержать не менее 2 символов."),
  bio: z.string().max(300, "Биография не может превышать 300 символов.").optional(),
  instagram: z.string().url().optional().or(z.literal('')),
  linkedin: z.string().url().optional().or(z.literal('')),
  website: z.string().url().optional().or(z.literal('')),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
});

export default function EditProfilePage() {
  const router = useRouter();
  const { user } = useAuth();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      username: "",
      avatar: "",
      location: "",
      bio: "",
      instagram: "",
      linkedin: "",
      website: "",
      email: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        username: user.username,
        avatar: user.avatar,
        location: user.location,
        bio: user.bio,
        instagram: user.socials?.instagram || "",
        linkedin: user.socials?.linkedin || "",
        website: user.socials?.website || "",
        email: user.socials?.email || "",
        phone: user.socials?.phone || "",
      });
    }
  }, [user, form]);

  const { isSubmitting } = form.formState;

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) return;
    
    console.log("Сохраненные данные профиля:", values);
    // Здесь будет логика обновления данных пользователя
    // Для демонстрации, мы просто перенаправляем обратно в профиль
    router.push(`/profile/${user.username}`);
  }

  if (!user) {
    return <div className="container mx-auto px-4 py-8 text-center">Загрузка...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
             <div className="flex items-center gap-4 mb-2">
                <UserCog className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold font-headline">Редактировать профиль</h1>
            </div>
            <CardDescription>
              Обновите вашу общедоступную информацию.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Имя</FormLabel>
                        <FormControl>
                            <Input placeholder="Ваше полное имя" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Имя пользователя</FormLabel>
                        <FormControl>
                            <Input placeholder="Ваш @никнейм" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
                 <FormField
                  control={form.control}
                  name="avatar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL Аватара</FormLabel>
                      <FormControl>
                        <Input placeholder="https://images.unsplash.com/..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Местоположение</FormLabel>
                      <FormControl>
                        <Input placeholder="Город, Страна" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Биография</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Расскажите немного о себе..." rows={4} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <h3 className="text-lg font-semibold pt-4 border-t">Социальные сети и контакты</h3>

                 <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input placeholder="contact@example.com" {...field} /></FormControl><FormMessage /></FormItem>)} />
                 <FormField control={form.control} name="phone" render={({ field }) => (<FormItem><FormLabel>Телефон</FormLabel><FormControl><Input placeholder="+7 (999) 123-45-67" {...field} /></FormControl><FormMessage /></FormItem>)} />
                 <FormField control={form.control} name="website" render={({ field }) => (<FormItem><FormLabel>Веб-сайт</FormLabel><FormControl><Input placeholder="https://your-website.com" {...field} /></FormControl><FormMessage /></FormItem>)} />
                 <FormField control={form.control} name="linkedin" render={({ field }) => (<FormItem><FormLabel>LinkedIn</FormLabel><FormControl><Input placeholder="https://linkedin.com/in/..." {...field} /></FormControl><FormMessage /></FormItem>)} />
                 <FormField control={form.control} name="instagram" render={({ field }) => (<FormItem><FormLabel>Instagram</FormLabel><FormControl><Input placeholder="https://instagram.com/..." {...field} /></FormControl><FormMessage /></FormItem>)} />
                
                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="ghost" onClick={() => router.back()}>Отмена</Button>
                    <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Сохранить изменения
                    </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
