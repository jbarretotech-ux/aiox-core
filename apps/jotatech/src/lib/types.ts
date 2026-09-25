export type Role = 'member' | 'admin';
export type MemberStatus = 'active' | 'blocked';

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  whatsapp: string | null;
  role: Role;
  status: MemberStatus;
  access_code: string | null;
  created_at: string;
}

export interface Settings {
  site_name: string;
  tagline: string;
  whatsapp_group_url: string;
  support_whatsapp: string;
  hero_title: string;
  hero_subtitle: string;
  hero_image_url: string | null;
  members_welcome: string;
  members_banner_url: string | null;
  instagram_url: string;
  youtube_url: string;
  author_name: string;
  author_bio: string;
  author_photo_url: string | null;
}

export interface Material {
  label: string;
  url: string;
}

export interface Lesson {
  id: string;
  module_id: string;
  title: string;
  description: string;
  video_url: string | null;
  duration_minutes: number | null;
  materials: Material[];
  position: number;
  published: boolean;
}

export interface Module {
  id: string;
  course_id: string;
  title: string;
  description: string;
  cover_url: string | null;
  position: number;
  published: boolean;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  cover_url: string | null;
  banner_url: string | null;
  position: number;
  published: boolean;
  modules: Module[];
}

export interface AccessCode {
  code: string;
  label: string | null;
  max_uses: number | null;
  uses: number;
  expires_at: string | null;
  active: boolean;
  created_at: string;
}

export interface Author {
  full_name: string | null;
  avatar_url: string | null;
  role: Role;
}

export interface Comment {
  id: string;
  user_id: string;
  body: string;
  created_at: string;
  author: Author | null;
}

export interface Post extends Comment {
  pinned: boolean;
  comments: Comment[];
}

export interface Viewer {
  id: string;
  profile: Profile;
  isAdmin: boolean;
  isDemo: boolean;
}

export interface ActionResult {
  ok: boolean;
  message?: string;
}
