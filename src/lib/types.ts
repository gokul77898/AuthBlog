
export interface User {
  id: string;
  username: string;
  name: string;
  role: 'admin' | 'editor' | 'user';
  password?: string; // Optional: for dummy auth, not for storing real passwords
}

export interface PostAuthor {
  id: string;
  name: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  author: PostAuthor;
  createdAt: Date;
  imageUrl?: string; 
}
