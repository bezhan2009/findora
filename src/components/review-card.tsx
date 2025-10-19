"use client";

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Star, ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';
import type { Review } from '@/lib/types';
import { useState } from 'react';
import CommentSection from './comment-section';

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const [likes, setLikes] = useState(review.likes);
  const [dislikes, setDislikes] = useState(review.dislikes);
  const [showReplies, setShowReplies] = useState(false);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <Avatar>
                    <AvatarImage src={review.author.avatar} />
                    <AvatarFallback>{review.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-semibold">{review.author.name}</p>
                    <p className="text-sm text-muted-foreground">{new Date(review.date).toLocaleDateString('ru-RU')}</p>
                </div>
            </div>
            <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-5 w-5 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-muted-foreground/30'}`} />
                ))}
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{review.comment}</p>
        <div className="flex items-center gap-4 text-muted-foreground">
            <Button variant="ghost" size="sm" onClick={() => setLikes(likes + 1)} className="flex items-center gap-1.5">
                <ThumbsUp className="h-4 w-4" /> {likes}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setDislikes(dislikes + 1)} className="flex items-center gap-1.5">
                <ThumbsDown className="h-4 w-4" /> {dislikes}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowReplies(!showReplies)} className="flex items-center gap-1.5">
                <MessageSquare className="h-4 w-4" /> Ответить
            </Button>
        </div>
        {showReplies && (
            <div className="mt-4 pl-6 border-l-2">
                 <CommentSection 
                    comments={review.replies} 
                    onAddComment={(newComment) => console.log('Новый ответ на отзыв:', newComment)} // Placeholder
                    isReply
                />
            </div>
        )}
      </CardContent>
    </Card>
  );
}
