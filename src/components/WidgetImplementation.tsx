
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Check, Download, Code } from 'lucide-react';
import { WidgetConfig, generateWidgetCode } from '@/lib/widgetUtils';

interface WidgetImplementationProps {
  config: WidgetConfig;
}

const WidgetImplementation: React.FC<WidgetImplementationProps> = ({ config }) => {
  const [copied, setCopied] = useState(false);
  const widgetCode = generateWidgetCode(config);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(widgetCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([widgetCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.type}-widget.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="border border-green-200 bg-green-50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Code className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-lg text-green-900">
                Widget Implementation Code
              </CardTitle>
              <p className="text-sm text-green-700">
                Copy and paste this code into your website
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="border-green-300 text-green-700 hover:bg-green-100"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="border-green-300 text-green-700 hover:bg-green-100"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="bg-white rounded-lg border border-green-200 p-4">
          <pre className="text-xs overflow-x-auto whitespace-pre-wrap break-all">
            <code className="text-gray-800">{widgetCode}</code>
          </pre>
        </div>
        
        <div className="mt-4 p-3 bg-green-100 rounded-lg border border-green-200">
          <h4 className="font-semibold text-green-900 mb-2">How to implement:</h4>
          <ol className="text-sm text-green-800 space-y-1">
            <li>1. Copy the code above</li>
            <li>2. Paste it before the closing &lt;/body&gt; tag of your website</li>
            <li>3. Save and upload your file</li>
            <li>4. Your widget will appear on your website!</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export default WidgetImplementation;
