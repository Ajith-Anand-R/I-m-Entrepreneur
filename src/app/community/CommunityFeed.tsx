import React, { useState } from 'react';
import { Users, Heart, MessageSquare, Share2, Plus, Sparkles } from 'lucide-react';
import { useStartupStore } from '../../store/useStartupStore';

export const CommunityFeed: React.FC = () => {
  const { founderName, startupName } = useStartupStore();
  const [posts, setPosts] = useState([
    {
      id: 'p-1',
      author: 'Kabir Mehta',
      startup: 'AquaFilter Tech',
      text: 'Just cleared Level 6 Market Sizing! Calculating bottom-up TAM for urban clean-water filter grids. Anyone interested in B2B municipal pilot structures?',
      likes: 8,
      comments: 3,
      liked: false
    },
    {
      id: 'p-2',
      author: 'Neelam Sen',
      startup: 'Kira Solar Network',
      text: 'Drafted clean energy NDA agreements using the Document Generator. Autofills saved me at least 3 hours. Strongly suggest checking it out!',
      likes: 12,
      comments: 1,
      liked: true
    }
  ]);
  const [inputText, setInputText] = useState('');

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setPosts(prev => [
      {
        id: `p-${Date.now()}`,
        author: founderName,
        startup: startupName,
        text: inputText,
        likes: 0,
        comments: 0,
        liked: false
      },
      ...prev
    ]);
    setInputText('');
  };

  const handleLike = (id: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id !== id) return p;
      return {
        ...p,
        liked: !p.liked,
        likes: p.liked ? p.likes - 1 : p.likes + 1
      };
    }));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-2xl font-bold text-ink-900 flex items-center space-x-2">
          <Users className="w-6 h-6 text-ink-700" />
          <span>Founder Community Hub</span>
        </h2>
        <p className="text-xs text-slate-500 font-mono mt-0.5">
          Connect, match profiles, share milestone achievements, and trade templates with fellow founders.
        </p>
      </div>

      {/* Write Post */}
      <form onSubmit={handlePost} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
        <textarea
          rows={2}
          placeholder="Share your startup progress, questions, or updates..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="w-full text-xs border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-ink-700 outline-none resize-none"
          required
        />
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-1.5 bg-ink-900 text-white hover:bg-ink-700 rounded-lg text-xs font-bold transition flex items-center space-x-1 shadow"
          >
            <Plus className="w-4 h-4" />
            <span>Publish Post</span>
          </button>
        </div>
      </form>

      {/* Feed List */}
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-white p-5 rounded-xl border border-slate-250 hover:border-slate-350 transition shadow-sm space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 font-sans text-xs uppercase shadow-sm">
                {post.author.substring(0, 2)}
              </div>
              <div>
                <h4 className="font-bold text-sm text-ink-900 leading-snug">{post.author}</h4>
                <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">{post.startup}</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-sans pr-2">{post.text}</p>

            <div className="pt-3 border-t border-slate-100 flex items-center space-x-6 text-slate-400">
              <button 
                onClick={() => handleLike(post.id)}
                className={`flex items-center space-x-1.5 text-xs font-semibold transition ${post.liked ? 'text-accent-coral' : 'hover:text-slate-600'}`}
              >
                <Heart className={`w-4.5 h-4.5 ${post.liked ? 'fill-current' : ''}`} />
                <span>{post.likes}</span>
              </button>
              <button className="flex items-center space-x-1.5 text-xs font-semibold hover:text-slate-600 transition">
                <MessageSquare className="w-4.5 h-4.5" />
                <span>{post.comments}</span>
              </button>
              <button className="flex items-center space-x-1.5 text-xs font-semibold hover:text-slate-600 transition ml-auto">
                <Share2 className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default CommunityFeed;
