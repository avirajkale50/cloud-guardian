import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

const variantStyles = {
  default: {
    bg: 'bg-primary/10',
    icon: 'text-primary',
    glow: 'group-hover:glow-primary',
  },
  success: {
    bg: 'bg-success/10',
    icon: 'text-success',
    glow: 'group-hover:glow-success',
  },
  warning: {
    bg: 'bg-warning/10',
    icon: 'text-warning',
    glow: 'group-hover:glow-warning',
  },
  danger: {
    bg: 'bg-destructive/10',
    icon: 'text-destructive',
    glow: 'group-hover:glow-danger',
  },
  info: {
    bg: 'bg-info/10',
    icon: 'text-info',
    glow: 'group-hover:glow-primary',
  },
};

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default',
}) => {
  const styles = variantStyles[variant];

  return (
    <div className={cn(
      'group glass-card rounded-xl p-6 transition-all duration-300 hover:scale-[1.02]',
      styles.glow
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="metric-value text-foreground">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
          {trend && (
            <p className={cn(
              'text-xs font-medium',
              trend.isPositive ? 'text-success' : 'text-destructive'
            )}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% from last hour
            </p>
          )}
        </div>
        <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', styles.bg)}>
          <Icon className={cn('w-6 h-6', styles.icon)} />
        </div>
      </div>
    </div>
  );
};
