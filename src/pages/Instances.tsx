import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { InstanceCard } from '@/components/dashboard/InstanceCard';
import { AddInstanceDialog } from '@/components/dashboard/AddInstanceDialog';
import {
  useInstances,
  useRegisterInstance,
  useStartMonitoring,
  useStopMonitoring,
  useDeleteInstance,
} from '@/hooks/useInstances';
import { useNavigate } from 'react-router-dom';
import { Server, Filter } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { cn } from '@/lib/utils';

type FilterType = 'all' | 'monitoring' | 'mock' | 'real';

const Instances: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<FilterType>('all');
  const { data: instances, isLoading } = useInstances();
  const registerMutation = useRegisterInstance();
  const startMonitoringMutation = useStartMonitoring();
  const stopMonitoringMutation = useStopMonitoring();
  const deleteMutation = useDeleteInstance();

  const handleAddInstance = async (data: {
    instance_id: string;
    instance_type: string;
    region: string;
    is_mock?: boolean;
  }) => {
    await registerMutation.mutateAsync(data);
  };

  const filteredInstances = instances?.filter((instance) => {
    switch (filter) {
      case 'monitoring':
        return instance.is_monitoring;
      case 'mock':
        return instance.is_mock;
      case 'real':
        return !instance.is_mock;
      default:
        return true;
    }
  });

  const filterCounts = {
    all: instances?.length || 0,
    monitoring: instances?.filter((i) => i.is_monitoring).length || 0,
    mock: instances?.filter((i) => i.is_mock).length || 0,
    real: instances?.filter((i) => !i.is_mock).length || 0,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Instances</h1>
            <p className="text-muted-foreground">
              Manage your cloud instances and monitoring
            </p>
          </div>
          <AddInstanceDialog
            onAdd={handleAddInstance}
            isLoading={registerMutation.isPending}
          />
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-muted-foreground" />
          {(['all', 'monitoring', 'mock', 'real'] as FilterType[]).map((f) => (
            <Button
              key={f}
              variant={filter === f ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(f)}
              className="gap-2"
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              <Badge variant="secondary" className="ml-1">
                {filterCounts[f]}
              </Badge>
            </Button>
          ))}
        </div>

        {/* Instances Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-xl" />
            ))}
          </div>
        ) : filteredInstances && filteredInstances.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredInstances.map((instance) => (
              <InstanceCard
                key={instance.id}
                instance={instance}
                onStartMonitoring={startMonitoringMutation.mutate}
                onStopMonitoring={stopMonitoringMutation.mutate}
                onDelete={deleteMutation.mutate}
                onViewMetrics={(id) => navigate(`/metrics?instance=${id}`)}
                isLoading={
                  startMonitoringMutation.isPending ||
                  stopMonitoringMutation.isPending ||
                  deleteMutation.isPending
                }
              />
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-xl p-12 text-center">
            <Server className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              {filter === 'all' ? 'No instances registered' : `No ${filter} instances`}
            </h3>
            <p className="text-muted-foreground mb-6">
              {filter === 'all'
                ? 'Add your first instance to start monitoring cloud resources.'
                : `No instances match the "${filter}" filter.`}
            </p>
            {filter === 'all' && (
              <AddInstanceDialog
                onAdd={handleAddInstance}
                isLoading={registerMutation.isPending}
              />
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Instances;
