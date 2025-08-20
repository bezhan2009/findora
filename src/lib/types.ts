
export type UserRole = 'customer' | 'provider';

export interface Post {
  id: string;
  type: 'photo' | 'video';
  url: string;
  caption: string;
}

export interface Order {
  id: string;
  serviceTitle: string;
  providerName: string;
  providerUsername: string;
  date: string;
  price: number;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
}

export interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  rating: number;
  reviewsCount: number;
  images: string[];
  provider: UserStub;
  featured?: boolean;
  analytics?: {
    views: number;
    likes: number;
    revenue: number;
  }
}

export interface UserSocials {
    instagram?: string;
    facebook?: string;
    linkedin?: string;
    website?: string;
    phone?: string;
    email?: string;
}

export interface User {
  id: string;
  name: string;
  username: string;
  role: UserRole;
  avatar: string;
  location: string;
  bio: string;
  socials?: UserSocials;
  services?: string[];
  reviews?: Review[];
  followers: number;
  following?: UserStub[];
  posts?: Post[];
  orders?: Order[];
}

export interface UserStub {
  name: string;
  username: string;
  avatar: string;
}

export interface Review {
  id: string;
  providerId: string;
  author: {
    name: string;
    avatar: string;
  };
  rating: number;
  comment: string;
  date: string;
}

export interface ChatMessage {
  id: string;
  sender: 'me' | 'other';
  text: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  participant: {
    name: string;
    avatar: string;
  };
  lastMessage: string;
  timestamp: string;
  messages: ChatMessage[];
}

export interface Category {
  id: string;
  name: string;
}
