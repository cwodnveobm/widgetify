import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';
import type { WidgetType } from '@/types';

export const useFavoriteWidgets = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Set<WidgetType>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchFavorites();
    } else {
      setFavorites(new Set());
      setLoading(false);
    }
  }, [user]);

  const fetchFavorites = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('favorite_widgets')
        .select('widget_type')
        .eq('user_id', user.id);

      if (error) throw error;

      const favoriteSet = new Set<WidgetType>(
        data.map(item => item.widget_type as WidgetType)
      );
      setFavorites(favoriteSet);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (widgetType: WidgetType) => {
    if (!user) {
      toast.error('Please sign in to save favorites');
      return;
    }

    const isFavorite = favorites.has(widgetType);

    try {
      if (isFavorite) {
        const { error } = await supabase
          .from('favorite_widgets')
          .delete()
          .eq('user_id', user.id)
          .eq('widget_type', widgetType);

        if (error) throw error;

        setFavorites(prev => {
          const newSet = new Set(prev);
          newSet.delete(widgetType);
          return newSet;
        });
        toast.success('Removed from favorites');
      } else {
        const { error } = await supabase
          .from('favorite_widgets')
          .insert({
            user_id: user.id,
            widget_type: widgetType,
          });

        if (error) throw error;

        setFavorites(prev => new Set(prev).add(widgetType));
        toast.success('Added to favorites');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update favorites');
    }
  };

  return {
    favorites,
    loading,
    toggleFavorite,
    isFavorite: (widgetType: WidgetType) => favorites.has(widgetType),
  };
};
