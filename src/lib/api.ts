export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('codemate_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 401 && !endpoint.includes('/api/auth/login')) {
      // Clear token and redirect to login if session is invalid
      localStorage.removeItem('codemate_token');
      localStorage.removeItem('codemate_user');
      window.location.href = '/login';
    }
    throw new ApiError(data?.error || `Request failed with status ${response.status}`, response.status, data);
  }

  return data as T;
}
