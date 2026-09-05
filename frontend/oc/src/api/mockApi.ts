import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4100',
  timeout: 5000,
})

export type MockResource = Record<string, unknown> & { mode?: string }

export async function fetchMockResource(path: string): Promise<MockResource> {
  const { data } = await api.get<MockResource>(path)
  return data
}

export const mockEndpoints = {
  customer360: (id = 'CUST-MOCK-001') => `/mock/customer360/${id}`,
  today: '/mock/today',
  service: (id = 'AS-MOCK-001') => `/mock/service/as-case/${id}`,
  sales: '/mock/sales',
  operations: '/mock/operations',
  settings: '/mock/settings',
} as const
