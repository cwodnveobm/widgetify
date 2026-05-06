import { Widget, defaultWidget, WIDGET_LIBRARY, WidgetKind } from '@/lib/lastsetWidgets';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, GripVertical, Plus, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Props {
  widget: Widget;
  onChange: (w: Widget) => void;
  onRemove: () => void;
  dragHandleProps?: any;
}

export function WidgetEditor({ widget, onChange, onRemove, dragHandleProps }: Props) {
  const meta = WIDGET_LIBRARY.find(w => w.kind === widget.kind);

  const update = (patch: Partial<Widget>) => onChange({ ...widget, ...patch } as Widget);

  return (
    <div className="p-3 rounded-xl border border-border bg-card space-y-2">
      <div className="flex items-center gap-2">
        <span {...dragHandleProps} className="cursor-grab active:cursor-grabbing">
          <GripVertical className="w-4 h-4 text-muted-foreground/60" />
        </span>
        <span className="text-xs font-semibold text-foreground flex-1">{meta?.label}</span>
        <button onClick={onRemove} aria-label="Remove widget"
          className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {widget.kind === 'link' && (
        <>
          <Input value={widget.label} onChange={e => update({ label: e.target.value } as any)} placeholder="Label" className="h-8 text-sm" />
          <Input value={widget.url} onChange={e => update({ url: e.target.value } as any)} placeholder="https://" className="h-8 text-sm font-mono" />
          <div className="flex gap-2">
            <Select value={widget.style || 'button'} onValueChange={v => update({ style: v as any } as any)}>
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="button">Button</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="banner">Banner (highlight)</SelectItem>
              </SelectContent>
            </Select>
            <Select value={widget.icon || 'link'} onValueChange={v => update({ icon: v } as any)}>
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                {['link','website','instagram','twitter','youtube','github','linkedin','music','shop','mail','phone'].map(i =>
                  <SelectItem key={i} value={i}>{i}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </>
      )}

      {widget.kind === 'header' && (
        <Input value={widget.text} onChange={e => update({ text: e.target.value } as any)} placeholder="Section title" className="h-8 text-sm" />
      )}

      {widget.kind === 'whatsapp' && (
        <>
          <Input value={widget.phone} onChange={e => update({ phone: e.target.value } as any)} placeholder="+91…" className="h-8 text-sm font-mono" />
          <Input value={widget.label || ''} onChange={e => update({ label: e.target.value } as any)} placeholder="Button label" className="h-8 text-sm" />
          <Textarea value={widget.message || ''} onChange={e => update({ message: e.target.value } as any)} placeholder="Pre-filled message" rows={2} className="text-xs resize-none" />
        </>
      )}

      {widget.kind === 'youtube' && (
        <Input value={widget.url} onChange={e => update({ url: e.target.value } as any)} placeholder="https://youtu.be/…" className="h-8 text-sm font-mono" />
      )}

      {widget.kind === 'booking' && (
        <>
          <Input value={widget.label} onChange={e => update({ label: e.target.value } as any)} placeholder="Button label" className="h-8 text-sm" />
          <Input value={widget.url} onChange={e => update({ url: e.target.value } as any)} placeholder="https://cal.com/…" className="h-8 text-sm font-mono" />
        </>
      )}

      {widget.kind === 'payment' && (
        <>
          <Input value={widget.label} onChange={e => update({ label: e.target.value } as any)} placeholder="Label" className="h-8 text-sm" />
          <Input value={widget.description || ''} onChange={e => update({ description: e.target.value } as any)} placeholder="Description (optional)" className="h-8 text-sm" />
          <div className="flex gap-2">
            <Input type="number" value={widget.amount / 100} onChange={e => update({ amount: Math.max(1, Number(e.target.value) || 0) * 100 } as any)} placeholder="Amount" className="h-8 text-sm" />
            <Select value={widget.currency || 'INR'} onValueChange={v => update({ currency: v as any } as any)}>
              <SelectTrigger className="h-8 text-xs w-24"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="INR">INR ₹</SelectItem>
                <SelectItem value="USD">USD $</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}

      {widget.kind === 'email-capture' && (
        <>
          <Input value={widget.heading} onChange={e => update({ heading: e.target.value } as any)} placeholder="Heading" className="h-8 text-sm" />
          <Input value={widget.buttonText} onChange={e => update({ buttonText: e.target.value } as any)} placeholder="Button text" className="h-8 text-sm" />
        </>
      )}

      {widget.kind === 'contact-form' && (
        <>
          <Input value={widget.heading} onChange={e => update({ heading: e.target.value } as any)} placeholder="Heading" className="h-8 text-sm" />
          <Input value={widget.buttonText} onChange={e => update({ buttonText: e.target.value } as any)} placeholder="Button text" className="h-8 text-sm" />
          <div className="flex flex-wrap gap-1">
            {(['name','email','phone','message'] as const).map(f => {
              const on = widget.fields.includes(f);
              return (
                <button key={f} type="button"
                  onClick={() => update({ fields: on ? widget.fields.filter(x => x !== f) : [...widget.fields, f] } as any)}
                  className={`px-2 py-1 rounded-md text-xs border ${on ? 'bg-primary/10 border-primary text-primary' : 'border-border text-muted-foreground'}`}>
                  {f}
                </button>
              );
            })}
          </div>
        </>
      )}

      {widget.kind === 'social-row' && (
        <div className="space-y-2">
          {widget.items.map((s, i) => (
            <div key={i} className="flex gap-2 items-center">
              <Select value={s.platform} onValueChange={v => {
                const items = [...widget.items]; items[i] = { ...items[i], platform: v };
                update({ items } as any);
              }}>
                <SelectTrigger className="h-8 text-xs w-32"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['instagram','twitter','youtube','github','linkedin','music','shop','mail','website'].map(p =>
                    <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
              <Input value={s.url} onChange={e => {
                const items = [...widget.items]; items[i] = { ...items[i], url: e.target.value };
                update({ items } as any);
              }} placeholder="https://" className="h-8 text-xs font-mono flex-1" />
              <button onClick={() => update({ items: widget.items.filter((_, idx) => idx !== i) } as any)}>
                <X className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
              </button>
            </div>
          ))}
          <Button variant="outline" size="sm" className="w-full h-7 text-xs"
            onClick={() => update({ items: [...widget.items, { platform: 'website', url: 'https://' }] } as any)}>
            <Plus className="w-3 h-3 mr-1" /> Add social
          </Button>
        </div>
      )}
    </div>
  );
}

interface AddProps { onAdd: (kind: WidgetKind) => void }

export function WidgetAddMenu({ onAdd }: AddProps) {
  return (
    <div className="grid grid-cols-2 gap-1.5">
      {WIDGET_LIBRARY.map(w => (
        <button key={w.kind} type="button"
          onClick={() => onAdd(w.kind)}
          className="text-left p-2 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors">
          <div className="text-xs font-semibold text-foreground">{w.label}</div>
          <div className="text-[10px] text-muted-foreground line-clamp-1">{w.description}</div>
        </button>
      ))}
    </div>
  );
}

export { defaultWidget };
