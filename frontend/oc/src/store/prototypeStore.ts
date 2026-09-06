import { create } from 'zustand'

// Prototype-only in-memory state. Not persisted, not a physical schema.
// Field/state/status vocabulary here is taken directly from the Canonical
// contract docs under docs/*_CONTRACT_2026-09-06.md — nothing invented.

export type ActorClass = '외부 파트너' | '내부 직원' | '내부 관리자' | '운영자'
export const ACTOR_CLASSES: ActorClass[] = ['외부 파트너', '내부 직원', '내부 관리자', '운영자']
const ACTOR_RANK: Record<ActorClass, number> = { '외부 파트너': 0, '내부 직원': 1, '내부 관리자': 2, '운영자': 3 }
export function actorRank(actor: ActorClass) { return ACTOR_RANK[actor] }

export type ActivityEntry = {
  id: string
  activityType: string
  sourceDomain: string
  sourceEntityId: string
  customerRef?: string
  actor: ActorClass
  occurredAt: string
  summary: string
}

export type LeadStage = '신규유입' | '가망고객' | 'TM 일정' | '방문영업'
export type Lead = {
  id: string
  stage: LeadStage
  customerName: string
  storeName: string
  contact: string
  source: string
  note: string
  nextAction: string
  createdAt: string
  history: { at: string; event: string }[]
}

export type QuoteLineItem = { id: string; name: string; qty: number; unitPrice: number; listPrice: number; discountReason?: string }
export type QuoteStatus = '작성중' | '발송대기' | '발송' | '확인' | '만료' | '계약전환' | '취소'
export type Quote = {
  id: string
  customerRef: string
  storeRef: string
  salesperson: string
  leadRef?: string
  lineItems: QuoteLineItem[]
  validityPeriod: string
  note: string
  deliveryCondition: string
  status: QuoteStatus
  createdAt: string
  updatedAt: string
  sentAt?: string
  sendFailure?: string
  history: { at: string; event: string }[]
}

export type EsignDocument = { id: string; label: string; required: boolean; selected: boolean; status: '대기' | '발송' | '완료' | '실패' }
export type EsignPlan = { documents: EsignDocument[]; submissionStatus: '없음' | '준비' | '발송중' | '일부완료' | '완료' | '실패'; history: { at: string; event: string }[] }
export type ContractStatus = '작성중' | '발송' | '서명진행' | '완료' | '심의중' | '해지' | '만료'
export type ContractReviewType = '해지' | '명의변경' | '양도양수' | '계약변경'
export type Contract = {
  id: string
  quoteRef?: string
  customerRef: string
  storeRef: string
  status: ContractStatus
  reviewType?: ContractReviewType
  createdAt: string
  esign: EsignPlan
  history: { at: string; event: string }[]
}

export type AsCaseStatus = '접수' | '진단' | '방문필요' | 'VS 배정' | '결과확인' | '종료'
export type AsCase = {
  id: string
  customerRef: string
  storeRef: string
  status: AsCaseStatus
  whatWeKnow: string
  whatWeTried: string
  whatWeNeed: string
  remoteImpossibleReason: string
  processingNotes: { at: string; note: string }[]
  vsRef?: string
  closedAt?: string
}

export type VsEvidence = { photo: boolean; serial: boolean; testResult: boolean; customerConfirm: boolean }
export type VsStatus = '배정' | '도착' | '작업중' | '부분완료' | '재방문' | '완료요청' | 'Verified Complete'
export type VsJob = {
  id: string
  asCaseRef: string
  customerRef: string
  status: VsStatus
  evidence: VsEvidence
  partial?: { completedQty: number; remainingWork: string }
  revisit?: { reason: string }
  customerAbsent?: boolean
  history: { at: string; event: string }[]
}

export type PoStatus = '발주요청' | '발주확정' | '입고대기' | '부분입고' | '입고완료' | '취소'
export type PurchaseOrder = { id: string; vendorRef: string; items: { sku: string; qty: number }[]; status: PoStatus; history: { at: string; event: string }[] }

export type ShipmentStatus = '준비' | '집화' | '이동중' | '배송완료' | '실패' | '반송'
export type Shipment = { id: string; customerRef: string; carrier: string; status: ShipmentStatus; history: { at: string; event: string }[] }

export type InventoryItem = { sku: string; name: string; onHand: number; reserved: number; shortage: boolean }

export type ReceivableStatus = '예정' | '일부입금' | '미수' | '확인필요' | '완료' | '보류'
export type Receivable = {
  id: string
  customerRef: string
  contractRef?: string
  expectedAmount: number
  receivedAmount: number
  dueDate: string
  status: ReceivableStatus
  followUpAt?: string
  followUpNote?: string
}

export type VendorType = '파트너사' | '제조사' | '공급사' | '설치/AS 협력사' | '물류사' | 'VAN/PG/POS'
export type Vendor = {
  id: string
  name: string
  bizRegNo: string
  ceo: string
  contact: string
  address: string
  vendorTypes: VendorType[]
  activeStatus: '활성' | '비활성'
}

export type FieldVisibility = 'visible' | 'masked' | 'hidden'
export type RowScope = 'SELF' | 'ASSIGNED' | 'TEAM' | 'ORG' | 'ALL' | 'NONE'
export type PermissionAction = 'create' | 'edit' | 'change_status' | 'export' | 'delete_deactivate' | 'close' | 'recover'
export type RolePermission = {
  menuAccess: Record<string, boolean>
  rowScope: RowScope
  fieldVisibility: Record<string, FieldVisibility>
  actionPermission: Record<PermissionAction, boolean>
}
export type AuditEntry = { id: string; actor: ActorClass; target: string; before: string; after: string; reason: string; timestamp: string }

function nowStr() {
  return new Intl.DateTimeFormat('ko-KR', { timeZone: 'Asia/Seoul', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date())
}
let seq = 1000
function nextId(prefix: string) { seq += 1; return `${prefix}-${seq}` }

type PrototypeState = {
  actor: ActorClass
  setActor: (actor: ActorClass) => void

  activityLedger: ActivityEntry[]
  appendActivity: (entry: Omit<ActivityEntry, 'id' | 'occurredAt' | 'actor'>) => void

  leads: Lead[]
  advanceLead: (id: string, nextStage: LeadStage) => void

  quotes: Quote[]
  createQuoteFromLead: (leadId: string) => string
  sendQuote: (id: string, forceFail?: boolean) => void
  convertQuoteToContract: (id: string) => string | undefined

  contracts: Contract[]
  startEsignPlan: (contractId: string, documentIds: string[]) => void
  toggleEsignDocument: (contractId: string, documentId: string) => void
  sendForSignature: (contractId: string) => { ok: boolean; reason?: string }
  completeEsignDocument: (contractId: string, documentId: string, outcome: '완료' | '실패') => void

  asCases: AsCase[]
  updateAsCaseHandoffField: (id: string, field: 'whatWeKnow' | 'whatWeTried' | 'whatWeNeed' | 'remoteImpossibleReason', value: string) => void
  addProcessingNote: (id: string, note: string) => void
  createVsHandoff: (asCaseId: string) => { ok: boolean; reason?: string; vsId?: string }
  closeAsCase: (id: string) => { ok: boolean; reason?: string }

  vsJobs: VsJob[]
  vsAdvance: (id: string, status: VsStatus) => void
  vsToggleEvidence: (id: string, key: keyof VsEvidence) => void
  vsRequestPartial: (id: string, completedQty: number, remainingWork: string) => void
  vsRequestRevisit: (id: string, reason: string) => void
  vsVerifiedComplete: (id: string) => { ok: boolean; reason?: string }

  purchaseOrders: PurchaseOrder[]
  advancePo: (id: string, status: PoStatus) => void

  shipments: Shipment[]
  advanceShipment: (id: string, status: ShipmentStatus) => void

  inventory: InventoryItem[]

  receivables: Receivable[]
  recordReceivablePayment: (id: string, amount: number) => { ok: boolean; reason?: string }
  setReceivableFollowUp: (id: string, at: string, note: string) => void
  markReceivableComplete: (id: string) => { ok: boolean; reason?: string }

  vendors: Vendor[]
  toggleVendorActive: (id: string) => void

  permissions: Record<ActorClass, RolePermission>
  auditLog: AuditEntry[]
  setPermission: (actor: ActorClass, patch: Partial<RolePermission>, reason: string, targetLabel: string) => void
  canAccessMenu: (actor: ActorClass, menuId: string) => boolean
}

const seedLeads: Lead[] = [
  { id: 'LEAD-001', stage: '신규유입', customerName: '카페 오렌지', storeName: '강남점', contact: '010-1111-2222', source: '홈페이지 문의', note: '결제 단말 도입 문의', nextAction: '담당자 배정', createdAt: nowStr(), history: [{ at: nowStr(), event: '신규유입 등록' }] },
  { id: 'LEAD-002', stage: '가망고객', customerName: '든든마트', storeName: '분당점', contact: '010-2222-3333', source: 'TM 인바운드', note: '기존 단말 교체 검토', nextAction: 'TM 일정 조율', createdAt: nowStr(), history: [{ at: nowStr(), event: '가망고객 전환' }] },
  { id: 'LEAD-003', stage: 'TM 일정', customerName: '미소상회', storeName: '수원점', contact: '010-3333-4444', source: '방문 영업', note: '10:30 통화 예정', nextAction: 'TM 통화', createdAt: nowStr(), history: [{ at: nowStr(), event: 'TM 일정 등록' }] },
  { id: 'LEAD-004', stage: '방문영업', customerName: '한아름 유통', storeName: '일산점', contact: '010-4444-5555', source: '가망고객 전환', note: '현장 방문 견적 요청', nextAction: '방문 견적 작성', createdAt: nowStr(), history: [{ at: nowStr(), event: '방문 영업 일정 확정' }] },
]

const seedQuotes: Quote[] = [
  {
    id: 'QT-001', customerRef: '한아름 유통', storeRef: '일산점', salesperson: '김영업', leadRef: 'LEAD-004',
    lineItems: [{ id: 'LI-1', name: 'POS 단말 A형', qty: 2, unitPrice: 350000, listPrice: 390000 }],
    validityPeriod: '2026-09-20까지', note: '설치 포함', deliveryCondition: '계약 후 5영업일 이내 설치',
    status: '작성중', createdAt: nowStr(), updatedAt: nowStr(), history: [{ at: nowStr(), event: '견적 작성' }],
  },
]

const seedContracts: Contract[] = [
  {
    id: 'CT-1000', quoteRef: undefined, customerRef: '미소상회', storeRef: '수원점', status: '서명진행', createdAt: nowStr(),
    esign: {
      documents: [
        { id: 'DOC-MAIN', label: '계약서 본문', required: true, selected: true, status: '발송' },
        { id: 'DOC-TERMS', label: '이용약관 동의서', required: true, selected: true, status: '완료' },
        { id: 'DOC-AUTOPAY', label: '자동이체 신청서', required: false, selected: true, status: '발송' },
        { id: 'DOC-INSTALL', label: '설치 확인서', required: false, selected: false, status: '대기' },
      ],
      submissionStatus: '발송중',
      history: [{ at: nowStr(), event: '전자서명 문서 계획 생성' }, { at: nowStr(), event: '전자서명 발송' }, { at: nowStr(), event: 'DOC-TERMS 완료' }],
    },
    history: [{ at: nowStr(), event: '계약 생성' }, { at: nowStr(), event: '전자서명 발송' }],
  },
]

const seedAsCases: AsCase[] = [
  {
    id: 'AS-001', customerRef: '지지컴퍼니', storeRef: '강남점', status: '접수',
    whatWeKnow: '결제 단말 전원이 반복적으로 꺼짐', whatWeTried: '', whatWeNeed: '',
    remoteImpossibleReason: '', processingNotes: [{ at: nowStr(), note: 'CS 접수 - 전원 반복 종료 신고' }],
  },
  {
    id: 'AS-002', customerRef: '든든마트', storeRef: '분당점', status: 'VS 배정',
    whatWeKnow: '영수증 프린터 용지 걸림 반복 발생', whatWeTried: '원격으로 프린터 헤드 초기화 시도, 재부팅 안내',
    whatWeNeed: '프린터 헤드 육안 점검 및 부품 교체 여부 확인', remoteImpossibleReason: '하드웨어 내부 점검 필요 - 원격 진단 불가',
    processingNotes: [{ at: nowStr(), note: 'CS 접수 - 용지 걸림 반복 신고' }, { at: nowStr(), note: '원격 조치 시도 - 미해결, VS 전환' }],
    vsRef: 'VS-1000',
  },
]

const seedVsJobs: VsJob[] = [
  {
    id: 'VS-1000', asCaseRef: 'AS-002', customerRef: '든든마트', status: '도착',
    evidence: { photo: true, serial: true, testResult: false, customerConfirm: false },
    history: [{ at: nowStr(), event: 'CS→VS Handoff 생성' }, { at: nowStr(), event: '배정' }, { at: nowStr(), event: '도착' }],
  },
]

const seedPos: PurchaseOrder[] = [
  { id: 'PO-001', vendorRef: '대성물류', items: [{ sku: 'SKU-POS-A', qty: 10 }], status: '발주확정', history: [{ at: nowStr(), event: '발주 확정' }] },
]
const seedShipments: Shipment[] = [
  { id: 'SHP-001', customerRef: '든든마트', carrier: '로젠택배', status: '이동중', history: [{ at: nowStr(), event: '집화 완료' }] },
]
const seedInventory: InventoryItem[] = [
  { sku: 'SKU-POS-A', name: 'POS 단말 A형', onHand: 24, reserved: 6, shortage: false },
  { sku: 'SKU-POS-B', name: 'POS 단말 B형', onHand: 2, reserved: 4, shortage: true },
]
const seedReceivables: Receivable[] = [
  { id: 'RCV-001', customerRef: '카페 오렌지', contractRef: undefined, expectedAmount: 700000, receivedAmount: 0, dueDate: '2026-09-15', status: '미수' },
  { id: 'RCV-002', customerRef: '든든마트', expectedAmount: 1200000, receivedAmount: 600000, dueDate: '2026-09-10', status: '일부입금' },
]
const seedVendors: Vendor[] = [
  { id: 'VND-001', name: '대성물류', bizRegNo: '123-45-67890', ceo: '박대성', contact: '02-111-2222', address: '서울 강서구', vendorTypes: ['물류사'], activeStatus: '활성' },
  { id: 'VND-002', name: '한아름POS제조', bizRegNo: '234-56-78901', ceo: '이제조', contact: '031-222-3333', address: '경기 화성시', vendorTypes: ['제조사', '설치/AS 협력사'], activeStatus: '활성' },
]

const defaultPermission = (rowScope: RowScope, allow: PermissionAction[]): RolePermission => ({
  menuAccess: { 'settings.permissions': rowScope === 'ORG' || rowScope === 'ALL', 'ops.receivable': true, 'customer360.finance': rowScope === 'ORG' || rowScope === 'ALL' },
  rowScope,
  fieldVisibility: { customerFinanceAmount: rowScope === 'ORG' || rowScope === 'ALL' ? 'visible' : 'masked' },
  actionPermission: {
    create: allow.includes('create'), edit: allow.includes('edit'), change_status: allow.includes('change_status'),
    export: allow.includes('export'), delete_deactivate: allow.includes('delete_deactivate'), close: allow.includes('close'), recover: allow.includes('recover'),
  },
})

export const usePrototypeStore = create<PrototypeState>((set, get) => ({
  actor: '내부 직원',
  setActor: (actor) => set({ actor }),

  activityLedger: [],
  appendActivity: (entry) => set((s) => ({
    activityLedger: [{ id: nextId('ACT'), occurredAt: nowStr(), actor: s.actor, ...entry }, ...s.activityLedger],
  })),

  leads: seedLeads,
  advanceLead: (id, nextStage) => set((s) => ({
    leads: s.leads.map((l) => l.id === id ? { ...l, stage: nextStage, history: [...l.history, { at: nowStr(), event: `${l.stage} → ${nextStage} (수동 전환)` }] } : l),
  })),

  quotes: seedQuotes,
  createQuoteFromLead: (leadId) => {
    const lead = get().leads.find((l) => l.id === leadId)
    const id = nextId('QT')
    const quote: Quote = {
      id, customerRef: lead?.customerName ?? '미지정', storeRef: lead?.storeName ?? '미지정', salesperson: '담당 영업',
      leadRef: leadId, lineItems: [], validityPeriod: '', note: '', deliveryCondition: '', status: '작성중',
      createdAt: nowStr(), updatedAt: nowStr(), history: [{ at: nowStr(), event: '신규 견적 작성' }],
    }
    set((s) => ({ quotes: [quote, ...s.quotes] }))
    get().appendActivity({ activityType: 'quote.created', sourceDomain: 'PST-401', sourceEntityId: id, customerRef: quote.customerRef, summary: `${quote.customerRef} 견적 작성` })
    return id
  },
  sendQuote: (id, forceFail) => set((s) => ({
    quotes: s.quotes.map((q) => {
      if (q.id !== id) return q
      if (forceFail) return { ...q, sendFailure: 'PDF 전송 실패 · 네트워크 오류', history: [...q.history, { at: nowStr(), event: '전송 실패' }] }
      return { ...q, status: '발송', sentAt: nowStr(), sendFailure: undefined, history: [...q.history, { at: nowStr(), event: '견적 발송' }] }
    }),
  })),
  convertQuoteToContract: (id) => {
    const quote = get().quotes.find((q) => q.id === id)
    if (!quote) return undefined
    const contractId = nextId('CT')
    const contract: Contract = {
      id: contractId, quoteRef: id, customerRef: quote.customerRef, storeRef: quote.storeRef, status: '작성중',
      createdAt: nowStr(), esign: { documents: [], submissionStatus: '없음', history: [] }, history: [{ at: nowStr(), event: `견적 ${id} → 계약 전환` }],
    }
    set((s) => ({
      contracts: [contract, ...s.contracts],
      quotes: s.quotes.map((q) => q.id === id ? { ...q, status: '계약전환', history: [...q.history, { at: nowStr(), event: `계약 ${contractId}로 전환 (견적 Snapshot 보존)` }] } : q),
    }))
    get().appendActivity({ activityType: 'contract.created', sourceDomain: 'Contract', sourceEntityId: contractId, customerRef: quote.customerRef, summary: `${quote.customerRef} 계약 생성 (견적 ${id} 전환)` })
    return contractId
  },

  contracts: seedContracts,
  startEsignPlan: (contractId, documentIds) => set((s) => ({
    contracts: s.contracts.map((c) => {
      if (c.id !== contractId) return c
      const catalog: { id: string; label: string; required: boolean }[] = [
        { id: 'DOC-MAIN', label: '계약서 본문', required: true },
        { id: 'DOC-TERMS', label: '이용약관 동의서', required: true },
        { id: 'DOC-AUTOPAY', label: '자동이체 신청서', required: false },
        { id: 'DOC-INSTALL', label: '설치 확인서', required: false },
      ]
      const documents: EsignDocument[] = catalog.map((d) => ({ ...d, selected: documentIds.includes(d.id), status: '대기' }))
      return { ...c, esign: { documents, submissionStatus: '준비', history: [...c.esign.history, { at: nowStr(), event: '전자서명 문서 계획 생성' }] } }
    }),
  })),
  toggleEsignDocument: (contractId, documentId) => set((s) => ({
    contracts: s.contracts.map((c) => c.id !== contractId ? c : {
      ...c, esign: { ...c.esign, documents: c.esign.documents.map((d) => d.id === documentId && !d.required ? { ...d, selected: !d.selected } : d) },
    }),
  })),
  sendForSignature: (contractId) => {
    const contract = get().contracts.find((c) => c.id === contractId)
    if (!contract) return { ok: false, reason: '계약을 찾을 수 없습니다.' }
    const missingRequired = contract.esign.documents.filter((d) => d.required && !d.selected)
    if (missingRequired.length > 0) return { ok: false, reason: `필수 문서 누락: ${missingRequired.map((d) => d.label).join(', ')}` }
    set((s) => ({
      contracts: s.contracts.map((c) => c.id !== contractId ? c : {
        ...c, status: '서명진행',
        esign: { ...c.esign, submissionStatus: '발송중', documents: c.esign.documents.map((d) => d.selected ? { ...d, status: '발송' } : d), history: [...c.esign.history, { at: nowStr(), event: '전자서명 발송' }] },
      }),
    }))
    get().appendActivity({ activityType: 'esign.submission_started', sourceDomain: 'e-sign', sourceEntityId: contractId, customerRef: contract.customerRef, summary: '전자서명 발송 시작' })
    return { ok: true }
  },
  completeEsignDocument: (contractId, documentId, outcome) => set((s) => ({
    contracts: s.contracts.map((c) => {
      if (c.id !== contractId) return c
      const documents = c.esign.documents.map((d) => d.id === documentId ? { ...d, status: outcome } : d)
      const selected = documents.filter((d) => d.selected)
      const allDone = selected.every((d) => d.status === '완료')
      const anyFailed = selected.some((d) => d.status === '실패')
      const submissionStatus: EsignPlan['submissionStatus'] = allDone ? '완료' : anyFailed ? '실패' : '일부완료'
      // e-sign complete never auto-closes the Contract itself (AC-CAL-03).
      return { ...c, esign: { documents, submissionStatus, history: [...c.esign.history, { at: nowStr(), event: `${documentId} ${outcome}` }] } }
    }),
  })),

  asCases: seedAsCases,
  updateAsCaseHandoffField: (id, field, value) => set((s) => ({ asCases: s.asCases.map((a) => a.id === id ? { ...a, [field]: value } : a) })),
  addProcessingNote: (id, note) => set((s) => ({ asCases: s.asCases.map((a) => a.id === id ? { ...a, processingNotes: [...a.processingNotes, { at: nowStr(), note }] } : a) })),
  createVsHandoff: (asCaseId) => {
    const asCase = get().asCases.find((a) => a.id === asCaseId)
    if (!asCase) return { ok: false, reason: 'A/S Case를 찾을 수 없습니다.' }
    if (!asCase.whatWeKnow || !asCase.whatWeTried || !asCase.whatWeNeed || !asCase.remoteImpossibleReason) {
      return { ok: false, reason: 'What we know / tried / need / 원격 불가 사유를 모두 입력해야 VS Handoff를 생성할 수 있습니다.' }
    }
    const vsId = nextId('VS')
    const job: VsJob = { id: vsId, asCaseRef: asCaseId, customerRef: asCase.customerRef, status: '배정', evidence: { photo: false, serial: false, testResult: false, customerConfirm: false }, history: [{ at: nowStr(), event: 'CS→VS Handoff 생성' }] }
    set((s) => ({ vsJobs: [job, ...s.vsJobs], asCases: s.asCases.map((a) => a.id === asCaseId ? { ...a, status: 'VS 배정', vsRef: vsId } : a) }))
    get().appendActivity({ activityType: 'as.vs_handoff_created', sourceDomain: 'PCS-103', sourceEntityId: asCaseId, customerRef: asCase.customerRef, summary: 'CS→VS Handoff 생성' })
    return { ok: true, vsId }
  },
  closeAsCase: (id) => {
    const asCase = get().asCases.find((a) => a.id === id)
    if (!asCase) return { ok: false, reason: 'A/S Case를 찾을 수 없습니다.' }
    const vs = asCase.vsRef ? get().vsJobs.find((v) => v.id === asCase.vsRef) : undefined
    if (asCase.vsRef && vs?.status !== 'Verified Complete') {
      return { ok: false, reason: 'VS Verified Complete 전에는 A/S Case를 종료할 수 없습니다. (VS 완료 ≠ Case Close이지만 완료 확인은 선행되어야 함)' }
    }
    set((s) => ({ asCases: s.asCases.map((a) => a.id === id ? { ...a, status: '종료', closedAt: nowStr() } : a) }))
    get().appendActivity({ activityType: 'as.case_closed', sourceDomain: 'PCS-103', sourceEntityId: id, customerRef: asCase.customerRef, summary: 'A/S Case Close (VS 완료와 별도 명령)' })
    return { ok: true }
  },

  vsJobs: seedVsJobs,
  vsAdvance: (id, status) => set((s) => ({ vsJobs: s.vsJobs.map((v) => v.id === id ? { ...v, status, history: [...v.history, { at: nowStr(), event: status }] } : v) })),
  vsToggleEvidence: (id, key) => set((s) => ({ vsJobs: s.vsJobs.map((v) => v.id === id ? { ...v, evidence: { ...v.evidence, [key]: !v.evidence[key] } } : v) })),
  vsRequestPartial: (id, completedQty, remainingWork) => set((s) => ({
    vsJobs: s.vsJobs.map((v) => v.id === id ? { ...v, status: '부분완료', partial: { completedQty, remainingWork }, history: [...v.history, { at: nowStr(), event: `부분완료 · 잔여: ${remainingWork}` }] } : v),
  })),
  vsRequestRevisit: (id, reason) => set((s) => ({
    vsJobs: s.vsJobs.map((v) => v.id === id ? { ...v, status: '재방문', revisit: { reason }, history: [...v.history, { at: nowStr(), event: `재방문 필요 · 사유: ${reason}` }] } : v),
  })),
  vsVerifiedComplete: (id) => {
    const job = get().vsJobs.find((v) => v.id === id)
    if (!job) return { ok: false, reason: 'VS Job을 찾을 수 없습니다.' }
    const missing = (Object.keys(job.evidence) as (keyof VsEvidence)[]).filter((k) => !job.evidence[k])
    if (missing.length > 0) return { ok: false, reason: `Missing Evidence: ${missing.join(', ')}` }
    set((s) => ({ vsJobs: s.vsJobs.map((v) => v.id === id ? { ...v, status: 'Verified Complete', history: [...v.history, { at: nowStr(), event: 'Verified Complete' }] } : v) }))
    get().appendActivity({ activityType: 'vs.verified_complete', sourceDomain: 'PCS-102', sourceEntityId: id, customerRef: job.customerRef, summary: 'VS Verified Complete (A/S Case Close와 별도)' })
    return { ok: true }
  },

  purchaseOrders: seedPos,
  advancePo: (id, status) => set((s) => ({ purchaseOrders: s.purchaseOrders.map((p) => p.id === id ? { ...p, status, history: [...p.history, { at: nowStr(), event: status }] } : p) })),

  shipments: seedShipments,
  advanceShipment: (id, status) => set((s) => ({ shipments: s.shipments.map((sh) => sh.id === id ? { ...sh, status, history: [...sh.history, { at: nowStr(), event: status }] } : sh) })),

  inventory: seedInventory,

  receivables: seedReceivables,
  recordReceivablePayment: (id, amount) => {
    const r = get().receivables.find((x) => x.id === id)
    if (!r) return { ok: false, reason: '대상을 찾을 수 없습니다.' }
    if (amount <= 0) return { ok: false, reason: '입금액은 0보다 커야 합니다.' }
    const received = r.receivedAmount + amount
    const status: ReceivableStatus = received >= r.expectedAmount ? '확인필요' : '일부입금'
    set((s) => ({ receivables: s.receivables.map((x) => x.id === id ? { ...x, receivedAmount: received, status } : x) }))
    return { ok: true }
  },
  setReceivableFollowUp: (id, at, note) => set((s) => ({ receivables: s.receivables.map((r) => r.id === id ? { ...r, followUpAt: at, followUpNote: note, status: r.status === '완료' ? r.status : '확인필요' } : r) })),
  markReceivableComplete: (id) => {
    const r = get().receivables.find((x) => x.id === id)
    if (!r) return { ok: false, reason: '대상을 찾을 수 없습니다.' }
    if (r.receivedAmount < r.expectedAmount) return { ok: false, reason: '일부입금 상태에서는 완료 처리할 수 없습니다.' }
    set((s) => ({ receivables: s.receivables.map((x) => x.id === id ? { ...x, status: '완료' } : x) }))
    return { ok: true }
  },

  vendors: seedVendors,
  toggleVendorActive: (id) => set((s) => ({ vendors: s.vendors.map((v) => v.id === id ? { ...v, activeStatus: v.activeStatus === '활성' ? '비활성' : '활성' } : v) })),

  permissions: {
    '외부 파트너': defaultPermission('ASSIGNED', []),
    '내부 직원': defaultPermission('TEAM', ['create', 'edit', 'change_status']),
    '내부 관리자': defaultPermission('ORG', ['create', 'edit', 'change_status', 'export', 'close']),
    '운영자': defaultPermission('ALL', ['create', 'edit', 'change_status', 'export', 'delete_deactivate', 'close', 'recover']),
  },
  auditLog: [],
  setPermission: (actor, patch, reason, targetLabel) => set((s) => {
    const before = JSON.stringify(s.permissions[actor])
    const after = { ...s.permissions[actor], ...patch }
    const entry: AuditEntry = { id: nextId('AUD'), actor: s.actor, target: `${actor} · ${targetLabel}`, before, after: JSON.stringify(after), reason, timestamp: nowStr() }
    return { permissions: { ...s.permissions, [actor]: after }, auditLog: [entry, ...s.auditLog] }
  }),
  canAccessMenu: (actor, menuId) => get().permissions[actor]?.menuAccess[menuId] ?? false,
}))
