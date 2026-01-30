import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Zap, Loader2 } from 'lucide-react';

const simulateSchema = z.object({
  cpu_utilization: z.number().min(0).max(100).optional(),
  memory_usage: z.number().min(0).max(100).optional(),
  network_in: z.number().min(0).optional(),
  network_out: z.number().min(0).optional(),
  duration_minutes: z.number().min(1).max(60).optional(),
  interval_seconds: z.number().min(10).max(300).optional(),
  is_prolonged: z.boolean().default(false),
});

type SimulateForm = z.infer<typeof simulateSchema>;

interface SimulateMetricsDialogProps {
  instanceId: string;
  onSimulate: (data: {
    instance_id: string;
    cpu_utilization?: number;
    memory_usage?: number;
    network_in?: number;
    network_out?: number;
    duration_minutes?: number;
    interval_seconds?: number;
  }) => Promise<void>;
  isLoading?: boolean;
}

export const SimulateMetricsDialog: React.FC<SimulateMetricsDialogProps> = ({
  instanceId,
  onSimulate,
  isLoading,
}) => {
  const [open, setOpen] = useState(false);
  
  const {
    setValue,
    watch,
    handleSubmit,
    reset,
  } = useForm<SimulateForm>({
    resolver: zodResolver(simulateSchema),
    defaultValues: {
      cpu_utilization: 50,
      memory_usage: 50,
      network_in: 1024000,
      network_out: 512000,
      duration_minutes: 5,
      interval_seconds: 30,
      is_prolonged: false,
    },
  });

  const values = watch();

  const onSubmit = async (data: SimulateForm) => {
    const payload: Parameters<typeof onSimulate>[0] = {
      instance_id: instanceId,
      cpu_utilization: data.cpu_utilization,
      memory_usage: data.memory_usage,
      network_in: data.network_in,
      network_out: data.network_out,
    };

    if (data.is_prolonged) {
      payload.duration_minutes = data.duration_minutes;
      payload.interval_seconds = data.interval_seconds;
    }

    await onSimulate(payload);
    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="warning" size="sm">
          <Zap className="w-4 h-4 mr-2" />
          Simulate
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg bg-card border-border">
        <DialogHeader>
          <DialogTitle>Simulate Metrics</DialogTitle>
          <DialogDescription>
            Inject simulated metrics for testing scaling decisions.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
          {/* CPU Utilization */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>CPU Utilization</Label>
              <span className="font-mono text-sm text-primary">
                {values.cpu_utilization?.toFixed(0)}%
              </span>
            </div>
            <Slider
              value={[values.cpu_utilization || 0]}
              onValueChange={([value]) => setValue('cpu_utilization', value)}
              max={100}
              step={1}
              className="w-full"
            />
          </div>

          {/* Memory Usage */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Memory Usage</Label>
              <span className="font-mono text-sm text-success">
                {values.memory_usage?.toFixed(0)}%
              </span>
            </div>
            <Slider
              value={[values.memory_usage || 0]}
              onValueChange={([value]) => setValue('memory_usage', value)}
              max={100}
              step={1}
              className="w-full"
            />
          </div>

          {/* Network */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="network_in">Network In (bytes)</Label>
              <Input
                id="network_in"
                type="number"
                value={values.network_in}
                onChange={(e) => setValue('network_in', parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="network_out">Network Out (bytes)</Label>
              <Input
                id="network_out"
                type="number"
                value={values.network_out}
                onChange={(e) => setValue('network_out', parseInt(e.target.value) || 0)}
              />
            </div>
          </div>

          {/* Prolonged simulation toggle */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div>
              <Label htmlFor="is_prolonged" className="text-sm font-medium">
                Prolonged Simulation
              </Label>
              <p className="text-xs text-muted-foreground">
                Generate multiple metrics over time
              </p>
            </div>
            <Switch
              id="is_prolonged"
              checked={values.is_prolonged}
              onCheckedChange={(checked) => setValue('is_prolonged', checked)}
            />
          </div>

          {/* Prolonged options */}
          {values.is_prolonged && (
            <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-muted/30 border border-border/50">
              <div className="space-y-2">
                <Label htmlFor="duration_minutes">Duration (minutes)</Label>
                <Input
                  id="duration_minutes"
                  type="number"
                  min={1}
                  max={60}
                  value={values.duration_minutes}
                  onChange={(e) => setValue('duration_minutes', parseInt(e.target.value) || 5)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="interval_seconds">Interval (seconds)</Label>
                <Input
                  id="interval_seconds"
                  type="number"
                  min={10}
                  max={300}
                  value={values.interval_seconds}
                  onChange={(e) => setValue('interval_seconds', parseInt(e.target.value) || 30)}
                />
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" variant="warning" disabled={isLoading} className="flex-1">
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Simulating...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Simulate
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
