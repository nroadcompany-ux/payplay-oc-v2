import { useQuery } from '@tanstack/react-query'
import { Navigate, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router'
import { fetchMockResource, mockEndpoints } from '../api/mockApi'

const MENU = [
  ['PCI-101', '업무 홈', '/home'],
  ['PCI-201', '거래처 관리', '/vendors'],
  ['PST-301', '고객 360', '/customers'],
  ['PCS-101', 'TODAY', '/today'],
  ['PCS-102', '신규설치 및 A/S 방문', '/field-service'],
  ['PCS-103', 'A/S 접수', '/as-cases'],
  ['PST-401', '영업·견적', '/sales'],
  ['PCS-104', '수발주·미수금·재고', '/operations'],
  ['PHR-101', '우리 팀', '/team'],
  ['PSET-102', '권한 설정', '/settings/permissions'],
  ['PSET-103', '화면·메뉴 설정', '/settings/menu'],
] as const

type ScreenSpec = {
  id: string
  title: string
  summary: string
  state: string
  cards: Array<{ label: string; value: string; note: string }>
  guard: string
  returnRule: string
}

type NavigationState = { returnTo?: string; originLabel?: string }

type MockAction = { label: string; target: string; note: string }

const SCREENS: Record<string, ScreenSpec> = {
  '/home': { id: 'PCI-101', title: '업무 홈', summary: '원본 Transaction을 직접 수정하지 않는 Work Projection.', state: '정상 · 지연 · 보류', cards: [{ label: '오늘 처리', value: '12', note: 'Source Domain으로 Drill-down' }, { label: '보류', value: '3', note: '원인과 원본 업무 링크 유지' }, { label: '방문 예정', value: '5', note: 'VS/TM/방문영업 일정 Projection' }], guard: 'Projection에서 원본 업무 직접 수정 금지', returnRule: 'Source 처리 후 기존 Home/TODAY Context로 복귀' },
  '/today': { id: 'PCS-101', title: 'TODAY', summary: '업무별 Source를 모아 보여주는 실행 Queue.', state: '예정 · 진행 · 보류 · 완료', cards: [{ label: '예정', value: '6', note: 'Source 상세 진입' }, { label: '진행', value: '4', note: 'Source State 기준' }, { label: '완료', value: '2', note: 'VS는 Verified Complete만 반영' }], guard: 'TODAY = Work Projection, Source Truth 아님', returnRule: 'Source 완료/취소 후 Queue Context 유지' },
  '/customers': { id: 'PST-301', title: '고객 360', summary: 'Canonical Customer Context. 업무별 View는 중복 Customer Master가 아니다.', state: '기본정보 · 진행업무 · 최근이력', cards: [{ label: '현재 진행', value: '견적 1 · A/S 1', note: '각 Domain Owner로 이동' }, { label: '최근 이력', value: '8건', note: 'Activity Ledger 기반' }, { label: 'Quick Action', value: 'A/S 접수', note: 'Domain Action 후 Customer360 Return' }], guard: '신규유입/가망/TM/방문영업 별도 고객 Master 생성 금지', returnRule: 'Domain 완료/취소 → 동일 Customer Context 복귀' },
  '/field-service': { id: 'PCS-102', title: '신규설치 및 A/S 방문', summary: '현장 Action과 Evidence를 분리하고 Verified Complete Gate를 적용.', state: '작업중 · 부분완료 · 재방문 · 완료', cards: [{ label: '필수 Evidence', value: '사진 · Serial · Test', note: '누락 시 완료 불가' }, { label: '부분완료', value: '허용', note: '완료 수량/잔여 작업 기록' }, { label: 'Verified Complete', value: 'Gate', note: '고객 확인 + Evidence 충족 후' }], guard: '이동중/Offline/기사 중복배정 Exact Rule은 HOLD', returnRule: '결과 → Activity Ledger → Customer360 / TODAY' },
  '/as-cases': { id: 'PCS-103', title: 'A/S 접수', summary: 'CS 진단 → 필요 시 VS Handoff → 별도 Case Close.', state: '접수 · 진단 · 방문필요 · 결과 · 종료', cards: [{ label: 'What we know', value: '필수', note: '현재까지 확인된 사실' }, { label: 'What we tried', value: '필수', note: '원격 처리 시도' }, { label: 'What we need', value: '필수', note: '현장 요청사항' }], guard: 'VS 완료 ≠ A/S Case Close / 자동 Close 금지', returnRule: 'Case 결과와 Close는 분리 명령' },
  '/sales': { id: 'PST-401', title: '영업·견적', summary: '신규유입 → 가망 → TM/방문 → 견적 → 계약 Handoff.', state: '수동 전이 · 견적 · 계약전환', cards: [{ label: '신규유입', value: 'PST-101', note: 'Customer360 참조' }, { label: '가망/TM/방문', value: 'Manual', note: '자동 상태전이 금지' }, { label: '견적', value: 'PST-401/402', note: '내부 승인 Flow 제외' }], guard: 'Customer Master 중복 생성 및 자동 상태전이 금지', returnRule: '업무 완료/취소 → Customer360 Context 복귀' },
  '/operations': { id: 'PCS-104', title: '수발주·미수금·재고', summary: 'Operations Logical/Mock 묶음. Physical Entity/Schema는 HOLD.', state: 'Logical only', cards: [{ label: '수발주', value: 'PCS-104', note: 'Logen Production Binding HOLD' }, { label: '미수금', value: 'PCS-105', note: 'Restricted Summary + Queue' }, { label: '재고', value: 'PCS-106', note: 'Physical Schema/Migration HOLD' }], guard: 'Physical DB/Provider Binding 금지', returnRule: '각 Source Domain 처리 후 Customer360/TODAY로 복귀' },
  '/vendors': { id: 'PCI-201', title: '거래처 관리', summary: '파트너·제조사·공급사·VAN/PG/POS 등을 하나의 거래처 Master에서 유형으로 구분.', state: '목록 · 상세 · 유형', cards: [{ label: '거래처 유형', value: '다중', note: '중복 Master 금지' }, { label: '상태', value: '활성/비활성', note: 'History 유지' }, { label: '관련 업무', value: '계약/수발주/AS', note: 'Domain Link' }], guard: '거래처 유형별 별도 Master 생성 금지', returnRule: '관련 Domain 처리 후 거래처 Context 복귀' },
  '/team': { id: 'PHR-101', title: '우리 팀', summary: '직원/조직 Canonical Surface. Physical IAM은 별도 HOLD.', state: '조직 · 구성원 · 업무분장', cards: [{ label: '구성원', value: 'Mock', note: 'Logical employee reference' }, { label: '역할', value: '업무분장', note: '권한과 표시 역할 분리' }, { label: 'IAM', value: 'HOLD', note: 'Physical Auth schema 미연결' }], guard: 'PHR-106 신규 생성 금지', returnRule: '조직/업무분장 변경은 Audit 대상' },
  '/settings/permissions': { id: 'PSET-102', title: '권한 설정', summary: 'Menu + Row Scope + Field Visibility + Action Permission.', state: '외부 파트너 · 내부 직원 · 내부 관리자 · 운영자', cards: [{ label: 'Row Scope', value: 'Required', note: '조회 범위' }, { label: 'Field', value: 'Required', note: '민감 필드 표시 제어' }, { label: 'Action', value: 'Required', note: '명령 권한' }], guard: 'Legacy allow-all RLS 재사용 금지 / Default Deny', returnRule: '변경 시 Audit Before/After' },
  '/settings/menu': { id: 'PSET-103', title: '화면·메뉴 설정', summary: 'Canonical ID는 고정하고 표시값만 설정.', state: '표시명 · 순서 · 노출', cards: [{ label: 'Canonical ID', value: 'LOCKED', note: 'Route/Data Owner 변경 금지' }, { label: 'Display Name', value: 'Editable', note: '표시 문구만 변경' }, { label: 'Visibility', value: 'Editable', note: 'Permission과 함께 평가' }], guard: 'PMG/PSET-106를 설정으로 임의 승격 금지', returnRule: '설정 변경 → Audit Log → Shell 재조회' },
}

const API_BY_PATH: Record<string, string | undefined> = {
  '/customers': mockEndpoints.customer360(),
  '/today': mockEndpoints.today,
  '/field-service': mockEndpoints.service(),
  '/as-cases': mockEndpoints.service(),
  '/sales': mockEndpoints.sales,
  '/operations': mockEndpoints.operations,
  '/settings/permissions': mockEndpoints.settings,
  '/settings/menu': mockEndpoints.settings,
}

const ACTIONS_BY_PATH: Record<string, MockAction[]> = {
  '/home': [{ label: 'TODAY 열기', target: '/today', note: 'Work Projection으로 이동' }],
  '/today': [{ label: 'A/S Source 열기', target: '/as-cases', note: 'Projection에서 Source Domain으로 이동' }, { label: '견적 Source 열기', target: '/sales', note: 'Projection에서 Sales Source로 이동' }],
  '/customers': [{ label: 'A/S 접수', target: '/as-cases', note: 'Customer360 Quick Action → Domain' }, { label: '영업·견적 열기', target: '/sales', note: '동일 Customer Context에서 Domain 진입' }],
  '/as-cases': [{ label: 'VS Handoff', target: '/field-service', note: 'What we know / tried / need 이후 현장업무 진입' }],
  '/field-service': [{ label: 'Customer360 History 확인', target: '/customers', note: 'Evidence 결과는 Activity Ledger 경유' }],
  '/sales': [{ label: 'Customer360으로 복귀', target: '/customers', note: 'Customer Master Context 유지' }],
  '/operations': [{ label: 'Customer360 Context 확인', target: '/customers', note: 'Logical Source 처리 후 Context Return' }],
}

function LiveContract({ endpoint }: { endpoint: string }) {
  const query = useQuery({ queryKey: ['mock-contract', endpoint], queryFn: () => fetchMockResource(endpoint) })
  if (query.isLoading) return <div className="api-box">Mock API 연결 중…</div>
  if (query.isError) return <div className="api-box api-error">Mock API 연결 실패 · 화면은 Static Contract로 유지됩니다.</div>
  return <div className="api-box"><strong>LIVE MOCK API</strong><code>{JSON.stringify(query.data, null, 2)}</code></div>
}

function MockScreen({ spec }: { spec: ScreenSpec }) {
  const location = useLocation()
  const navigate = useNavigate()
  const endpoint = API_BY_PATH[location.pathname]
  const actions = ACTIONS_BY_PATH[location.pathname] ?? []
  const navState = (location.state ?? {}) as NavigationState

  const go = (action: MockAction) => navigate(action.target, { state: { returnTo: location.pathname, originLabel: spec.title } satisfies NavigationState })

  return <section className="panel">
    <div className="screen-head"><div><span className="eyebrow">{spec.id}</span><h1>{spec.title}</h1><p>{spec.summary}</p></div><span className="state-pill">{spec.state}</span></div>
    <div className="card-grid">{spec.cards.map((card) => <article className="metric-card" key={card.label}><small>{card.label}</small><strong>{card.value}</strong><p>{card.note}</p></article>)}</div>
    {actions.length ? <div className="action-zone">{actions.map((action, index) => <button key={action.label} className={index === 0 ? 'btn-primary' : 'btn-secondary'} onClick={() => go(action)}><strong>{action.label}</strong><span>{action.note}</span></button>)}</div> : null}
    {navState.returnTo ? <div className="return-strip"><span>{navState.originLabel ?? '이전 Context'}에서 진입</span><button className="btn-tertiary" onClick={() => navigate(navState.returnTo!)}>이전 Context로 돌아가기</button></div> : null}
    <div className="rule-grid"><article><small>Guard</small><strong>{spec.guard}</strong></article><article><small>Return</small><strong>{spec.returnRule}</strong></article></div>
    {endpoint ? <LiveContract endpoint={endpoint} /> : null}
    <p className="hold-note">Logical/Mock only · Physical DB / Provider / Production Binding = HOLD</p>
  </section>
}

export function App() {
  return <div className="shell"><aside className="sidebar"><strong>PayPlay OC v2</strong><span className="build-tag">EXECUTION / MOCK API</span><nav>{MENU.map(([id, label, path]) => <NavLink key={id} to={path} className={({ isActive }) => isActive ? 'active' : undefined}><small>{id}</small><span>{label}</span></NavLink>)}</nav></aside><main className="content"><Routes><Route path="/" element={<Navigate to="/home" replace />} />{MENU.map(([, , path]) => <Route key={path} path={path} element={<MockScreen spec={SCREENS[path]} />} />)}<Route path="*" element={<Navigate to="/home" replace />} /></Routes></main></div>
}
