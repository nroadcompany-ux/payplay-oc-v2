import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { Navigate, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router'
import { fetchMockResource, mockEndpoints, previewMockAction, type ActionPreview } from '../api/mockApi'

// Canonical 2-tier IA — mirrors contracts/menu-registry.json + docs/SIDEBAR_IA_BASELINE.md.
// `path` is present only for menus that already have an implemented Pilot/Batch screen;
// items without one render as disabled placeholders rather than new fabricated screens.
type MenuLeaf = { id: string; label: string; path?: string; hold?: boolean }
type MenuCategory = { id: string; label: string; hold?: boolean; items: MenuLeaf[] }

const CATEGORY_MENU: MenuCategory[] = [
  {
    id: 'company', label: '회사정보', items: [
      { id: 'PCI-101', label: '업무 홈', path: '/home' },
      { id: 'PCI-102', label: '공지사항' },
      { id: 'PCI-103', label: '회사 360' },
      { id: 'PCI-104', label: '운영 매뉴얼' },
      { id: 'PCI-201', label: '거래처 관리', path: '/vendors' },
      { id: 'PCI-202', label: '거래처 상세' },
    ],
  },
  {
    id: 'sales', label: '영업관리', items: [
      { id: 'PST-101', label: '신규유입' },
      { id: 'PST-102', label: '가망고객' },
      { id: 'PST-103', label: 'TM 영업 일정' },
      { id: 'PST-201', label: '방문 영업 일정' },
      { id: 'PST-401', label: '견적서 관리', path: '/sales' },
      { id: 'PST-402', label: '견적서 상세' },
      { id: 'PST-302', label: '계약 심의(변경·해지)' },
      { id: 'PST-303', label: '계약 만료 고객' },
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
      { id: 'PCS-105', label: '결제 및 미수금 관리', path: '/operations' },
      { id: 'PCS-106', label: '재고관리', path: '/operations' },
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

type ScreenSpec = { id: string; title: string; summary: string; state: string; cards: Array<{ label: string; value: string; note: string }>; guard: string; returnRule: string }
type NavigationState = { returnTo?: string; originLabel?: string }
type NavAction = { label: string; target: string; note: string }
type PreviewAction = { label: string; endpoint: string; action: string; sourceId: string; payload?: Record<string, unknown>; tone?: 'primary' | 'secondary' }

const SCREENS: Record<string, ScreenSpec> = {
  '/home': { id: 'PCI-101', title: '업무 홈', summary: '원본 Transaction을 직접 수정하지 않는 Work Projection.', state: '정상 · 지연 · 보류', cards: [{ label: '오늘 처리', value: '12', note: 'Source Domain으로 Drill-down' }, { label: '보류', value: '3', note: '원인과 원본 업무 링크 유지' }, { label: '방문 예정', value: '5', note: 'VS/TM/방문영업 일정 Projection' }], guard: 'Projection에서 원본 업무 직접 수정 금지', returnRule: 'Source 처리 후 기존 Home/TODAY Context로 복귀' },
  '/today': { id: 'PCS-101', title: 'TODAY', summary: '업무별 Source를 모아 보여주는 실행 Queue.', state: '예정 · 진행 · 보류 · 완료', cards: [{ label: '예정', value: '6', note: 'Source 상세 진입' }, { label: '진행', value: '4', note: 'Source State 기준' }, { label: '완료', value: '2', note: 'VS는 Verified Complete만 반영' }], guard: 'TODAY = Work Projection, Source Truth 아님', returnRule: 'Source 완료/취소 후 Queue Context 유지' },
  '/customers': { id: 'PST-301', title: '고객 360', summary: 'Canonical Customer Context. 업무별 View는 중복 Customer Master가 아니다.', state: '기본정보 · 진행업무 · 최근이력', cards: [{ label: '현재 진행', value: '견적 1 · A/S 1', note: '각 Domain Owner로 이동' }, { label: '최근 이력', value: '8건', note: 'Activity Ledger 기반' }, { label: 'Quick Action', value: 'A/S 접수', note: 'Domain Action 후 Customer360 Return' }], guard: '신규유입/가망/TM/방문영업 별도 고객 Master 생성 금지', returnRule: 'Domain 완료/취소 → 동일 Customer Context 복귀' },
  '/field-service': { id: 'PCS-102', title: '신규설치 및 A/S 방문', summary: '현장 Action과 Evidence를 분리하고 Verified Complete Gate를 적용.', state: '작업중 · 부분완료 · 재방문 · 완료', cards: [{ label: '필수 Evidence', value: '사진 · Serial · Test · 고객확인', note: '누락 시 완료 불가' }, { label: '부분완료', value: '허용', note: '완료 수량/잔여 작업 기록' }, { label: 'Verified Complete', value: 'Gate', note: '필수 Evidence 충족 후' }], guard: '이동중/Offline/기사 중복배정 Exact Rule은 HOLD', returnRule: '결과 → Activity Ledger → Customer360 / TODAY' },
  '/as-cases': { id: 'PCS-103', title: 'A/S 접수', summary: 'CS 진단 → 필요 시 VS Handoff → 별도 Case Close.', state: '접수 · 진단 · 방문필요 · 결과 · 종료', cards: [{ label: 'What we know', value: '필수', note: '현재까지 확인된 사실' }, { label: 'What we tried', value: '필수', note: '원격 처리 시도' }, { label: 'What we need', value: '필수', note: '현장 요청사항' }], guard: 'VS 완료 ≠ A/S Case Close / 자동 Close 금지', returnRule: 'Case 결과와 Close는 분리 명령' },
  '/sales': { id: 'PST-401', title: '영업·견적', summary: '신규유입 → 가망 → TM/방문 → 견적 → 계약 Handoff.', state: '수동 전이 · 견적 · 계약전환', cards: [{ label: '신규유입', value: 'PST-101', note: 'Customer360 참조' }, { label: '가망/TM/방문', value: 'Manual', note: '자동 상태전이 금지' }, { label: '견적', value: 'PST-401/402', note: '내부 승인 Flow 제외' }], guard: 'Customer Master 중복 생성 및 자동 상태전이 금지', returnRule: '업무 완료/취소 → Customer360 Context 복귀' },
  '/operations': { id: 'PCS-104', title: '수발주·미수금·재고', summary: 'Operations Logical/Mock 묶음. Physical Entity/Schema는 HOLD.', state: 'Logical only', cards: [{ label: '수발주', value: 'PCS-104', note: 'Logen Production Binding HOLD' }, { label: '미수금', value: 'PCS-105', note: 'Restricted Summary + Queue' }, { label: '재고', value: 'PCS-106', note: 'Physical Schema/Migration HOLD' }], guard: 'Physical DB/Provider Binding 금지', returnRule: '각 Source Domain 처리 후 Customer360/TODAY로 복귀' },
  '/vendors': { id: 'PCI-201', title: '거래처 관리', summary: '파트너·제조사·공급사·VAN/PG/POS 등을 하나의 거래처 Master에서 유형으로 구분.', state: '목록 · 상세 · 유형', cards: [{ label: '거래처 유형', value: '다중', note: '중복 Master 금지' }, { label: '상태', value: '활성/비활성', note: 'History 유지' }, { label: '관련 업무', value: '계약/수발주/AS', note: 'Domain Link' }], guard: '거래처 유형별 별도 Master 생성 금지', returnRule: '관련 Domain 처리 후 거래처 Context 복귀' },
  '/team': { id: 'PHR-101', title: '우리 팀', summary: '직원/조직 Canonical Surface. Physical IAM은 별도 HOLD.', state: '조직 · 구성원 · 업무분장', cards: [{ label: '구성원', value: 'Mock', note: 'Logical employee reference' }, { label: '역할', value: '업무분장', note: '권한과 표시 역할 분리' }, { label: 'IAM', value: 'HOLD', note: 'Physical Auth schema 미연결' }], guard: 'PHR-106 신규 생성 금지', returnRule: '조직/업무분장 변경은 Audit 대상' },
  '/settings/permissions': { id: 'PSET-102', title: '권한 설정', summary: 'Menu + Row Scope + Field Visibility + Action Permission.', state: '외부 파트너 · 내부 직원 · 내부 관리자 · 운영자', cards: [{ label: 'Row Scope', value: 'Required', note: '조회 범위' }, { label: 'Field', value: 'Required', note: '민감 필드 표시 제어' }, { label: 'Action', value: 'Required', note: '명령 권한' }], guard: 'Legacy allow-all RLS 재사용 금지 / Default Deny', returnRule: '변경 시 Audit Before/After' },
  '/settings/menu': { id: 'PSET-103', title: '화면·메뉴 설정', summary: 'Canonical ID는 고정하고 표시값만 설정.', state: '표시명 · 순서 · 노출', cards: [{ label: 'Canonical ID', value: 'LOCKED', note: 'Route/Data Owner 변경 금지' }, { label: 'Display Name', value: 'Editable', note: '표시 문구만 변경' }, { label: 'Visibility', value: 'Editable', note: 'Permission과 함께 평가' }], guard: 'PMG/PSET-106를 설정으로 임의 승격 금지', returnRule: '설정 변경 → Audit Log → Shell 재조회' },
}

const API_BY_PATH: Record<string, string | undefined> = {
  '/customers': mockEndpoints.customer360(), '/today': mockEndpoints.today, '/field-service': mockEndpoints.service(), '/as-cases': mockEndpoints.service(), '/sales': mockEndpoints.sales, '/operations': mockEndpoints.operations, '/settings/permissions': mockEndpoints.settings, '/settings/menu': mockEndpoints.settings,
}

const NAV_ACTIONS: Record<string, NavAction[]> = {
  '/home': [{ label: 'TODAY 열기', target: '/today', note: 'Work Projection으로 이동' }],
  '/today': [{ label: 'A/S Source 열기', target: '/as-cases', note: 'Projection → Source Domain' }, { label: '견적 Source 열기', target: '/sales', note: 'Projection → Sales Source' }],
  '/customers': [{ label: 'A/S 접수', target: '/as-cases', note: 'Customer360 Quick Action' }, { label: '영업·견적 열기', target: '/sales', note: '동일 Customer Context' }],
  '/as-cases': [{ label: 'VS Handoff', target: '/field-service', note: 'CS→VS Handoff' }],
  '/field-service': [{ label: 'Customer360 History', target: '/customers', note: 'Activity Ledger 결과 확인' }],
  '/sales': [{ label: 'Customer360 복귀', target: '/customers', note: 'Customer Context 유지' }],
  '/operations': [{ label: 'Customer360 Context', target: '/customers', note: 'Logical Source Return' }],
}

function LiveContract({ endpoint }: { endpoint: string }) {
  const query = useQuery({ queryKey: ['mock-contract', endpoint], queryFn: () => fetchMockResource(endpoint) })
  if (query.isLoading) return <div className="api-box">Mock API 연결 중…</div>
  if (query.isError) return <div className="api-box api-error">Mock API 연결 실패 · 화면은 Static Contract로 유지됩니다.</div>
  return <div className="api-box"><strong>LIVE MOCK API</strong><code>{JSON.stringify(query.data, null, 2)}</code></div>
}

function PreviewResult({ value }: { value?: ActionPreview }) {
  if (!value) return null
  return <div className="preview-result"><strong>ACTION PREVIEW · 저장 안 됨</strong><code>{JSON.stringify(value, null, 2)}</code></div>
}

function WorkflowActions({ path, evidence }: { path: string; evidence: string[] }) {
  const mutation = useMutation({ mutationFn: (item: PreviewAction) => previewMockAction(item.endpoint, { action: item.action, sourceId: item.sourceId, payload: item.payload }) })
  const actions = useMemo<PreviewAction[]>(() => {
    if (path === '/sales') return [
      { label: '가망고객 전환 Preview', endpoint: mockEndpoints.salesAction, action: 'PST-101→PST-102', sourceId: 'PST-101' },
      { label: 'TM 일정 Preview', endpoint: mockEndpoints.salesAction, action: 'PST-102→PST-103', sourceId: 'PST-102', tone: 'secondary' },
      { label: '방문 일정 Preview', endpoint: mockEndpoints.salesAction, action: 'PST-102→PST-201', sourceId: 'PST-102', tone: 'secondary' },
      { label: '견적→계약 Handoff', endpoint: mockEndpoints.salesAction, action: 'QUOTE_TO_CONTRACT', sourceId: 'PST-401', tone: 'secondary' },
    ]
    if (path === '/field-service') return [
      { label: '부분완료 Preview', endpoint: mockEndpoints.serviceAction, action: 'PARTIAL_COMPLETE', sourceId: 'PCS-102' },
      { label: '재방문 Preview', endpoint: mockEndpoints.serviceAction, action: 'REVISIT', sourceId: 'PCS-102', tone: 'secondary' },
      { label: 'Verified Complete', endpoint: mockEndpoints.serviceAction, action: 'VERIFIED_COMPLETE', sourceId: 'PCS-102', payload: { evidence }, tone: 'secondary' },
    ]
    if (path === '/as-cases') return [{ label: 'A/S Case Close Preview', endpoint: mockEndpoints.serviceAction, action: 'CASE_CLOSE', sourceId: 'PCS-103' }]
    if (path === '/operations') return [
      { label: '수발주 처리 Preview', endpoint: mockEndpoints.operationsAction, action: 'SUPPLY_UPDATE', sourceId: 'PCS-104' },
      { label: '미수 Follow-up Preview', endpoint: mockEndpoints.operationsAction, action: 'RECEIVABLE_FOLLOWUP', sourceId: 'PCS-105', tone: 'secondary' },
      { label: '재고 Logical View', endpoint: mockEndpoints.operationsAction, action: 'INVENTORY_LOGICAL_VIEW', sourceId: 'PCS-106', tone: 'secondary' },
    ]
    if (path === '/settings/permissions') return [{ label: '권한 변경 Audit Preview', endpoint: mockEndpoints.settingsAction, action: 'PERMISSION_CHANGE', sourceId: 'PSET-102', payload: { field: 'actionPermission', before: 'DENY', after: 'ALLOW' } }]
    if (path === '/settings/menu') return [
      { label: '표시명 변경 Preview', endpoint: mockEndpoints.settingsAction, action: 'MENU_DISPLAY_CHANGE', sourceId: 'PSET-103', payload: { field: 'displayName', before: '고객 360', after: '고객관리' } },
      { label: 'Canonical ID 변경 시도', endpoint: mockEndpoints.settingsAction, action: 'MENU_ID_CHANGE', sourceId: 'PSET-103', payload: { field: 'canonicalId', before: 'PST-301', after: 'PST-999' }, tone: 'secondary' },
    ]
    return []
  }, [path, evidence])
  if (!actions.length) return null
  return <div className="workflow-zone"><div className="section-label">업무 동작 Mock</div><div className="workflow-actions">{actions.map((item) => <button key={item.label} className={item.tone === 'secondary' ? 'btn-secondary' : 'btn-primary'} onClick={() => mutation.mutate(item)} disabled={mutation.isPending}>{item.label}</button>)}</div>{mutation.isError ? <p className="inline-error">Action Preview 실패 · 실제 상태는 변경되지 않았습니다.</p> : null}<PreviewResult value={mutation.data} /></div>
}

function EvidenceChecklist({ values, onChange }: { values: string[]; onChange: (values: string[]) => void }) {
  const required = ['사진', 'Serial/Asset', 'Test Result', '고객 확인']
  return <div className="evidence-zone"><div className="section-label">Verified Complete Evidence</div><div className="check-row">{required.map((item) => <label key={item}><input type="checkbox" checked={values.includes(item)} onChange={(e) => onChange(e.target.checked ? [...values, item] : values.filter((v) => v !== item))} />{item}</label>)}</div><small>{values.length}/4 충족 · 4개 미만이면 Missing Evidence</small></div>
}

function MockScreen({ spec }: { spec: ScreenSpec }) {
  const location = useLocation(); const navigate = useNavigate(); const [evidence, setEvidence] = useState<string[]>([])
  const endpoint = API_BY_PATH[location.pathname]; const navActions = NAV_ACTIONS[location.pathname] ?? []; const navState = (location.state ?? {}) as NavigationState
  const go = (action: NavAction) => navigate(action.target, { state: { returnTo: location.pathname, originLabel: spec.title } satisfies NavigationState })
  return <section className="panel">
    <div className="screen-head"><div><span className="eyebrow">{spec.id}</span><h1>{spec.title}</h1><p>{spec.summary}</p></div><span className="state-pill">{spec.state}</span></div>
    <div className="card-grid">{spec.cards.map((card) => <article className="metric-card" key={card.label}><small>{card.label}</small><strong>{card.value}</strong><p>{card.note}</p></article>)}</div>
    {navActions.length ? <div className="action-zone">{navActions.map((action, index) => <button key={action.label} className={index === 0 ? 'btn-primary' : 'btn-secondary'} onClick={() => go(action)}><strong>{action.label}</strong><span>{action.note}</span></button>)}</div> : null}
    {location.pathname === '/field-service' ? <EvidenceChecklist values={evidence} onChange={setEvidence} /> : null}
    <WorkflowActions path={location.pathname} evidence={evidence} />
    {navState.returnTo ? <div className="return-strip"><span>{navState.originLabel ?? '이전 Context'}에서 진입</span><button className="btn-tertiary" onClick={() => navigate(navState.returnTo!)}>이전 Context로 돌아가기</button></div> : null}
    <div className="rule-grid"><article><small>Guard</small><strong>{spec.guard}</strong></article><article><small>Return</small><strong>{spec.returnRule}</strong></article></div>
    {endpoint ? <LiveContract endpoint={endpoint} /> : null}
    <p className="hold-note">Logical/Mock only · Physical DB / Provider / Production Binding = HOLD</p>
  </section>
}

const dateFormatter = new Intl.DateTimeFormat('ko-KR', { timeZone: 'Asia/Seoul', year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' })
const timeFormatter = new Intl.DateTimeFormat('ko-KR', { timeZone: 'Asia/Seoul', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })

function useNow() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])
  return now
}

function PrimarySidebar({ activeCategoryId, onSelect }: { activeCategoryId: string; onSelect: (id: string) => void }) {
  return <aside className="sidebar-primary">
    <strong className="brand-mark">PP</strong>
    <nav>
      {CATEGORY_MENU.map((category) => (
        <button
          key={category.id}
          type="button"
          className={category.id === activeCategoryId ? 'active' : undefined}
          onClick={() => onSelect(category.id)}
          aria-current={category.id === activeCategoryId}
        >
          <span>{category.label}</span>
          {category.hold ? <small className="hold-tag">HOLD</small> : null}
        </button>
      ))}
    </nav>
  </aside>
}

function SecondarySidebar({ category }: { category: MenuCategory }) {
  return <aside className="sidebar-secondary">
    <div className="sidebar-secondary-head">{category.label}</div>
    <nav>
      {category.items.map((item) => item.path
        ? <NavLink key={item.id} to={item.path} className={({ isActive }) => isActive ? 'active' : undefined}><small>{item.id}</small><span>{item.label}</span></NavLink>
        : <div key={item.id} className="nav-disabled" aria-disabled="true"><small>{item.id}</small><span>{item.label}</span><em>{item.hold ? 'HOLD' : '준비중'}</em></div>)}
    </nav>
  </aside>
}

function HeaderShall({ category, screenTitle }: { category?: MenuCategory; screenTitle?: string }) {
  const now = useNow()
  return <header className="shell-header">
    <div className="header-context">
      <span className="crumb-cat">{category?.label ?? 'PayPlay OC'}</span>
      {screenTitle ? <><span className="crumb-sep">/</span><span className="crumb-page">{screenTitle}</span></> : null}
    </div>
    <div className="header-search">
      <input type="search" placeholder="검색" aria-label="검색" />
    </div>
    <div className="header-clock">
      <span>{dateFormatter.format(now)}</span>
      <strong>{timeFormatter.format(now)}</strong>
    </div>
    <div className="header-user">
      <span className="user-role">운영자</span>
      <span className="user-name">Mock User</span>
    </div>
  </header>
}

export function App() {
  const location = useLocation()
  const routeCategory = categoryForPath(location.pathname)
  const [manualCategoryId, setManualCategoryId] = useState<string | null>(null)
  useEffect(() => setManualCategoryId(null), [location.pathname])
  const activeCategory = CATEGORY_MENU.find((category) => category.id === manualCategoryId) ?? routeCategory ?? CATEGORY_MENU[0]
  const screenTitle = SCREENS[location.pathname]?.title

  return <div className="shell">
    <PrimarySidebar activeCategoryId={activeCategory.id} onSelect={setManualCategoryId} />
    <SecondarySidebar category={activeCategory} />
    <HeaderShall category={activeCategory} screenTitle={screenTitle} />
    <main className="content">
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        {MENU.map(([, , path]) => <Route key={path} path={path} element={<MockScreen spec={SCREENS[path]} />} />)}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </main>
  </div>
}
