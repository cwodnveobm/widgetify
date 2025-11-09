import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useABTests } from '@/hooks/useABTests';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, MousePointer, Eye, Target } from 'lucide-react';

interface ABTestAnalyticsProps {
  testId: string;
}

export const ABTestAnalytics: React.FC<ABTestAnalyticsProps> = ({ testId }) => {
  const { tests, fetchVariations, fetchMetrics } = useABTests();
  const [test, setTest] = useState<any>(null);
  const [variations, setVariations] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTestData();
  }, [testId]);

  const loadTestData = async () => {
    setLoading(true);
    try {
      const currentTest = tests.find(t => t.id === testId);
      setTest(currentTest);

      const vars = await fetchVariations(testId);
      setVariations(vars);

      const mets = await fetchMetrics(vars.map(v => v.id));
      setMetrics(mets);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Loading analytics...</p>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Test not found</p>
      </div>
    );
  }

  const chartData = variations.map(variation => {
    const metric = metrics.find(m => m.variation_id === variation.id) || {
      impressions: 0,
      clicks: 0,
      conversions: 0,
      ctr: 0,
      cvr: 0
    };

    return {
      name: variation.name,
      impressions: metric.impressions,
      clicks: metric.clicks,
      conversions: metric.conversions,
      ctr: metric.ctr,
      cvr: metric.cvr
    };
  });

  const winner = chartData.reduce((prev, current) =>
    current.cvr > prev.cvr ? current : prev
  , chartData[0]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{test.name}</CardTitle>
          <CardDescription>{test.description}</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        {chartData.map((data, index) => {
          const isWinner = data.name === winner.name && chartData.length > 1;
          return (
            <Card key={index}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">{data.name}</CardTitle>
                  {isWinner && (
                    <Badge className="bg-green-500">Winner</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Impressions</span>
                  </div>
                  <span className="font-semibold">{data.impressions}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MousePointer className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Clicks</span>
                  </div>
                  <span className="font-semibold">{data.clicks}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Conversions</span>
                  </div>
                  <span className="font-semibold">{data.conversions}</span>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">CTR</span>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold">{data.ctr.toFixed(2)}%</span>
                      {data.ctr > 0 && (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">CVR</span>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold">{data.cvr.toFixed(2)}%</span>
                      {data.cvr > 0 && (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Comparison</CardTitle>
          <CardDescription>Compare metrics across all variations</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="impressions" fill="hsl(var(--primary))" name="Impressions" />
              <Bar dataKey="clicks" fill="hsl(var(--secondary))" name="Clicks" />
              <Bar dataKey="conversions" fill="hsl(var(--accent))" name="Conversions" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Conversion Rates</CardTitle>
          <CardDescription>Click-through and conversion rates over variations</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="ctr" stroke="hsl(var(--primary))" name="CTR %" />
              <Line type="monotone" dataKey="cvr" stroke="hsl(var(--accent))" name="CVR %" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};