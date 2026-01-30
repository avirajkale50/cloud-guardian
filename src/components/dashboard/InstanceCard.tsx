import React from 'react';
import { Instance } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Square, Trash2, Server, Activity, Cpu, HardDrive, Wifi } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InstanceCardProps {
  instance: Instance;
  onStartMonitoring: (id: string) => void;
  onStopMonitoring: (id: string) => void;
  onDelete: (id: string) => void;
  onViewMetrics: (id: string) => void;
  isLoading?: boolean;
}

export const InstanceCard: React.FC<InstanceCardProps> = ({
  instance,
  onStartMonitoring,
  onStopMonitoring,
  onDelete,
  onViewMetrics,
  isLoading,
}) => {
  const capacityPercent = (value: number) => Math.min(100, Math.max(0, value * 100));

  return (
    <div className="glass-card rounded-xl p-5 space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={cn(
            'w-10 h-10 rounded-lg flex items-center justify-center',
            instance.is_monitoring ? 'bg-primary/20' : 'bg-muted'
          )}>
            <Server className={cn(
              'w-5 h-5',
              instance.is_monitoring ? 'text-primary' : 'text-muted-foreground'
            )} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-medium text-foreground">
                {instance.instance_id}
              </span>
              {instance.is_monitoring && (
                <span className="status-dot status-dot-healthy" />
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {instance.instance_type} • {instance.region}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {instance.is_mock && <Badge variant="mock">Mock</Badge>}
          {instance.is_monitoring && <Badge variant="monitoring">Monitoring</Badge>}
        </div>
      </div>

      {/* Capacity indicators */}
      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Cpu className="w-3 h-3" />
            <span>CPU</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-info rounded-full transition-all duration-500"
              style={{ width: `${capacityPercent(instance.cpu_capacity)}%` }}
            />
          </div>
          <p className="text-xs font-mono text-muted-foreground">
            {(instance.cpu_capacity * 100).toFixed(0)}%
          </p>
        </div>
        
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <HardDrive className="w-3 h-3" />
            <span>Memory</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-success to-primary rounded-full transition-all duration-500"
              style={{ width: `${capacityPercent(instance.memory_capacity)}%` }}
            />
          </div>
          <p className="text-xs font-mono text-muted-foreground">
            {(instance.memory_capacity * 100).toFixed(0)}%
          </p>
        </div>
        
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Wifi className="w-3 h-3" />
            <span>Network</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-warning to-destructive rounded-full transition-all duration-500"
              style={{ width: `${capacityPercent(instance.network_capacity)}%` }}
            />
          </div>
          <p className="text-xs font-mono text-muted-foreground">
            {(instance.network_capacity * 100).toFixed(0)}%
          </p>
        </div>
      </div>

      {/* Scale level */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Scale Level</span>
        <span className="font-mono font-medium text-foreground">
          Level {instance.current_scale_level}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-2 border-t border-border/50">
        {instance.is_monitoring ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onStopMonitoring(instance.instance_id)}
            disabled={isLoading}
            className="flex-1"
          >
            <Square className="w-3 h-3 mr-1.5" />
            Stop
          </Button>
        ) : (
          <Button
            variant="default"
            size="sm"
            onClick={() => onStartMonitoring(instance.instance_id)}
            disabled={isLoading}
            className="flex-1"
          >
            <Play className="w-3 h-3 mr-1.5" />
            Start
          </Button>
        )}
        
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onViewMetrics(instance.instance_id)}
          className="flex-1"
        >
          <Activity className="w-3 h-3 mr-1.5" />
          Metrics
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(instance.instance_id)}
          disabled={isLoading || instance.is_monitoring}
          className="text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
