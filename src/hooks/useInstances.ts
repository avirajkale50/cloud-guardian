import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { instancesApi, metricsApi, Instance, Metric, ScalingDecision, Pagination } from '@/lib/api';
import { toast } from 'sonner';

export const useInstances = () => {
  return useQuery({
    queryKey: ['instances'],
    queryFn: instancesApi.getAll,
    refetchInterval: 30000, // Refresh every 30 seconds
  });
};

export const useRegisterInstance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: instancesApi.register,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instances'] });
      toast.success('Instance registered successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to register instance');
    },
  });
};

export const useStartMonitoring = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: instancesApi.startMonitoring,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instances'] });
      toast.success('Monitoring started');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to start monitoring');
    },
  });
};

export const useStopMonitoring = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: instancesApi.stopMonitoring,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instances'] });
      toast.success('Monitoring stopped');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to stop monitoring');
    },
  });
};

export const useDeleteInstance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: instancesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instances'] });
      toast.success('Instance deleted');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete instance');
    },
  });
};

export const useMetrics = (instanceId: string, page = 1, pageSize = 20) => {
  return useQuery({
    queryKey: ['metrics', instanceId, page, pageSize],
    queryFn: () => metricsApi.getMetrics(instanceId, page, pageSize),
    enabled: !!instanceId,
    refetchInterval: 30000,
  });
};

export const useDecisions = (instanceId: string, page = 1, pageSize = 20) => {
  return useQuery({
    queryKey: ['decisions', instanceId, page, pageSize],
    queryFn: () => metricsApi.getDecisions(instanceId, page, pageSize),
    enabled: !!instanceId,
    refetchInterval: 15000,
  });
};

export const useSimulateMetrics = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: metricsApi.simulate,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['metrics'] });
      queryClient.invalidateQueries({ queryKey: ['decisions'] });
      
      if (data.metrics_created) {
        toast.success(`Created ${data.metrics_created} metrics over ${data.duration_minutes} minutes`);
      } else {
        toast.success('Metric simulated successfully');
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to simulate metrics');
    },
  });
};
