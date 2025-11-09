import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useABTests } from '@/hooks/useABTests';
import { Plus, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ABTestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  test?: any;
}

export const ABTestDialog: React.FC<ABTestDialogProps> = ({ isOpen, onClose, test }) => {
  const { createTest, updateTest, fetchVariations, createVariation, updateVariation, deleteVariation } = useABTests();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [widgetType, setWidgetType] = useState('whatsapp');
  const [variations, setVariations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (test) {
      setName(test.name);
      setDescription(test.description || '');
      setWidgetType(test.widget_config?.type || 'whatsapp');
      loadVariations();
    } else {
      resetForm();
    }
  }, [test, isOpen]);

  const loadVariations = async () => {
    if (test?.id) {
      const vars = await fetchVariations(test.id);
      setVariations(vars);
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setWidgetType('whatsapp');
    setVariations([
      { name: 'Variation A', traffic_percentage: 50, config: { primaryColor: '#25D366' } },
      { name: 'Variation B', traffic_percentage: 50, config: { primaryColor: '#0088cc' } }
    ]);
  };

  const handleAddVariation = () => {
    const remainingTraffic = 100 - variations.reduce((sum, v) => sum + v.traffic_percentage, 0);
    setVariations([...variations, {
      name: `Variation ${String.fromCharCode(65 + variations.length)}`,
      traffic_percentage: Math.max(0, remainingTraffic),
      config: {}
    }]);
  };

  const handleRemoveVariation = async (index: number) => {
    const variation = variations[index];
    if (variation.id) {
      await deleteVariation(variation.id);
    }
    setVariations(variations.filter((_, i) => i !== index));
  };

  const handleVariationChange = (index: number, field: string, value: any) => {
    const updated = [...variations];
    updated[index] = { ...updated[index], [field]: value };
    setVariations(updated);
  };

  const handleSubmit = async () => {
    if (!name.trim()) return;

    setLoading(true);
    try {
      const widgetConfig = {
        type: widgetType,
        variations: variations.length
      };

      let testId = test?.id;
      
      if (test) {
        await updateTest(test.id, { name, description, widget_config: widgetConfig });
      } else {
        const newTest = await createTest({
          name,
          description,
          widget_config: widgetConfig,
          status: 'draft'
        });
        testId = newTest?.id;
      }

      // Create/update variations
      if (testId) {
        for (const variation of variations) {
          if (variation.id) {
            await updateVariation(variation.id, {
              name: variation.name,
              traffic_percentage: variation.traffic_percentage,
              config: variation.config
            });
          } else {
            await createVariation({
              ab_test_id: testId,
              name: variation.name,
              traffic_percentage: variation.traffic_percentage,
              config: variation.config
            });
          }
        }
      }

      onClose();
      resetForm();
    } finally {
      setLoading(false);
    }
  };

  const totalTraffic = variations.reduce((sum, v) => sum + v.traffic_percentage, 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{test ? 'Edit A/B Test' : 'Create A/B Test'}</DialogTitle>
          <DialogDescription>
            Test different widget variations to see which performs better
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="test-name">Test Name</Label>
            <Input
              id="test-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., WhatsApp Button Color Test"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="test-description">Description</Label>
            <Textarea
              id="test-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what you're testing..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="widget-type">Widget Type</Label>
            <Select value={widgetType} onValueChange={setWidgetType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                <SelectItem value="call-now">Call Now</SelectItem>
                <SelectItem value="social-share">Social Share</SelectItem>
                <SelectItem value="payment">Payment</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Variations</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddVariation}
                disabled={variations.length >= 5}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Variation
              </Button>
            </div>

            {variations.map((variation, index) => (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">{variation.name}</CardTitle>
                    {variations.length > 2 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveVariation(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Variation Name</Label>
                    <Input
                      value={variation.name}
                      onChange={(e) => handleVariationChange(index, 'name', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Traffic Split: {variation.traffic_percentage}%</Label>
                    <Slider
                      value={[variation.traffic_percentage]}
                      onValueChange={([value]) =>
                        handleVariationChange(index, 'traffic_percentage', value)
                      }
                      max={100}
                      step={5}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Primary Color</Label>
                    <Input
                      type="color"
                      value={variation.config?.primaryColor || '#25D366'}
                      onChange={(e) =>
                        handleVariationChange(index, 'config', {
                          ...variation.config,
                          primaryColor: e.target.value
                        })
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            ))}

            {totalTraffic !== 100 && (
              <p className="text-sm text-destructive">
                ⚠️ Traffic split must total 100%. Currently: {totalTraffic}%
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading || !name.trim() || totalTraffic !== 100}
            >
              {loading ? 'Saving...' : test ? 'Update Test' : 'Create Test'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};