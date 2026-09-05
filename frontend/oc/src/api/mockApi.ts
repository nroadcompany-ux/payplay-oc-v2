import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4100',
  timeout: 5000,
})

export type MockResource = Record<string, unknown> & { mode?: string }
export type ActionPreview = MockResource & { persisted?: boolean; result?: Record<string, unknown> }

export async function fetchMockResource(path: string): Promise<MockResource> {
  const { data } = await api.get<MockResource>(path)
  return data
}

export async function previewMockAction(path: string, payload: Record<string, unknown>): Promise<ActionPreview> {
  const { data } = await api.post<ActionPreview>(path, payload)
  return data
}

export const mockEndpoints = {
  customer360: (id = 'CUST-MOCK-001') => `/mock/customer360/${id}`,
  today: '/mock/today',
  service: (id = 'AS-MOCK-001') => `/mock/service/as-case/${id}`,
  serviceAction: '/mock/service/action',
  sales: '/mock/sales',
  salesAction: '/mock/sales/action',
  operations: '/mock/operations',
  operationsAction: '/mock/operations/action',
  settings: '/mock/settings',
  settingsAction: '/mock/settings/action',
} as const
