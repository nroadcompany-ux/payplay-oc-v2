import { useMutation } from '@tanstack/react-query'
import { useEffect, useMemo, useState, type ReactElement } from 'react'
import { Navigate, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router'
import { mockEndpoints, previewMockAction, type ActionPreview } from '../api/mockApi'
import { ACTOR_CLASSES, type ActorClass, actorRank, usePrototypeStore } from '../store/prototypeStore'
import { EmptyState, FieldMasked, LiveContract, type NavigationState } from './shared'
import { AsCaseScreen } from './screens/AsCaseScreen'
import { VsScreen } from './screens/VsScreen'
import { SalesQueueScreen } from './screens/SalesQueueScreen'
import { QuoteScreen } from './screens/QuoteScreen'
import { ContractScreen } from './screens/ContractScreen'
import { EsignScreen } from './screens/EsignScreen'
import { OperationsScreen } from './screens/OperationsScreen'
import { VendorScreen } from './screens/VendorScreen'
import { PermissionScreen } from './screens/PermissionScreen'

// Canonical 2-tier IA — mirrors contracts/menu-registry.json + docs/SIDEBAR_IA_BASELINE.md.
// `path` is present only for menus that already have an implemented Pilot/Batch screen;
// items without one render as disabled placeholders rather than new fabricated screens.
type MenuLeaf = { id: string; label: string; path?: string; hold?: boolean; mergedNote?: string }
type MenuCategory = { id: string; label: string; hold?: boolean; items: MenuLeaf[] }

const CATEGORY_MENU: MenuCategory[] = [
  {
    id: 'company', label: '회사정보', items: [
      { id: 'PCI-101', label: '업무 홈', path: '/home' },
      { id: 'PCI-102', label: '공지사항' },
      { id: 'PCI-103', label: '회사 360' },
      { id: 'PCI-104', label: '운영 매뉴얼' },
      { id: 'PCI-201', label: '거래처 관리', path: '/vendors' },
      { id: 'PCI-202', label: '거래처 상세', mergedNote: '/vendors 화면에 포함' },
    ],
  },
  {
    id: 'sales', label: '영업관리', items: [
      { id: 'PST-101', label: '신규유입', path: '/sales' },
      { id: 'PST-102', label: '가망고객', mergedNote: '영업 Queue 화면에 포함' },
      { id: 'PST-103', label: 'TM 영업 일정', mergedNote: '영업 Queue 화면에 포함' },
      { id: 'PST-201', label: '방문 영업 일정', mergedNote: '영업 Queue 화면에 포함' },
      { id: 'PST-401', label: '견적서 관리', path: '/quotes' },
      { id: 'PST-402', label: '견적서 상세', mergedNote: '/quotes 화면에 포함' },
      { id: 'PST-302', label: '계약 심의(변경·해지)', path: '/contracts' },
      { id: 'PST-303', label: '계약 만료 고객', mergedNote: '/contracts 화면에 포함' },
      { id: 'PST-490', label: '영업도구' },
    ],
  },
  {
    id: 'customer', label: '고객관리', items: [
      { id: 'PST-301', label: '고객 360', path: '/customers' },
      { id: 'PCS-101', label: 'TODAY', path: '/today' },
      { id: 'PCS-102', label: '신규설치 및 A/S 방문', path: '/field-service' },
      { id: 'PCS-103', label: 'A/S 접수', path: '/as-cases' },
      { id: 'PCS-104', label: '택배 및 제품 수발주', path: '/operations' },
      { id: 'PCS-105', label: '결제 및 미수금 관리', mergedNote: 'PCS-104 화면에 포함' },
      { id: 'PCS-106', label: '재고관리', mergedNote: 'PCS-104 화면에 포함' },
      { id: 'PCS-190', label: 'CS도구' },
    ],
  },
  {
    id: 'teamplay', label: '팀플레이', items: [
      { id: 'PHR-101', label: '우리 팀', path: '/team' },
      { id: 'PHR-102', label: '구성원' },
      { id: 'PHR-103', label: '역할·업무분장' },
      { id: 'PHR-104', label: '보고·협업' },
      { id: 'PHR-105', label: '근무·휴가' },
      { id: 'PHR-107', label: '내 정보' },
      { id: 'PHR-108', label: '내 업무 도구' },
    ],
  },
  {
    id: 'management', label: '경영관리', hold: true, items: [
      { id: 'PMG-101', label: '경영 현황', hold: true },
      { id: 'PMG-102', label: '정산 관리', hold: true },
      { id: 'PMG-103', label: '지출결의', hold: true },
      { id: 'PMG-104', label: '수수료·보상', hold: true },
      { id: 'PMG-201', label: '차량관리', hold: true },
      { id: 'PMG-202', label: '주차관리', hold: true },
    ],
  },
  {
    id: 'settings', label: '설정관리', items: [
      { id: 'PSET-101', label: '운영 설정' },
      { id: 'PSET-102', label: '권한 설정', path: '/settings/permissions' },
      { id: 'PSET-103', label: '화면·메뉴 설정', path: '/settings/menu' },
      { id: 'PSET-104', label: '업무 Rule 설정' },
      { id: 'PSET-105', label: '변경 이력·복구' },
      { id: 'PSET-106', label: 'System 설정', hold: true },
    ],
  },
]

const MENU = CATEGORY_MENU.flatMap((category) => category.items)
  .filter((item): item is MenuLeaf & { path: string } => Boolean(item.path))
  .map((item) => [item.id, item.label, item.path] as const)

function categoryForPath(pathname: string): MenuCategory | undefined {
  return CATEGORY_MENU.find((category) => category.items.some((item) => item.path === pathname))
}

function firstPathOf(category: MenuCategory): string | undefined {
  return category.items.find((item) => item.path)?.path
}

type ScreenSpec = { id: string; title: string; summary: string; state: string; cards: Array<{ label: string; value: string; note: string }>; guard: string; returnRule: string }
type NavAction = { label: string; target: string; note: string }
type PreviewAction = { label: string; endpoint: string; action: string; sourceId: string; payload?: Record<string, unknown>; tone?: 'primary' | 'secondary' }

const SCREENS: Record<string, ScreenSpec> = {
  '/home': { id: 'PCI-101', title: '업무 홈', summary: '원본 Transaction을 직접 수정하지 않는 Work Projection.', state: '정상 · 지연 · 보류', cards: [{ label: '오늘 처리', value: '12', note: 'Source Domain으로 Drill-down' }, { label: '보류', value: '3', note: '원인과 원본 업무 링크 유지' }, { label: '방문 예정', value: '5', note: 'VS/TM/방문영업 일정 Projection' }], guard: 'Projection에서 원본 업무 직접 수정 금지', returnRule: 'Source 처리 후 기존 Home/TODAY Context로 복귀' },
  '/today': { id: 'PCS-101', title: 'TODAY', summary: '업무별 Source를 모아 보여주는 실행 Queue.', state: '오늘 · 지연 · 보류 · 완료', cards: [{ label: '오늘', value: '2', note: 'Source 상세 진입' }, { label: '지연', value: '1', note: 'Source State 기준' }, { label: '완료', value: '1', note: 'VS는 Verified Complete만 반영' }], guard: 'TODAY = Work Projection, Source Truth 아님', returnRule: 'Source 완료/취소 후 Queue Context 유지' },
  '/customers': { id: 'PST-301', title: '고객 360', summary: 'Canonical Customer Context. 업무별 View는 중복 Customer Master가 아니다.', state: '기본정보 · 진행업무 · 최근이력', cards: [{ label: '현재 진행', value: '견적 1 · A/S 1', note: '각 Domain Owner로 이동' }, { label: '최근 이력', value: '8건', note: 'Activity Ledger 기반' }, { label: 'Quick Action', value: 'A/S 접수', note: 'Domain Action 후 Customer360 Return' }], guard: '신규유입/가망/TM/방문영업 별도 고객 Master 생성 금지', returnRule: 'Domain 완료/취소 → 동일 Customer Context 복귀' },
  '/field-service': { id: 'PCS-102', title: '신규설치 및 A/S 방문', summary: '현장 Action과 Evidence를 분리하고 Verified Complete Gate를 적용.', state: '작업중 · 부분완료 · 재방문 · 완료', cards: [{ label: '필수 Evidence', value: '사진 · Serial · Test · 고객확인', note: '누락 시 완료 불가' }, { label: '부분완료', value: '허용', note: '완료 수량/잔여 작업 기록' }, { label: 'Verified Complete', value: 'Gate', note: '필수 Evidence 충족 후' }], guard: '이동중/Offline/기사 중복배정 Exact Rule은 HOLD', returnRule: '결과 → Activity Ledger → Customer360 / TODAY' },
  '/as-cases': { id: 'PCS-103', title: 'A/S 접수', summary: 'CS 진단 → 필요 시 VS Handoff → 별도 Case Close.', state: '접수 · 진단 · 방문필요 · 결과 · 종료', cards: [{ label: 'What we know', value: '필수', note: '현재까지 확인된 사실' }, { label: 'What we tried', value: '필수', note: '원격 처리 시도' }, { label: 'What we need', value: '필수', note: '현장 요청사항' }], guard: 'VS 완료 ≠ A/S Case Close / 자동 Close 금지', returnRule: 'Case 결과와 Close는 분리 명령' },
  '/vendors': { id: 'PCI-201', title: '거래처 관리', summary: '파트너·제조사·공급사·VAN/PG/POS 등을 하나의 거래처 Master에서 유형으로 구분.', state: '목록 · 상세 · 유형', cards: [{ label: '거래처 유형', value: '다중', note: '중복 Master 금지' }, { label: '상태', value: '활성/비활성', note: 'History 유지' }, { label: '관련 업무', value: '계약/수발주/AS', note: 'Domain Link' }], guard: '거래처 유형별 별도 Master 생성 금지', returnRule: '관련 Domain 처리 후 거래처 Context 복귀' },
  '/team': { id: 'PHR-101', title: '우리 팀', summary: '직원/조직 Canonical Surface. Physical IAM은 별도 HOLD.', state: '조직 · 구성원 · 업무분장', cards: [{ label: '구성원', value: 'Mock', note: 'Logical employee reference' }, { label: '역할', value: '업무분장', note: '권한과 표시 역할 분리' }, { label: 'IAM', value: 'HOLD', note: 'Physical Auth schema 미연결' }], guard: 'PHR-106 신규 생성 금지', returnRule: '조직/업무분장 변경은 Audit 대상' },
  '/settings/permissions': { id: 'PSET-102', title: '권한 설정', summary: 'Menu + Row Scope + Field Visibility + Action Permission.', state: '외부 파트너 · 내부 직원 · 내부 관리자 · 운영자', cards: [{ label: 'Row Scope', value: 'Required', note: '조회 범위' }, { label: 'Field', value: 'Required', note: '민감 필드 표시 제어' }, { label: 'Action', value: 'Required', note: '명령 권한' }], guard: 'Legacy allow-all RLS 재사용 금지 / Default Deny', returnRule: '변경 시 Audit Before/After' },
  '/settings/menu': { id: 'PSET-103', title: '화면·메뉴 설정', summary: 'Canonical ID는 고정하고 표시값만 설정.', state: '표시명 · 순서 · 노출', cards: [{ label: 'Canonical ID', value: 'LOCKED', note: 'Route/Data Owner 변경 금지' }, { label: 'Display Name', value: 'Editable', note: '표시 문구만 변경' }, { label: 'Visibility', value: 'Editable', note: 'Permission과 함께 평가' }], guard: 'PMG/PSET-106를 설정으로 임의 승격 금지', returnRule: '설정 변경 → Audit Log → Shell 재조회' },
  '/sales': { id: 'PST-101', title: '영업 Queue', summary: '신규유입 → 가망 → TM/방문 → 견적 → 계약 Handoff.', state: '수동 전이', cards: [], guard: 'Customer Master 중복 생성 및 자동 상태전이 금지', returnRule: '업무 완료/취소 → Customer360 Context 복귀' },
  '/quotes': { id: 'PST-401', title: '견적서 관리', summary: '견적 작성 · 수정 · PDF · 전송 · 상태 · 계약 전환.', state: '작성중 · 발송 · 계약전환', cards: [], guard: '할인·수수료 Formula 미확정 값 임의 구현 금지', returnRule: '계약전환 후 Customer360 Context 유지' },
  '/contracts': { id: 'PST-302', title: '계약 관리', summary: '계약 심의(변경·해지) 4유형과 전자서명 연결.', state: '작성중 · 서명진행 · 완료', cards: [], guard: 'e-sign 완료가 계약 자동완료를 의미하지 않음', returnRule: '계약 처리 후 Customer360 Context 유지' },
  '/esign': { id: 'e-Sign', title: '전자서명 문서 선택', summary: '문서 선택 → 발송 준비 → Submission Status.', state: '준비 · 발송중 · 완료', cards: [], guard: 'Provider Credential/Production Binding 금지', returnRule: '실패/재시도 History 삭제 금지' },
}

const API_BY_PATH: Record<string, string | undefined> = {
  '/settings/menu': mockEndpoints.settings,
}

const NAV_ACTIONS: Record<string, NavAction[]> = {
  '/home': [{ label: 'TODAY 열기', target: '/today', note: 'Work Projection으로 이동' }],
}

function PreviewResult({ value }: { value?: ActionPreview }) {
  if (!value) return null
  return <div className="preview-result"><strong>ACTION PREVIEW · 저장 안 됨</strong><code>{JSON.stringify(value, null, 2)}</code></div>
}

function WorkflowActions({ path }: { path: string }) {
  const mutation = useMutation({ mutationFn: (item: PreviewAction) => previewMockAction(item.endpoint, { action: item.action, sourceId: item.sourceId, payload: item.payload }) })
  const actions = useMemo<PreviewAction[]>(() => {
    if (path === '/settings/menu') return [
      { label: '표시명 변경 Preview', endpoint: mockEndpoints.settingsAction, action: 'MENU_DISPLAY_CHANGE', sourceId: 'PSET-103', payload: { field: 'displayName', before: '고객 360', after: '고객관리' } },
      { label: 'Canonical ID 변경 시도', endpoint: mockEndpoints.settingsAction, action: 'MENU_ID_CHANGE', sourceId: 'PSET-103', payload: { field: 'canonicalId', before: 'PST-301', after: 'PST-999' }, tone: 'secondary' },
    ]
    return []
  }, [path])
  if (!actions.length) return null
  return <div className="workflow-zone"><div className="section-label">업무 동작 Mock</div><div className="workflow-actions">{actions.map((item) => <button key={item.label} className={item.tone === 'secondary' ? 'btn-secondary' : 'btn-primary'} onClick={() => mutation.mutate(item)} disabled={mutation.isPending}>{item.label}</button>)}</div>{mutation.isError ? <p className="inline-error">Action Preview 실패 · 실제 상태는 변경되지 않았습니다.</p> : null}<PreviewResult value={mutation.data} /></div>
}

function MockScreen({ spec }: { spec: ScreenSpec }) {
  const location = useLocation(); const navigate = useNavigate()
  const endpoint = API_BY_PATH[location.pathname]; const navActions = NAV_ACTIONS[location.pathname] ?? []; const navState = (location.state ?? {}) as NavigationState
  const go = (action: NavAction) => navigate(action.target, { state: { returnTo: location.pathname, originLabel: spec.title } satisfies NavigationState })
  return <section className="panel">
    <div className="screen-head"><div><span className="eyebrow">{spec.id}</span><h1>{spec.title}</h1><p>{spec.summary}</p></div><span className="state-pill">{spec.state}</span></div>
    <div className="card-grid">{spec.cards.map((card) => <article className="metric-card" key={card.label}><small>{card.label}</small><strong>{card.value}</strong><p>{card.note}</p></article>)}</div>
    {navActions.length ? <div className="action-zone">{navActions.map((action, index) => <button key={action.label} className={index === 0 ? 'btn-primary' : 'btn-secondary'} onClick={() => go(action)}><strong>{action.label}</strong><span>{action.note}</span></button>)}</div> : null}
    <WorkflowActions path={location.pathname} />
    {navState.returnTo ? <div className="return-strip"><span>{navState.originLabel ?? '이전 Context'}에서 진입</span><button className="btn-tertiary" onClick={() => navigate(navState.returnTo!)}>이전 Context로 돌아가기</button></div> : null}
    <div className="rule-grid"><article><small>Guard</small><strong>{spec.guard}</strong></article><article><small>Return</small><strong>{spec.returnRule}</strong></article></div>
    {endpoint ? <LiveContract endpoint={endpoint} /> : null}
    <p className="hold-note">Logical/Mock only · Physical DB / Provider / Production Binding = HOLD</p>
  </section>
}

type TodayState = '오늘' | '지연' | '보류' | '완료'
type TodayItem = { id: string; title: string; customer: string; sourceLabel: string; sourcePath: string; state: TodayState; mine: boolean; attention?: string; minActor?: ActorClass }

const TODAY_STATES: TodayState[] = ['오늘', '지연', '보류', '완료']
const TODAY_ITEMS: TodayItem[] = [
  { id: 'WRK-1001', title: 'A/S 방문 일정 조율', customer: '지지컴퍼니 강남점', sourceLabel: 'A/S 접수', sourcePath: '/as-cases', state: '오늘', mine: true },
  { id: 'WRK-1002', title: '견적 회신 확인', customer: '한아름 유통', sourceLabel: '영업 Queue', sourcePath: '/quotes', state: '지연', mine: true, attention: '고객 회신 2일 지연' },
  { id: 'WRK-1003', title: '설치 일정 보류', customer: '미소상회', sourceLabel: '신규설치 및 A/S 방문', sourcePath: '/field-service', state: '보류', mine: true, attention: '부품 입고 대기' },
  { id: 'WRK-1004', title: '정기 점검 Verified Complete', customer: '든든마트', sourceLabel: '신규설치 및 A/S 방문', sourcePath: '/field-service', state: '완료', mine: true },
  { id: 'WRK-1005', title: '거래처 계약 갱신 확인', customer: '대성물류', sourceLabel: '거래처 관리', sourcePath: '/vendors', state: '오늘', mine: false, minActor: '내부 관리자' },
]

function TodayScreen() {
  const location = useLocation()
  const navigate = useNavigate()
  const navState = (location.state ?? {}) as NavigationState
  const spec = SCREENS['/today']
  const actor = usePrototypeStore((s) => s.actor)
  const visibleItems = useMemo(() => TODAY_ITEMS.filter((item) => !item.minActor || actorRank(actor) >= actorRank(item.minActor)), [actor])
  const mine = visibleItems.filter((item) => item.mine)
  const attention = mine.filter((item) => item.attention)
  const recentDone = visibleItems.filter((item) => item.state === '완료')
  const [selectedId, setSelectedId] = useState<string>(mine[0]?.id ?? visibleItems[0]?.id ?? TODAY_ITEMS[0].id)
  const selected = visibleItems.find((item) => item.id === selectedId) ?? mine[0] ?? visibleItems[0]
  const openSource = () => { if (selected) navigate(selected.sourcePath, { state: { returnTo: '/today', originLabel: 'TODAY' } satisfies NavigationState }) }

  return <section className="panel">
    <div className="screen-head"><div><span className="eyebrow">{spec.id}</span><h1>{spec.title}</h1><p>{spec.summary}</p></div></div>
    <div className="metric-row">
      {TODAY_STATES.map((state) => <div className="metric-item" key={state}>
        <span>{state} {visibleItems.filter((item) => item.state === state).length}</span>
      </div>)}
    </div>
    <div className="plain-columns">
      <div>
        <div className="section-label">내 업무</div>
        <ul className="plain-list">
          {mine.map((item) => <li key={item.id}>
            <button type="button" className={item.id === selectedId ? 'plain-row active' : 'plain-row'} onClick={() => setSelectedId(item.id)}>
              <strong>{item.title}</strong>
              <span>{item.customer} · {item.state}{item.attention ? ' · 주의' : ''}</span>
            </button>
          </li>)}
        </ul>
      </div>
      <div>
        <div className="section-label">주의 필요</div>
        {attention.length ? <ul className="plain-list">{attention.map((item) => <li key={item.id} className="plain-row"><strong>{item.title}</strong><span>{item.attention}</span></li>)}</ul> : <p className="plain-empty">해당 없음</p>}
      </div>
      <div>
        <div className="section-label">최근 완료</div>
        <ul className="plain-list">{recentDone.map((item) => <li key={item.id} className="plain-row"><strong>{item.title}</strong><span>{item.customer}</span></li>)}</ul>
      </div>
    </div>
    {selected ? <div className="detail-panel">
      <div className="section-label">선택 업무 · Customer/Source Context</div>
      <strong className="detail-title">{selected.title}</strong>
      <span className="detail-subline">고객: {selected.customer} · Source: {selected.sourceLabel} · 상태: {selected.state}{selected.attention ? ` · ${selected.attention}` : ''}</span>
      <button type="button" className="btn-primary" onClick={openSource}><strong>Source 열기</strong><span>{selected.sourceLabel}로 이동 · Projection은 원본을 수정하지 않음</span></button>
    </div> : <EmptyState message="현재 권한으로 표시 가능한 업무가 없습니다." />}
    {navState.returnTo ? <div className="return-strip"><span>{navState.originLabel ?? '이전 Context'}에서 진입</span><button className="btn-tertiary" onClick={() => navigate(navState.returnTo!)}>이전 Context로 돌아가기</button></div> : null}
    <div className="rule-grid"><article><small>Guard</small><strong>{spec.guard}</strong></article><article><small>Return</small><strong>{spec.returnRule}</strong></article></div>
    <LiveContract endpoint={mockEndpoints.today} />
    <p className="hold-note">Logical/Mock only · Physical DB / Provider / Production Binding = HOLD</p>
  </section>
}

type CustomerActivity = { id: string; time: string; label: string; note: string }
type CustomerWork = { id: string; label: string; state: string; path: string }

const CUSTOMER_MOCK = {
  name: '지지컴퍼니 강남점',
  storeCode: 'STR-00231',
  status: '활성',
  tier: '일반 가맹',
  contact: '김OO 매니저 · 010-****-1234',
  region: '서울 강남구',
  contractType: '표준 이용약관',
}
const CUSTOMER_WORK: CustomerWork[] = [
  { id: 'WRK-2001', label: '견적 진행중 · PST-401', state: '견적 검토', path: '/quotes' },
  { id: 'WRK-2002', label: 'A/S 진행중 · PCS-103', state: '진단 완료 · 방문 필요', path: '/as-cases' },
]
const CUSTOMER_ACTIVITY: CustomerActivity[] = [
  { id: 'ACT-01', time: '09-05 14:20', label: 'A/S 접수', note: '결제 단말 오류 신고' },
  { id: 'ACT-02', time: '09-03 11:05', label: '견적 발송', note: 'PST-401 견적서 #Q-2298' },
  { id: 'ACT-03', time: '08-28 10:00', label: 'VS Verified Complete', note: '정기 점검 완료' },
]
const CUSTOMER_ATTENTION = [{ id: 'ATT-01', label: '견적 회신 대기 2일 경과', action: '영업·견적에서 후속 연락' }]

function CustomerScreen() {
  const location = useLocation()
  const navigate = useNavigate()
  const navState = (location.state ?? {}) as NavigationState
  const spec = SCREENS['/customers']
  const go = (target: string, originLabel: string) => navigate(target, { state: { returnTo: '/customers', originLabel } satisfies NavigationState })
  const actor = usePrototypeStore((s) => s.actor)
  const financeVisibility = usePrototypeStore((s) => s.permissions[s.actor].fieldVisibility.customerFinanceAmount)

  return <section className="panel">
    <div className="screen-head"><div><span className="eyebrow">{spec.id}</span><h1>{spec.title}</h1><p>{spec.summary}</p></div></div>
    <div className="detail-panel customer-identity">
      <strong className="detail-title">{CUSTOMER_MOCK.name} · {CUSTOMER_MOCK.storeCode} · 담당 {CUSTOMER_MOCK.contact.split(' ')[0]} · Open Case {CUSTOMER_WORK.length}</strong>
      <span className="detail-subline">상태 {CUSTOMER_MOCK.status} · {CUSTOMER_MOCK.tier} · {CUSTOMER_MOCK.region} · {CUSTOMER_MOCK.contractType}</span>
      <span className="detail-subline">미수 정산 금액: {financeVisibility === 'visible' ? '700,000원' : <FieldMasked />} <small>({actor})</small></span>
    </div>
    <div className="plain-columns plain-columns-4">
      <div>
        <div className="section-label">진행 업무</div>
        <ul className="plain-list">{CUSTOMER_WORK.map((item) => <li key={item.id}>
          <button type="button" className="plain-row" onClick={() => go(item.path, '고객 360')}>
            <strong>{item.label}</strong>
            <span>{item.state}</span>
          </button>
        </li>)}</ul>
      </div>
      <div>
        <div className="section-label">최근 Activity</div>
        <ul className="plain-list">{CUSTOMER_ACTIVITY.map((item) => <li key={item.id} className="plain-row"><strong>{item.time} {item.label}</strong><span>{item.note}</span></li>)}</ul>
      </div>
      <div>
        <div className="section-label">Attention · Next Action</div>
        {CUSTOMER_ATTENTION.length ? <ul className="plain-list">{CUSTOMER_ATTENTION.map((item) => <li key={item.id} className="plain-row"><strong>{item.label}</strong><span>{item.action}</span></li>)}</ul> : <p className="plain-empty">해당 없음</p>}
      </div>
      <div>
        <div className="section-label">Quick Action</div>
        <div className="plain-actions">
          <button type="button" className="btn-primary" onClick={() => go('/as-cases', '고객 360')}><strong>A/S 접수</strong><span>Customer360 Quick Action</span></button>
          <button type="button" className="btn-link" onClick={() => go('/quotes', '고객 360')}>영업·견적 열기 →</button>
        </div>
      </div>
    </div>
    {navState.returnTo ? <div className="return-strip"><span>{navState.originLabel ?? '이전 Context'}에서 진입</span><button className="btn-tertiary" onClick={() => navigate(navState.returnTo!)}>이전 Context로 돌아가기</button></div> : null}
    <div className="rule-grid"><article><small>Guard</small><strong>{spec.guard}</strong></article><article><small>Return</small><strong>{spec.returnRule}</strong></article></div>
    <LiveContract endpoint={mockEndpoints.customer360()} />
    <p className="hold-note">Logical/Mock only · Physical DB / Provider / Production Binding = HOLD</p>
  </section>
}

const dateFormatter = new Intl.DateTimeFormat('ko-KR', { timeZone: 'Asia/Seoul', month: 'long', day: 'numeric' })
const weekdayFormatter = new Intl.DateTimeFormat('ko-KR', { timeZone: 'Asia/Seoul', weekday: 'short' })
const timeFormatter = new Intl.DateTimeFormat('ko-KR', { timeZone: 'Asia/Seoul', hour: '2-digit', minute: '2-digit', hour12: false })

function useNow() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000)
    return () => clearInterval(timer)
  }, [])
  return now
}

function PrimarySidebar({ activeCategoryId }: { activeCategoryId: string }) {
  const navigate = useNavigate()
  return <aside className="sidebar-primary">
    <span className="brand-mark" aria-hidden="true">P</span>
    <nav>
      {CATEGORY_MENU.map((category) => {
        const target = firstPathOf(category)
        const disabled = category.hold || !target
        return (
          <button
            key={category.id}
            type="button"
            className={category.id === activeCategoryId ? 'active' : undefined}
            onClick={() => target && navigate(target)}
            disabled={disabled}
            aria-current={category.id === activeCategoryId}
            aria-disabled={disabled}
          >
            <span>{category.label}</span>
            {category.hold ? <small className="hold-tag">HOLD</small> : null}
          </button>
        )
      })}
    </nav>
  </aside>
}

function SecondarySidebar({ category }: { category: MenuCategory }) {
  return <aside className="sidebar-secondary">
    <div className="sidebar-secondary-head">{category.label}</div>
    <nav>
      {category.items.map((item) => item.path
        ? <NavLink key={item.id} to={item.path} className={({ isActive }) => isActive ? 'active' : undefined}><small>{item.id}</small><span>{item.label}</span></NavLink>
        : <div key={item.id} className="nav-disabled" aria-disabled="true"><small>{item.id}</small><span>{item.label}</span><em>{item.mergedNote ?? (item.hold ? 'HOLD' : '준비중')}</em></div>)}
    </nav>
  </aside>
}

function HeaderShall({ category, screenTitle }: { category?: MenuCategory; screenTitle?: string }) {
  const now = useNow()
  const actor = usePrototypeStore((s) => s.actor)
  const setActor = usePrototypeStore((s) => s.setActor)
  return <header className="shell-header">
    <div className="header-context">
      <span className="crumb-cat">{category?.label ?? 'PayPlay OC'}</span>
      {screenTitle ? <><span className="crumb-sep">/</span><span className="crumb-page">{screenTitle}</span></> : null}
    </div>
    <div className="header-search">
      <input type="search" placeholder="검색" aria-label="검색" />
    </div>
    <div className="header-user">
      <select className="role-select" value={actor} aria-label="테스트 역할" onChange={(e) => setActor(e.target.value as ActorClass)}>
        {ACTOR_CLASSES.map((a) => <option key={a} value={a}>{a}</option>)}
      </select>
    </div>
    <div className="header-clock">
      <span>{dateFormatter.format(now)} ({weekdayFormatter.format(now)})</span>
      <strong>{timeFormatter.format(now)}</strong>
    </div>
  </header>
}

const DEDICATED_ROUTES: Record<string, () => ReactElement> = {
  '/today': TodayScreen,
  '/customers': CustomerScreen,
  '/field-service': VsScreen,
  '/as-cases': AsCaseScreen,
  '/sales': SalesQueueScreen,
  '/quotes': QuoteScreen,
  '/contracts': ContractScreen,
  '/esign': EsignScreen,
  '/operations': OperationsScreen,
  '/vendors': VendorScreen,
  '/settings/permissions': PermissionScreen,
}

export function App() {
  const location = useLocation()
  const activeCategory = categoryForPath(location.pathname) ?? CATEGORY_MENU[0]
  const screenTitle = SCREENS[location.pathname]?.title

  return <div className="shell">
    <PrimarySidebar activeCategoryId={activeCategory.id} />
    <SecondarySidebar category={activeCategory} />
    <HeaderShall category={activeCategory} screenTitle={screenTitle} />
    <main className="content">
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        {Object.entries(DEDICATED_ROUTES).map(([path, Component]) => <Route key={path} path={path} element={<Component />} />)}
        {MENU.filter(([, , path]) => !(path in DEDICATED_ROUTES)).map(([, , path]) => <Route key={path} path={path} element={<MockScreen spec={SCREENS[path]} />} />)}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </main>
  </div>
}
