import React from 'react';
import { ScalingDecision } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface DecisionsTableProps {
  decisions: ScalingDecision[];
}

const decisionConfig = {
  scale_up: {
    icon: TrendingUp,
    variant: 'scale_up' as const,
    label: 'Scale Up',
  },
  scale_down: {
    icon: TrendingDown,
    variant: 'scale_down' as const,
    label: 'Scale Down',
  },
  no_action: {
    icon: Minus,
    variant: 'no_action' as const,
    label: 'No Action',
  },
};

export const DecisionsTable: React.FC<DecisionsTableProps> = ({ decisions }) => {
  if (decisions.length === 0) {
    return (
      <div className="glass-card rounded-xl p-8 text-center">
        <p className="text-muted-foreground">No scaling decisions recorded yet</p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-border/50 hover:bg-transparent">
            <TableHead className="text-muted-foreground">Timestamp</TableHead>
            <TableHead className="text-muted-foreground">Decision</TableHead>
            <TableHead className="text-muted-foreground">CPU</TableHead>
            <TableHead className="text-muted-foreground">Memory</TableHead>
            <TableHead className="text-muted-foreground hidden md:table-cell">Network</TableHead>
            <TableHead className="text-muted-foreground">Reason</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {decisions.map((decision) => {
            const config = decisionConfig[decision.decision];
            if (!config) {
              console.warn('Unexpected decision value:', decision.decision, 'for decision:', decision);
            }
            const finalConfig = config || decisionConfig.no_action;
            const Icon = finalConfig.icon;

            return (
              <TableRow key={decision.id} className="border-border/50">
                <TableCell className="font-mono text-sm">
                  {format(new Date(decision.timestamp), 'MMM d, HH:mm:ss')}
                </TableCell>
                <TableCell>
                  <Badge variant={finalConfig.variant} className="gap-1">
                    <Icon className="w-3 h-3" />
                    {finalConfig.label}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono">
                  {decision.cpu_utilization?.toFixed(1) ?? '-'}%
                </TableCell>
                <TableCell className="font-mono">
                  {decision.memory_usage?.toFixed(1) ?? '-'}%
                </TableCell>
                <TableCell className="font-mono hidden md:table-cell">
                  <span className="text-xs">
                    ↓{decision.network_in ? (decision.network_in / 1024).toFixed(0) : '-'}KB{' '}
                    ↑{decision.network_out ? (decision.network_out / 1024).toFixed(0) : '-'}KB
                  </span>
                </TableCell>
                <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                  {decision.reason}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
