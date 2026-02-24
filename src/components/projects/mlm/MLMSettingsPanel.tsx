import { useState, useEffect, useCallback } from 'react';
import { Loader2, Save } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import type { TreeView, MLMSettings } from './types';
import { DEFAULT_MLM_SETTINGS } from './types';

interface MLMSettingsPanelProps {
  view: TreeView;
}

function parseSettings(raw: Record<string, string>): MLMSettings {
  return {
    direct_bonus: Number(raw.direct_bonus) || DEFAULT_MLM_SETTINGS.direct_bonus,
    indirect_bonus: Number(raw.indirect_bonus) || DEFAULT_MLM_SETTINGS.indirect_bonus,
    pairing_bonus: Number(raw.pairing_bonus) || DEFAULT_MLM_SETTINGS.pairing_bonus,
    strong_leg_retention: raw.strong_leg_retention === undefined
      ? DEFAULT_MLM_SETTINGS.strong_leg_retention
      : raw.strong_leg_retention === 'true',
    fifth_pair_reward: (raw.fifth_pair_reward === 'money' || raw.fifth_pair_reward === 'voucher')
      ? raw.fifth_pair_reward
      : DEFAULT_MLM_SETTINGS.fifth_pair_reward,
    max_pairs_per_day: Number(raw.max_pairs_per_day) || DEFAULT_MLM_SETTINGS.max_pairs_per_day,
  };
}

export default function MLMSettingsPanel({ view }: MLMSettingsPanelProps) {
  const [settings, setSettings] = useState<MLMSettings>(DEFAULT_MLM_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    fetch('/api/mlm/settings')
      .then((res) => res.json())
      .then((raw) => {
        if (raw && typeof raw === 'object' && !raw.error) {
          setSettings(parseSettings(raw));
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const update = useCallback(<K extends keyof MLMSettings>(key: K, value: MLMSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload: Record<string, string> = {};
      for (const [k, v] of Object.entries(settings)) {
        payload[k] = String(v);
      }
      const res = await fetch('/api/mlm/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const raw = await res.json();
      if (raw && typeof raw === 'object' && !raw.error) {
        setSettings(parseSettings(raw));
      }
      setDirty(false);
    } catch {
      // API unavailable
    }
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="border border-border/50 rounded-lg bg-card/50 p-3 my-2 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-mono font-bold text-muted-foreground">
          {view === 'unilevel' ? 'Referral Bonus Settings' : 'Matching Bonus Settings'}
        </h4>
        <button
          data-interactive
          onClick={handleSave}
          disabled={!dirty || isSaving}
          className="flex items-center gap-1 text-[10px] font-mono px-2 py-1 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
          Save
        </button>
      </div>

      {view === 'unilevel' ? (
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-muted-foreground">Direct Bonus ($)</label>
            <Input
              data-interactive
              type="number"
              min={0}
              value={settings.direct_bonus}
              onChange={(e) => update('direct_bonus', Number(e.target.value) || 0)}
              className="h-8 text-xs"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-muted-foreground">Indirect Bonus ($)</label>
            <Input
              data-interactive
              type="number"
              min={0}
              value={settings.indirect_bonus}
              onChange={(e) => update('indirect_bonus', Number(e.target.value) || 0)}
              className="h-8 text-xs"
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-muted-foreground">Pairing Bonus ($)</label>
            <Input
              data-interactive
              type="number"
              min={0}
              value={settings.pairing_bonus}
              onChange={(e) => update('pairing_bonus', Number(e.target.value) || 0)}
              className="h-8 text-xs"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-muted-foreground">Max Pairs Per Day</label>
            <Input
              data-interactive
              type="number"
              min={1}
              value={settings.max_pairs_per_day}
              onChange={(e) => update('max_pairs_per_day', Number(e.target.value) || 1)}
              className="h-8 text-xs"
            />
          </div>
          <div className="flex items-center justify-between col-span-2 sm:col-span-1">
            <label className="text-[10px] font-mono text-muted-foreground">Strong Leg Retention</label>
            <Switch
              data-interactive
              checked={settings.strong_leg_retention}
              onCheckedChange={(val) => update('strong_leg_retention', val)}
            />
          </div>
          <div className="space-y-1 col-span-2 sm:col-span-1">
            <label className="text-[10px] font-mono text-muted-foreground">5th Pair Reward</label>
            <Select
              value={settings.fifth_pair_reward}
              onValueChange={(val) => update('fifth_pair_reward', val as 'money' | 'voucher')}
            >
              <SelectTrigger className="h-8 text-xs" data-interactive>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="money">Money</SelectItem>
                <SelectItem value="voucher">Voucher</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
}
