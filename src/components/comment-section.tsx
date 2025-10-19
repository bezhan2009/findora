"use client";

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';
import type { Comment } from '@/lib/types';
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';

interface CommentProps {
  comment: Comment;
  onAddReply: (text: string) => void;
}

const CommentItem = ({ comment, onAddReply }: CommentProps) => {
  const { user } = useAuth();
  const [likes, setLikes] = useState(comment.likes);
  const [dislikes, setDislikes] = useState(comment.dislikes);
  const [likeStatus, setLikeStatus] = useState<'liked' | 'disliked' | null>(null);

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
    if (!replyText.trim()) return;
    onAddReply(replyText);
    setReplyText('');
    setShowReplyForm(false);
  };

  return (
    <div className="flex flex-col gap-3">
        <div className="flex items-start gap-3">
            <Avatar className="h-9 w-9">
                <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-grow">
                <div className="bg-muted rounded-lg p-3">
                    <p className="font-semibold text-sm">{comment.author.name}</p>
                    <p className="text-sm text-muted-foreground">{comment.text}</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <span>{comment.timestamp}</span>
                    <button onClick={handleLike} className={`flex items-center gap-1 hover:text-primary ${likeStatus === 'liked' ? 'text-primary' : ''}`} disabled={!user}>
                        <ThumbsUp className="h-3 w-3" /> {likes}
                    </button>
                    <button onClick={handleDislike} className={`flex items-center gap-1 hover:text-destructive ${likeStatus === 'disliked' ? 'text-destructive' : ''}`} disabled={!user}>
                        <ThumbsDown className="h-3 w-3" /> {dislikes}
                    </button>
                    <button onClick={() => setShowReplyForm(!showReplyForm)} className="hover:text-primary" disabled={!user}>Ответить</button>
                </div>
            </div>
        </div>
        {showReplyForm && user && (
            <form onSubmit={handleReplySubmit} className="pl-12 flex flex-col gap-2">
                <Textarea 
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={`Ответить ${comment.author.name}...`}
                    rows={2}
                />
                <div className="flex justify-end gap-2">
                    <Button type="button" variant="ghost" size="sm" onClick={() => setShowReplyForm(false)}>Отмена</Button>
                    <Button type="submit" size="sm">Ответить</Button>
                </div>
            </form>
        )}
        {comment.replies && comment.replies.length > 0 && (
            <div className="pl-12 space-y-4 border-l-2 border-border ml-4 mt-2">
                {comment.replies.map(reply => (
                    <CommentItem key={reply.id} comment={reply} onAddReply={(text) => onAddReply(text)} />
                ))}
            </div>
        )}
    </div>
  );
};


interface CommentSectionProps {
  comments?: Comment[];
  onAddComment: (text: string) => void;
  onAddReply: (parentCommentId: string, text: string) => void;
  isReply?: boolean;
}

export default function CommentSection({ comments, onAddComment, onAddReply, isReply = false }: CommentSectionProps) {
  const [newComment, setNewComment] = useState('');
  const { user } = useAuth();
  
  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newComment.trim()) return;
      onAddComment(newComment);
      setNewComment('');
  };

  return (
    <div className="p-4 space-y-6">
        {!isReply && (
            user ? (
                <form onSubmit={handleSubmit} className="flex items-start gap-3">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-grow">
                        <Textarea 
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Добавьте комментарий..."
                            rows={2}
                        />
                        <Button type="submit" className="mt-2">Отправить</Button>
                    </div>
                </form>
            ) : (
                <div className="text-center text-sm text-muted-foreground p-4 border rounded-lg">
                    <Link href="/login" className="text-primary font-semibold">Войдите</Link> или <Link href="/register" className="text-primary font-semibold">зарегистрируйтесь</Link>, чтобы оставить комментарий.
                </div>
            )
        )}
      <div className="space-y-4">
        {comments && comments.map(comment => (
          <CommentItem 
              key={comment.id} 
              comment={comment} 
              onAddReply={(text) => onAddReply(comment.id, text)}
          />
        ))}
        {(!comments || comments.length === 0) && (
            <p className="text-sm text-muted-foreground text-center py-4">
                {isReply ? "Ответов пока нет." : "Комментариев пока нет. Будьте первым!"}
            </p>
        )}
      </div>
    </div>
  );
}
