export type User = {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  isAdmin: boolean;
  plan: 'free' | 'pro';
  createdAt: string;
};

export type Link = {
  id: string;
  userId: string;
  slug: string;
  whatsapp: string;
  message: string;
  isActive: boolean;
  bgColor: string;
  btnColor: string;
  profileImage: string | null;
  socialLinks: SocialLinks | null;
  createdAt: string;
};

export type SocialLinks = {
  instagram?: string;
  tiktok?: string;
  website?: string;
  [key: string]: string | undefined;
};

export type ClickLog = {
  id: string;
  linkId: string;
  timestamp: string;
  ip: string | null;
  country: string | null;
};

export type Plan = {
  id: string;
  name: string;
  price: number;
  features: string[];
  createdAt: string;
};