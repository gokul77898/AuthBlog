
import { PostList } from '@/components/posts/post-list';

export default function HomePage() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 text-center text-primary tracking-tight">
        Latest Blog Posts
      </h1>
      <PostList />
    </div>
  );
}
