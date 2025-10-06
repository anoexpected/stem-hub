'use client';

import { useState, useEffect } from 'react';
import { Heart, Bookmark, Share2, ThumbsUp } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

interface NoteActionsProps {
  noteId: string;
}

export default function NoteActions({ noteId }: NoteActionsProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    loadUserActions();
    loadLikeCount();
  }, [noteId]);

  const loadUserActions = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Check if user has liked
    const { data: like } = await supabase
      .from('note_likes')
      .select('id')
      .eq('note_id', noteId)
      .eq('user_id', user.id)
      .single();

    setIsLiked(!!like);

    // Check if user has bookmarked
    const { data: bookmark } = await supabase
      .from('note_bookmarks')
      .select('id')
      .eq('note_id', noteId)
      .eq('user_id', user.id)
      .single();

    setIsBookmarked(!!bookmark);
  };

  const loadLikeCount = async () => {
    const { count } = await supabase
      .from('note_likes')
      .select('*', { count: 'exact', head: true })
      .eq('note_id', noteId);

    setLikeCount(count || 0);
  };

  const handleLike = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('Please login to like notes');
      return;
    }

    setIsLoading(true);

    if (isLiked) {
      // Unlike
      const { error } = await supabase
        .from('note_likes')
        .delete()
        .eq('note_id', noteId)
        .eq('user_id', user.id);

      if (!error) {
        setIsLiked(false);
        setLikeCount((prev) => prev - 1);
        toast.success('Removed from liked notes');
      }
    } else {
      // Like
      const { error } = await supabase
        .from('note_likes')
        .insert({ note_id: noteId, user_id: user.id });

      if (!error) {
        setIsLiked(true);
        setLikeCount((prev) => prev + 1);
        toast.success('Added to liked notes');
      }
    }

    setIsLoading(false);
  };

  const handleBookmark = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('Please login to bookmark notes');
      return;
    }

    setIsLoading(true);

    if (isBookmarked) {
      // Remove bookmark
      const { error } = await supabase
        .from('note_bookmarks')
        .delete()
        .eq('note_id', noteId)
        .eq('user_id', user.id);

      if (!error) {
        setIsBookmarked(false);
        toast.success('Removed from bookmarks');
      }
    } else {
      // Add bookmark
      const { error } = await supabase
        .from('note_bookmarks')
        .insert({ note_id: noteId, user_id: user.id });

      if (!error) {
        setIsBookmarked(true);
        toast.success('Added to bookmarks');
      }
    }

    setIsLoading(false);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'STEM Hub Note',
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled share
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4 font-['Poppins']">
        Actions
      </h3>

      <div className="space-y-3">
        {/* Like Button */}
        <button
          onClick={handleLike}
          disabled={isLoading}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border-2 transition ${
            isLiked
              ? 'border-red-500 bg-red-50 text-red-700'
              : 'border-gray-200 hover:border-red-500 hover:bg-red-50'
          }`}
        >
          <div className="flex items-center space-x-3">
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            <span className="font-medium">
              {isLiked ? 'Liked' : 'Like'}
            </span>
          </div>
          <span className="text-sm font-bold">{likeCount}</span>
        </button>

        {/* Bookmark Button */}
        <button
          onClick={handleBookmark}
          disabled={isLoading}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border-2 transition ${
            isBookmarked
              ? 'border-[#2ECC71] bg-green-50 text-green-700'
              : 'border-gray-200 hover:border-[#2ECC71] hover:bg-green-50'
          }`}
        >
          <div className="flex items-center space-x-3">
            <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
            <span className="font-medium">
              {isBookmarked ? 'Bookmarked' : 'Bookmark'}
            </span>
          </div>
        </button>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="w-full flex items-center justify-between px-4 py-3 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition"
        >
          <div className="flex items-center space-x-3">
            <Share2 className="w-5 h-5" />
            <span className="font-medium">Share</span>
          </div>
        </button>
      </div>

      {/* Helpful Section */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-600 mb-3">Was this note helpful?</p>
        <div className="flex items-center space-x-2">
          <button className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-[#2ECC71] text-white rounded-lg hover:bg-[#27AE60] transition">
            <ThumbsUp className="w-4 h-4" />
            <span className="text-sm">Yes</span>
          </button>
          <button className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
            <span className="text-sm">No</span>
          </button>
        </div>
      </div>
    </div>
  );
}
