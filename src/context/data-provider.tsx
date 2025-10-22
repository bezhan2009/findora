
"use client";

import React, { createContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { initialData, type InitialData } from '@/lib/data';
import type { User, Service, Review, Category, Conversation, ChatMessage, Post, Comment, CartItem, Order } from '@/lib/types';
import { useAuth } from '@/hooks/use-auth';

interface DataContextType extends InitialData {
  addConversation: (conversation: Conversation) => void;
  addMessageToConversation: (conversationId: string, message: ChatMessage) => void;
  addService: (service: Service) => void;
  addPost: (username: string, post: Post) => void;
  addReview: (serviceId: string, review: Review) => void;
  addCommentToPost: (postId: string, comment: Comment) => void;
  addReplyToComment: (postId: string, parentCommentId: string, reply: Comment) => void;
  addReplyToReview: (reviewId: string, reply: Comment) => void;
  createOrderFromCart: (cartItems: CartItem[], address: string, phone: string) => void;
  addLikeToService: (serviceId: string) => void;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

const DATA_STORAGE_KEY = 'bizmart-app-data';

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  
  const [data, setData] = useState<InitialData>(() => {
    // Lazy initialization from localStorage
    try {
        if (typeof window !== 'undefined') {
            const storedData = localStorage.getItem(DATA_STORAGE_KEY);
            if (storedData) {
                return JSON.parse(storedData);
            }
        }
    } catch (error) {
        console.error("Failed to read data from localStorage", error);
    }
    return initialData;
  });

  // Persist data to localStorage whenever it changes
  useEffect(() => {
    try {
        localStorage.setItem(DATA_STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
        console.error("Failed to save data to localStorage", error);
    }
  }, [data]);

  const updateData = (newData: Partial<InitialData>) => {
    setData(prevData => ({
        ...prevData,
        ...newData
    }));
  }

  const addConversation = (conversation: Conversation) => {
    setData(prevData => ({
      ...prevData,
      conversations: [conversation, ...prevData.conversations]
    }));
  };

  const addMessageToConversation = (conversationId: string, message: ChatMessage) => {
    setData(prevData => {
      const newConversations = prevData.conversations.map(convo => {
        if (convo.id === conversationId) {
          return {
            ...convo,
            messages: [...convo.messages, message],
            lastMessage: message.text,
            timestamp: message.timestamp,
          };
        }
        return convo;
      });

      const updatedConvo = newConversations.find(c => c.id === conversationId);
      const otherConvos = newConversations.filter(c => c.id !== conversationId);
      
      return {
        ...prevData,
        conversations: updatedConvo ? [updatedConvo, ...otherConvos] : newConversations
      };
    });
  };

  const addService = (service: Service) => {
    setData(prevData => ({
      ...prevData,
      services: [service, ...prevData.services]
    }));
  };

  const addPost = (username: string, post: Post) => {
    setData(prevData => {
      const newUsers = prevData.users.map(user => {
        if (user.username === username) {
          const updatedPosts = user.posts ? [post, ...user.posts] : [post];
          return { ...user, posts: updatedPosts };
        }
        return user;
      });
      return { ...prevData, users: newUsers };
    });
  };

  const addReview = (serviceId: string, review: Review) => {
    setData(prevData => {
        const newReviews = [review, ...prevData.reviews];
        const newServices = prevData.services.map(service => {
            if (service.id === serviceId) {
                const newReviewsCount = service.reviewsCount + 1;
                const totalRating = (service.rating * service.reviewsCount) + review.rating;
                const newRating = totalRating / newReviewsCount;
                return {
                    ...service,
                    reviews: [review.id, ...(service.reviews || [])],
                    reviewsCount: newReviewsCount,
                    rating: newRating,
                };
            }
            return service;
        });
        return {
            ...prevData,
            reviews: newReviews,
            services: newServices,
        };
    });
  };

  const addCommentToPost = (postId: string, comment: Comment) => {
    setData(prevData => {
        const newUsers = prevData.users.map(user => {
            const newPosts = user.posts?.map(post => {
                if (post.id === postId) {
                    return {
                        ...post,
                        comments: [comment, ...(post.comments || [])]
                    };
                }
                return post;
            });
            return { ...user, posts: newPosts };
        });
        return { ...prevData, users: newUsers };
    });
  };

  const addReplyToComment = (postId: string, parentCommentId: string, reply: Comment) => {
    setData(prevData => {
        const newUsers = prevData.users.map(user => {
            const newPosts = user.posts?.map(post => {
                if (post.id === postId) {
                    const findAndAddReply = (comments: Comment[]): Comment[] => {
                        return comments.map(c => {
                            if (c.id === parentCommentId) {
                                return { ...c, replies: [reply, ...(c.replies || [])] };
                            }
                            if (c.replies && c.replies.length > 0) {
                                return { ...c, replies: findAndAddReply(c.replies) };
                            }
                            return c;
                        });
                    };
                    const updatedComments = findAndAddReply(post.comments || []);
                    return { ...post, comments: updatedComments };
                }
                return post;
            });
            return { ...user, posts: newPosts };
        });
        return { ...prevData, users: newUsers };
    });
  };
  
  const addReplyToReview = (reviewId: string, reply: Comment) => {
    setData(prevData => {
      const newReviews = prevData.reviews.map(review => {
        if (review.id === reviewId) {
          return { ...review, replies: [reply, ...(review.replies || [])] };
        }
        return review;
      });
      return { ...prevData, reviews: newReviews };
    });
  };

  const addLikeToService = (serviceId: string) => {
    setData(prevData => {
        const newServices = prevData.services.map(service => {
            if (service.id === serviceId) {
                const currentAnalytics = service.analytics ?? { views: 0, likes: 0, revenue: 0 };
                return {
                    ...service,
                    analytics: {
                        ...currentAnalytics,
                        likes: (currentAnalytics.likes || 0) + 1,
                    },
                };
            }
            return service;
        });
        return {
            ...prevData,
            services: newServices,
        };
    });
  };

  const createOrderFromCart = (cartItems: CartItem[], address: string, phone: string) => {
    if (!user) return;

    setData(prevData => {
      const newOrders: Order[] = cartItems.map(item => {
        const service = prevData.services.find(s => s.id === item.id);
        return {
          id: `order-${Date.now()}-${item.id}`,
          serviceTitle: item.name,
          providerName: service?.provider.name || 'Unknown',
          providerUsername: service?.provider.username || 'unknown',
          date: new Date().toISOString(),
          price: item.price * item.quantity,
          status: 'Completed' as const,
          address,
          phone,
        };
      });

      const updatedUsers = prevData.users.map(u => {
        if (u.username === user.username) {
          return {
            ...u,
            orders: [...(u.orders || []), ...newOrders],
          };
        }
        return u;
      });

      // Update provider's revenue
      const servicesById = new Map(prevData.services.map(s => [s.id, s]));
      const revenueByProvider: {[username: string]: number} = {};

      cartItems.forEach(item => {
        const service = servicesById.get(item.id);
        if (service) {
            const providerUsername = service.provider.username;
            const revenue = item.price * item.quantity;
            if (!revenueByProvider[providerUsername]) {
                revenueByProvider[providerUsername] = 0;
            }
            revenueByProvider[providerUsername] += revenue;
        }
      });
      
      const newServices = [...prevData.services];

      const finalUsers = updatedUsers.map(u => {
        if (revenueByProvider[u.username]) {
          const providerServices = newServices.filter(s => s.provider.username === u.username);
          if (providerServices.length > 0) {
              const revenuePerService = revenueByProvider[u.username] / providerServices.length;
              providerServices.forEach(ps => {
                  const serviceIndex = newServices.findIndex(s => s.id === ps.id);
                  if (serviceIndex !== -1) {
                      newServices[serviceIndex] = {
                          ...newServices[serviceIndex],
                           analytics: {
                               ...newServices[serviceIndex].analytics,
                               views: newServices[serviceIndex].analytics?.views || 0,
                               likes: newServices[serviceIndex].analytics?.likes || 0,
                               revenue: (newServices[serviceIndex].analytics?.revenue || 0) + revenuePerService
                           }
                      }
                  }
              });
          }
        }
        return u;
      });
      
      return {
        ...prevData,
        users: finalUsers,
        services: newServices,
      };
    });
  };

  const value = {
    ...data,
    addConversation,
    addMessageToConversation,
    addService,
    addPost,
    addReview,
    addCommentToPost,
    addReplyToComment,
    addReplyToReview,
    createOrderFromCart,
    addLikeToService,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
