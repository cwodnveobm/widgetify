import { useState } from 'react';
import { Copy, Check, Code2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function LastSetEmbedSnippet({ username }: { username: string }) {
  const [copied, setCopied] = useState<'iframe' | 'script' | null>(null);
  const base = 'https://widgetify.vercel.app';

  const iframeCode = `<iframe src="${base}/embed/lastset/${username}" width="100%" height="640" style="border:0;border-radius:16px;max-width:420px" loading="lazy" title="Bio"></iframe>`;
  const scriptCode = `<script async src="${base}/embed.js" data-lastset="${username}" data-mode="floating"></script>`;

  const copy = async (text: string, key: 'iframe' | 'script') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key); setTimeout(() => setCopied(null), 1800);
      toast.success('Copied!');
    } catch { toast.error('Copy failed'); }
  };

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
        <Code2 className="w-4 h-4 text-primary" /> Embed on your site
      </h2>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-foreground">iFrame embed</span>
          <Button size="sm" variant="ghost" className="h-7 text-xs gap-1" onClick={() => copy(iframeCode, 'iframe')}>
            {copied === 'iframe' ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />} Copy
          </Button>
        </div>
        <pre className="p-2 rounded-lg bg-muted text-[10px] font-mono overflow-x-auto whitespace-pre-wrap break-all text-foreground">{iframeCode}</pre>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-foreground">Floating bubble (script)</span>
          <Button size="sm" variant="ghost" className="h-7 text-xs gap-1" onClick={() => copy(scriptCode, 'script')}>
            {copied === 'script' ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />} Copy
          </Button>
        </div>
        <pre className="p-2 rounded-lg bg-muted text-[10px] font-mono overflow-x-auto whitespace-pre-wrap break-all text-foreground">{scriptCode}</pre>
        <p className="text-[10px] text-muted-foreground">Adds a small avatar button bottom-right that opens your bio.</p>
      </div>
    </div>
  );
}
