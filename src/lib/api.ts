import { z } from 'zod';

const API_BASE_URL = 'http://localhost:5000/api';

// Schemas
export const userSchema = z.object({
  user_id: z.string().uuid(),
  email: z.string().email(),
  created_at: z.string(),
  instance_count: z.number(),
  monitoring_count: z.number(),
});

export const instanceSchema = z.object({
  id: z.string().uuid(),
  instance_id: z.string(),
  instance_type: z.string(),
  region: z.string(),
  is_monitoring: z.boolean(),
  is_mock: z.boolean(),
  cpu_capacity: z.number(),
  memory_capacity: z.number(),
  network_capacity: z.number(),
  current_scale_level: z.number(),
  created_at: z.string().optional(),
});

export const metricSchema = z.object({
  id: z.string().uuid(),
  instance_id: z.string(),
  timestamp: z.string(),
  cpu_utilization: z.number().nullable(),
  memory_usage: z.number().nullable(),
  network_in: z.number().nullable(),
  network_out: z.number().nullable(),
  is_outlier: z.boolean(),
  outlier_type: z.enum(['scale_up', 'scale_down']).nullable(),
});

export const scalingDecisionSchema = z.object({
  id: z.string().uuid(),
  instance_id: z.string(),
  timestamp: z.string(),
  cpu_utilization: z.number().nullable(),
  memory_usage: z.number().nullable(),
  network_in: z.number().nullable(),
  network_out: z.number().nullable(),
  decision: z.enum(['scale_up', 'scale_down', 'no_action']),
  reason: z.string(),
});

export const paginationSchema = z.object({
  page: z.number(),
  page_size: z.number(),
  total_count: z.number(),
  total_pages: z.number(),
  has_next: z.boolean(),
  has_prev: z.boolean(),
});

export type User = z.infer<typeof userSchema>;
export type Instance = z.infer<typeof instanceSchema>;
export type Metric = z.infer<typeof metricSchema>;
export type ScalingDecision = z.infer<typeof scalingDecisionSchema>;
export type Pagination = z.infer<typeof paginationSchema>;

// Token management
const TOKEN_KEY = 'autoscaler_token';

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

// API client
const apiClient = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
};

// Auth endpoints
export const authApi = {
  register: async (email: string, password: string) => {
    return apiClient<{ message: string; user_id: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  login: async (email: string, password: string) => {
    const response = await apiClient<{ message: string; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setToken(response.token);
    return response;
  },

  getMe: async () => {
    return apiClient<User>('/auth/me');
  },

  logout: () => {
    removeToken();
  },
};

// Instances endpoints
export const instancesApi = {
  getAll: async () => {
    const response = await apiClient<{ instances: Instance[] }>('/instances/');
    return response.instances;
  },

  register: async (data: {
    instance_id: string;
    instance_type: string;
    region: string;
    is_mock?: boolean;
  }) => {
    return apiClient<{ message: string; instance: Instance }>('/instances/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  startMonitoring: async (instanceId: string) => {
    return apiClient<{ message: string }>(`/instances/${instanceId}/monitor/start`, {
      method: 'PATCH',
    });
  },

  stopMonitoring: async (instanceId: string) => {
    return apiClient<{ message: string }>(`/instances/${instanceId}/monitor/stop`, {
      method: 'PATCH',
    });
  },

  delete: async (instanceId: string) => {
    return apiClient<{ message: string }>(`/instances/${instanceId}`, {
      method: 'DELETE',
    });
  },
};

// Metrics endpoints
export const metricsApi = {
  getMetrics: async (instanceId: string, page = 1, pageSize = 20) => {
    return apiClient<{
      instance_id: string;
      metrics: Metric[];
      pagination: Pagination;
    }>(`/metrics/${instanceId}?page=${page}&page_size=${pageSize}`);
  },

  getDecisions: async (instanceId: string, page = 1, pageSize = 20) => {
    return apiClient<{
      instance_id: string;
      decisions: ScalingDecision[];
      pagination: Pagination;
    }>(`/metrics/decisions/${instanceId}?page=${page}&page_size=${pageSize}`);
  },

  simulate: async (data: {
    instance_id: string;
    cpu_utilization?: number;
    memory_usage?: number;
    network_in?: number;
    network_out?: number;
    duration_minutes?: number;
    interval_seconds?: number;
  }) => {
    return apiClient<{
      message: string;
      metric?: Metric;
      metrics_created?: number;
      duration_minutes?: number;
      interval_seconds?: number;
      sample_metrics?: object[];
    }>('/metrics/simulate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// Health check
export const healthCheck = async () => {
  return apiClient<{ message: string; version: string }>('/');
};
