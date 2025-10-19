
"use client";

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Star, ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';
import type { Review, Comment } from '@/lib/types';
import { useState } from 'react';
import CommentSection from './comment-section';
import { useAuth } from '@/hooks/use-auth';
import { useData } from '@/hooks/use-data';
import { Textarea } from './ui/textarea';

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const { user } = useAuth();
  const { addReplyToReview, addReplyToComment } = useData();

  const [likes, setLikes] = useState(review.likes);
  const [dislikes, setDislikes] = useState(review.dislikes);
  const [likeStatus, setLikeStatus] = useState<'liked' | 'disliked' | null>(null);

  const [showReplies, setShowReplies] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');

  const handleLike = () => {
    if (likeStatus === 'liked') {
      setLikes(likes - 1);
      setLikeStatus(null);
    } else {
      if (likeStatus === 'disliked') {
        setDislikes(dislikes - 1);
      }
      setLikes(likes + 1);
      setLikeStatus('liked');
    }
  };

  const handleDislike = () => {
    if (likeStatus === 'disliked') {
      setDislikes(dislikes - 1);
      setLikeStatus(null);
    } else {
      if (likeStatus === 'liked') {
        setLikes(likes - 1);
      }
      setDislikes(dislikes + 1);
      setLikeStatus('disliked');
    }
  };

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !user) return;

    const newReply: Comment = {
      id: `reply-${Date.now()}`,
      author: { name: user.name, username: user.username, avatar: user.avatar },
      text: replyText,
      timestamp: 'Только что',
      likes: 0,
      dislikes: 0,
      replies: [],
    };
    addReplyToReview(review.id, newReply);
    setReplyText('');
    setShowReplyForm(false);
    setShowReplies(true);
  };
  
  const handleAddReplyToComment = (parentCommentId: string, text: string) => {
    if(!user) return;
    const newReply: Comment = {
        id: `reply-${Date.now()}`,
        author: { name: user.name, username: user.username, avatar: user.avatar },
        text,
        timestamp: 'Только что',
        likes: 0,
        dislikes: 0,
        replies: [],
    };
    // This is a bit of a hack, since we don't have a direct way to add a reply to a review's comment
    // We can simulate it by finding the review and then the comment.
    // In a real app, this would be a single API call.
    console.log("Replying to a comment on a review is not fully implemented in mock data.", review.id, parentCommentId, newReply);
  };


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
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Button variant="ghost" size="sm" onClick={handleLike} className="flex items-center gap-1.5" disabled={!user}>
                <ThumbsUp className={`h-4 w-4 ${likeStatus === 'liked' ? 'text-primary' : ''}`} /> {likes}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleDislike} className="flex items-center gap-1.5" disabled={!user}>
                <ThumbsDown className={`h-4 w-4 ${likeStatus === 'disliked' ? 'text-destructive' : ''}`} /> {dislikes}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => { setShowReplyForm(!showReplyForm); if (!showReplies) setShowReplies(true); }} className="flex items-center gap-1.5" disabled={!user}>
                <MessageSquare className="h-4 w-4" /> Ответить
            </Button>
             {review.replies?.length > 0 && (
                 <Button variant="ghost" size="sm" onClick={() => setShowReplies(!showReplies)}>
                    {showReplies ? 'Скрыть ответы' : `Показать ответы (${review.replies.length})`}
                 </Button>
            )}
        </div>
        
        {showReplies && (
            <div className="mt-4 pl-6 border-l-2 space-y-4">
                 {showReplyForm && user && (
                    <form onSubmit={handleReplySubmit} className="flex flex-col gap-2">
                        <Textarea 
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder={`Ответить ${review.author.name}...`}
                            rows={2}
                        />
                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="ghost" size="sm" onClick={() => setShowReplyForm(false)}>Отмена</Button>
                            <Button type="submit" size="sm">Ответить</Button>
                        </div>
                    </form>
                )}
                 <CommentSection 
                    comments={review.replies} 
                    onAddComment={() => {}}
                    onAddReply={handleAddReplyToComment}
                    isReply
                 />
            </div>
        )}
      </CardContent>
    </Card>
  );
}
