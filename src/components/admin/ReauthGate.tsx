import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ShieldCheck, Loader2 } from 'lucide-react';

/**
 * Step-up re-authentication for sensitive admin actions.
 * The password is held ONLY in module memory and expires after TTL_MS.
 * It is attached to admin-actions requests as `reauth_password` and
 * verified server-side via signInWithPassword against the caller's email.
 */
const TTL_MS = 5 * 60 * 1000; // 5 minutes

let cachedPw: string | null = null;
let cachedAt = 0;
type Resolver = (pw: string | null) => void;
let pendingResolvers: Resolver[] = [];
let openSetter: ((open: boolean) => void) | null = null;

export function getCachedReauthPassword(): string | null {
  if (!cachedPw) return null;
  if (Date.now() - cachedAt > TTL_MS) {
    cachedPw = null;
    return null;
  }
  return cachedPw;
}

export function clearReauth() {
  cachedPw = null;
  cachedAt = 0;
}

/** Returns a password (fresh or cached). Resolves null if user cancels. */
export function requestReauth(): Promise<string | null> {
  const fresh = getCachedReauthPassword();
  if (fresh) return Promise.resolve(fresh);
  return new Promise((resolve) => {
    pendingResolvers.push(resolve);
    openSetter?.(true);
  });
}

export const ReauthGate = () => {
  const [open, setOpen] = useState(false);
  const [pw, setPw] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    openSetter = setOpen;
    return () => { openSetter = null; };
  }, []);

  const flush = (value: string | null) => {
    const resolvers = pendingResolvers;
    pendingResolvers = [];
    resolvers.forEach((r) => r(value));
  };

  const submit = () => {
    if (!pw) return;
    setBusy(true);
    cachedPw = pw;
    cachedAt = Date.now();
    flush(pw);
    setPw('');
    setBusy(false);
    setOpen(false);
  };

  const cancel = () => {
    flush(null);
    setPw('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) cancel(); }}>
      <DialogContent className="border-2 border-foreground shadow-[6px_6px_0_0_hsl(var(--foreground))]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5" /> Confirm your identity
          </DialogTitle>
          <DialogDescription>
            This action is sensitive. Re-enter your admin password to continue. Cached for 5 minutes.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <Label htmlFor="reauth-pw">Password</Label>
          <Input
            id="reauth-pw"
            type="password"
            value={pw}
            autoFocus
            onChange={(e) => setPw(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
          />
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={cancel} disabled={busy}>Cancel</Button>
            <Button onClick={submit} disabled={!pw || busy}>
              {busy ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ShieldCheck className="w-4 h-4 mr-2" />}
              Confirm
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
