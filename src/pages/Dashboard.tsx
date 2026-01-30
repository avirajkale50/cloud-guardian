import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { InstanceCard } from '@/components/dashboard/InstanceCard';
import { AddInstanceDialog } from '@/components/dashboard/AddInstanceDialog';
import { useAuth } from '@/contexts/AuthContext';
import {
  useInstances,
  useRegisterInstance,
  useStartMonitoring,
  useStopMonitoring,
  useDeleteInstance,
} from '@/hooks/useInstances';
import { useNavigate } from 'react-router-dom';
import { Server, Activity, TrendingUp, AlertTriangle, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: instances, isLoading } = useInstances();
  const registerMutation = useRegisterInstance();
  const startMonitoringMutation = useStartMonitoring();
  const stopMonitoringMutation = useStopMonitoring();
  const deleteMutation = useDeleteInstance();

  const monitoringCount = instances?.filter((i) => i.is_monitoring).length || 0;
  const mockCount = instances?.filter((i) => i.is_mock).length || 0;

  const handleAddInstance = async (data: {
    instance_id: string;
    instance_type: string;
    region: string;
    is_mock?: boolean;
  }) => {
    await registerMutation.mutateAsync(data);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.email?.split('@')[0]}
            </p>
          </div>
          <AddInstanceDialog
            onAdd={handleAddInstance}
            isLoading={registerMutation.isPending}
          />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Instances"
            value={instances?.length || 0}
            icon={Server}
            variant="info"
          />
          <StatsCard
            title="Monitoring Active"
            value={monitoringCount}
            subtitle={`${instances?.length ? ((monitoringCount / instances.length) * 100).toFixed(0) : 0}% of total`}
            icon={Activity}
            variant="success"
          />
          <StatsCard
            title="Mock Instances"
            value={mockCount}
            subtitle="Testing without AWS"
            icon={TrendingUp}
            variant="warning"
          />
          <StatsCard
            title="Real Instances"
            value={(instances?.length || 0) - mockCount}
            subtitle="Connected to AWS"
            icon={AlertTriangle}
            variant="default"
          />
        </div>

        {/* Instances Grid */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Your Instances
          </h2>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-64 rounded-xl" />
              ))}
            </div>
          ) : instances && instances.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {instances.map((instance) => (
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
                No instances registered
              </h3>
              <p className="text-muted-foreground mb-6">
                Add your first instance to start monitoring cloud resources.
              </p>
              <AddInstanceDialog
                onAdd={handleAddInstance}
                isLoading={registerMutation.isPending}
              />
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
