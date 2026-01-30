import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { MetricsChart } from '@/components/dashboard/MetricsChart';
import { DecisionsTable } from '@/components/dashboard/DecisionsTable';
import { SimulateMetricsDialog } from '@/components/dashboard/SimulateMetricsDialog';
import { useInstances, useMetrics, useDecisions, useSimulateMetrics } from '@/hooks/useInstances';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Activity, TrendingUp, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';

const Metrics: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedInstance = searchParams.get('instance') || '';
  const [metricsPage, setMetricsPage] = useState(1);
  const [decisionsPage, setDecisionsPage] = useState(1);

  const { data: instances } = useInstances();
  const { data: metricsData, isLoading: metricsLoading, refetch: refetchMetrics } = useMetrics(
    selectedInstance,
    metricsPage,
    20
  );
  const { data: decisionsData, isLoading: decisionsLoading, refetch: refetchDecisions } = useDecisions(
    selectedInstance,
    decisionsPage,
    20
  );
  const simulateMutation = useSimulateMetrics();

  const handleInstanceChange = (value: string) => {
    setSearchParams({ instance: value });
    setMetricsPage(1);
    setDecisionsPage(1);
  };

  const handleSimulate = async (data: Parameters<typeof simulateMutation.mutateAsync>[0]) => {
    await simulateMutation.mutateAsync(data);
  };

  const selectedInstanceData = instances?.find((i) => i.instance_id === selectedInstance);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Metrics & Scaling</h1>
            <p className="text-muted-foreground">
              View metrics and scaling decisions for your instances
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={selectedInstance} onValueChange={handleInstanceChange}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Select an instance" />
              </SelectTrigger>
              <SelectContent>
                {instances?.map((instance) => (
                  <SelectItem key={instance.instance_id} value={instance.instance_id}>
                    <div className="flex items-center gap-2">
                      <span className="font-mono">{instance.instance_id}</span>
                      {instance.is_monitoring && (
                        <span className="status-dot status-dot-healthy" />
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedInstance && selectedInstanceData?.is_mock && (
              <SimulateMetricsDialog
                instanceId={selectedInstance}
                onSimulate={handleSimulate}
                isLoading={simulateMutation.isPending}
              />
            )}
          </div>
        </div>

        {!selectedInstance ? (
          <div className="glass-card rounded-xl p-12 text-center">
            <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              Select an instance
            </h3>
            <p className="text-muted-foreground">
              Choose an instance from the dropdown to view its metrics and scaling decisions.
            </p>
          </div>
        ) : (
          <Tabs defaultValue="metrics" className="space-y-6">
            <div className="flex items-center justify-between">
              <TabsList className="bg-muted/50">
                <TabsTrigger value="metrics" className="gap-2">
                  <Activity className="w-4 h-4" />
                  Metrics
                  {metricsData && (
                    <Badge variant="secondary">{metricsData.pagination.total_count}</Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="decisions" className="gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Scaling Decisions
                  {decisionsData && (
                    <Badge variant="secondary">{decisionsData.pagination.total_count}</Badge>
                  )}
                </TabsTrigger>
              </TabsList>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  refetchMetrics();
                  refetchDecisions();
                }}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>

            <TabsContent value="metrics" className="space-y-4">
              {metricsLoading ? (
                <Skeleton className="h-80 rounded-xl" />
              ) : metricsData?.metrics && metricsData.metrics.length > 0 ? (
                <>
                  <MetricsChart metrics={metricsData.metrics} />
                  
                  {/* Pagination */}
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Showing {metricsData.metrics.length} of {metricsData.pagination.total_count} metrics
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setMetricsPage((p) => p - 1)}
                        disabled={!metricsData.pagination.has_prev}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <span className="text-sm text-muted-foreground">
                        Page {metricsData.pagination.page} of {metricsData.pagination.total_pages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setMetricsPage((p) => p + 1)}
                        disabled={!metricsData.pagination.has_next}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="glass-card rounded-xl p-12 text-center">
                  <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    No metrics yet
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {selectedInstanceData?.is_monitoring
                      ? 'Metrics will appear here once collected.'
                      : 'Start monitoring to collect metrics.'}
                  </p>
                  {selectedInstanceData?.is_mock && (
                    <SimulateMetricsDialog
                      instanceId={selectedInstance}
                      onSimulate={handleSimulate}
                      isLoading={simulateMutation.isPending}
                    />
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="decisions" className="space-y-4">
              {decisionsLoading ? (
                <Skeleton className="h-80 rounded-xl" />
              ) : decisionsData?.decisions && decisionsData.decisions.length > 0 ? (
                <>
                  <DecisionsTable decisions={decisionsData.decisions} />
                  
                  {/* Pagination */}
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Showing {decisionsData.decisions.length} of {decisionsData.pagination.total_count} decisions
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDecisionsPage((p) => p - 1)}
                        disabled={!decisionsData.pagination.has_prev}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <span className="text-sm text-muted-foreground">
                        Page {decisionsData.pagination.page} of {decisionsData.pagination.total_pages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDecisionsPage((p) => p + 1)}
                        disabled={!decisionsData.pagination.has_next}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="glass-card rounded-xl p-12 text-center">
                  <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    No scaling decisions
                  </h3>
                  <p className="text-muted-foreground">
                    Scaling decisions will appear here once the system evaluates metrics.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Metrics;
