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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import { useData } from "@/hooks/use-data";
import { Briefcase, Loader2 } from "lucide-react";
import type { Service } from "@/lib/types";

const formSchema = z.object({
  title: z.string().min(5, "Заголовок должен содержать не менее 5 символов."),
  description: z.string().min(20, "Описание должно содержать не менее 20 символов."),
  category: z.string({ required_error: "Пожалуйста, выберите категорию." }),
  price: z.coerce.number().min(1, "Цена должна быть не менее 1."),
  images: z.any()
});

export default function EditServicePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { categories, addService } = useData();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      images: undefined,
    },
  });

  const { isSubmitting } = form.formState;

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) return;
    
    const imageFiles = values.images as FileList;
    const imageUrls = Array.from(imageFiles).map(file => URL.createObjectURL(file));

    const newService: Service = {
      id: `service-${Date.now()}`,
      title: values.title,
      description: values.description,
      category: values.category,
      price: values.price,
      images: imageUrls.length > 0 ? imageUrls : ['https://placehold.co/400x400/F9F9F9/333333?text=No+Image'],
      rating: 0,
      reviewsCount: 0,
      reviews: [],
      provider: {
        name: user.name,
        username: user.username,
        avatar: user.avatar,
      },
       analytics: {
        views: 0,
        likes: 0,
        revenue: 0,
      }
    };

    addService(newService);
    router.push(`/services/${newService.id}`);
  }
  
  const imageRef = form.register("images");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4 mb-2">
                <Briefcase className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold font-headline">Добавить новый товар/услугу</h1>
            </div>
            <CardDescription>
              Заполните детали ниже, чтобы разместить ваш товар или услугу на BizMart.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Название товара/услуги</FormLabel>
                      <FormControl>
                        <Input placeholder="например, 'Профессиональный дизайн логотипа'" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Подробное описание</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Опишите, что входит в вашу услугу или характеристики товара..." rows={5} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Категория</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите категорию" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map(cat => (
                            <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Цена (TJS)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="150" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Изображения</FormLabel>
                      <FormControl>
                        <Input type="file" multiple accept="image/*" {...imageRef} />
                      </FormControl>
                       <p className="text-sm text-muted-foreground">
                        Выберите одно или несколько изображений для вашего товара.
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                   {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Опубликовать
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
