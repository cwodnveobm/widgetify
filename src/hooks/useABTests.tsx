import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface ABTest {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  widget_config: any;
  status: 'draft' | 'active' | 'paused' | 'completed';
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface WidgetVariation {
  id: string;
  ab_test_id: string;
  name: string;
  config: any;
  traffic_percentage: number;
  created_at: string;
  updated_at: string;
}

export interface ABTestMetrics {
  variation_id: string;
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number; // click-through rate
  cvr: number; // conversion rate
}

export const useABTests = () => {
  const { user } = useAuth();
  const [tests, setTests] = useState<ABTest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTests = async () => {
    if (!user) {
      setTests([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('ab_tests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTests((data as ABTest[]) || []);
    } catch (error: any) {
      console.error('Error fetching A/B tests:', error);
      toast.error('Failed to load A/B tests');
    } finally {
      setLoading(false);
    }
  };

  const createTest = async (testData: Partial<ABTest>) => {
    if (!user) {
      toast.error('You must be logged in');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('ab_tests')
        .insert([{
          user_id: user.id,
          name: testData.name || '',
          widget_config: testData.widget_config || {},
          description: testData.description,
          status: testData.status || 'draft',
          start_date: testData.start_date,
          end_date: testData.end_date
        }])
        .select()
        .single();

      if (error) throw error;
      
      toast.success('A/B test created successfully');
      await fetchTests();
      return data;
    } catch (error: any) {
      console.error('Error creating test:', error);
      toast.error('Failed to create A/B test');
      return null;
    }
  };

  const updateTest = async (id: string, updates: Partial<ABTest>) => {
    try {
      const { error } = await supabase
        .from('ab_tests')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Test updated successfully');
      await fetchTests();
      return true;
    } catch (error: any) {
      console.error('Error updating test:', error);
      toast.error('Failed to update test');
      return false;
    }
  };

  const deleteTest = async (id: string) => {
    try {
      const { error } = await supabase
        .from('ab_tests')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Test deleted successfully');
      await fetchTests();
      return true;
    } catch (error: any) {
      console.error('Error deleting test:', error);
      toast.error('Failed to delete test');
      return false;
    }
  };

  const fetchVariations = async (testId: string): Promise<WidgetVariation[]> => {
    try {
      const { data, error } = await supabase
        .from('widget_variations')
        .select('*')
        .eq('ab_test_id', testId);

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Error fetching variations:', error);
      toast.error('Failed to load variations');
      return [];
    }
  };

  const createVariation = async (variationData: Partial<WidgetVariation>) => {
    try {
      const { data, error } = await supabase
        .from('widget_variations')
        .insert([{
          ab_test_id: variationData.ab_test_id!,
          name: variationData.name || '',
          config: variationData.config || {},
          traffic_percentage: variationData.traffic_percentage
        }])
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Variation created successfully');
      return data;
    } catch (error: any) {
      console.error('Error creating variation:', error);
      toast.error('Failed to create variation');
      return null;
    }
  };

  const updateVariation = async (id: string, updates: Partial<WidgetVariation>) => {
    try {
      const { error } = await supabase
        .from('widget_variations')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Variation updated successfully');
      return true;
    } catch (error: any) {
      console.error('Error updating variation:', error);
      toast.error('Failed to update variation');
      return false;
    }
  };

  const deleteVariation = async (id: string) => {
    try {
      const { error } = await supabase
        .from('widget_variations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Variation deleted successfully');
      return true;
    } catch (error: any) {
      console.error('Error deleting variation:', error);
      toast.error('Failed to delete variation');
      return false;
    }
  };

  const fetchMetrics = async (variationIds: string[]): Promise<ABTestMetrics[]> => {
    try {
      const { data, error } = await supabase
        .from('ab_test_metrics')
        .select('*')
        .in('variation_id', variationIds);

      if (error) throw error;

      // Aggregate metrics
      const metricsMap = new Map<string, ABTestMetrics>();
      
      data?.forEach((metric) => {
        const existing = metricsMap.get(metric.variation_id) || {
          variation_id: metric.variation_id,
          impressions: 0,
          clicks: 0,
          conversions: 0,
          ctr: 0,
          cvr: 0
        };

        if (metric.event_type === 'impression') existing.impressions++;
        if (metric.event_type === 'click') existing.clicks++;
        if (metric.event_type === 'conversion') existing.conversions++;

        metricsMap.set(metric.variation_id, existing);
      });

      // Calculate rates
      const metrics = Array.from(metricsMap.values()).map(m => ({
        ...m,
        ctr: m.impressions > 0 ? (m.clicks / m.impressions) * 100 : 0,
        cvr: m.clicks > 0 ? (m.conversions / m.clicks) * 100 : 0
      }));

      return metrics;
    } catch (error: any) {
      console.error('Error fetching metrics:', error);
      toast.error('Failed to load metrics');
      return [];
    }
  };

  useEffect(() => {
    fetchTests();
  }, [user]);

  return {
    tests,
    loading,
    createTest,
    updateTest,
    deleteTest,
    fetchVariations,
    createVariation,
    updateVariation,
    deleteVariation,
    fetchMetrics,
    refreshTests: fetchTests
  };
};