import { Navigate, NavLink, Route, Routes } from 'react-router'

const MENU = [
  ['PCI-101', '업무 홈', '/home'],
  ['PCI-201', '거래처 관리', '/vendors'],
  ['PST-301', '고객 360', '/customers'],
  ['PCS-101', 'TODAY', '/today'],
  ['PCS-102', '신규설치 및 A/S 방문', '/field-service'],
  ['PCS-103', 'A/S 접수', '/as-cases'],
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

const SCREENS: Record<string, ScreenSpec> = {
  '/home': {
    id: 'PCI-101', title: '업무 홈', summary: '원본 Transaction을 직접 수정하지 않는 Work Projection.', state: '정상 · 지연 · 보류',
    cards: [
      { label: '오늘 처리', value: '12', note: 'Source Domain으로 Drill-down' },
      { label: '보류', value: '3', note: '원인과 원본 업무 링크 유지' },
      { label: '방문 예정', value: '5', note: 'VS/TM/방문영업 일정 Projection' },
    ],
    guard: 'Projection에서 원본 업무 직접 수정 금지', returnRule: 'Source 처리 후 기존 Home/TODAY Context로 복귀',
  },
  '/today': {
    id: 'PCS-101', title: 'TODAY', summary: '업무별 Source를 모아 보여주는 실행 Queue.', state: '예정 · 진행 · 보류 · 완료',
    cards: [
      { label: '예정', value: '6', note: 'Source 상세 진입' },
      { label: '진행', value: '4', note: 'Source State 기준' },
      { label: '완료', value: '2', note: 'VS는 Verified Complete만 반영' },
    ],
    guard: 'TODAY = Work Projection, Source Truth 아님', returnRule: 'Source 완료/취소 후 Queue Context 유지',
  },
  '/customers': {
    id: 'PST-301', title: '고객 360', summary: 'Canonical Customer Context. 업무별 View는 중복 Customer Master가 아니다.', state: '기본정보 · 진행업무 · 최근이력',
    cards: [
      { label: '현재 진행', value: '견적 1 · A/S 1', note: '각 Domain Owner로 이동' },
      { label: '최근 이력', value: '8건', note: 'Activity Ledger 기반' },
      { label: 'Quick Action', value: 'A/S 접수', note: 'Domain Action 후 Customer360 Return' },
    ],
    guard: '신규유입/가망/TM/방문영업 별도 고객 Master 생성 금지', returnRule: 'Domain 완료/취소 → 동일 Customer Context 복귀',
  },
  '/field-service': {
    id: 'PCS-102', title: '신규설치 및 A/S 방문', summary: '현장 Action과 Evidence를 분리하고 Verified Complete Gate를 적용.', state: '작업중 · 부분완료 · 재방문 · 완료',
    cards: [
      { label: '필수 Evidence', value: '사진 · Serial · Test', note: '누락 시 완료 불가' },
      { label: '부분완료', value: '허용', note: '완료 수량/잔여 작업 기록' },
      { label: 'Verified Complete', value: 'Gate', note: '고객 확인 + Evidence 충족 후' },
    ],
    guard: '이동중/Offline/기사 중복배정 Exact Rule은 HOLD', returnRule: '결과 → Activity Ledger → Customer360 / TODAY',
  },
  '/as-cases': {
    id: 'PCS-103', title: 'A/S 접수', summary: 'CS 진단 → 필요 시 VS Handoff → 별도 Case Close.', state: '접수 · 진단 · 방문필요 · 결과 · 종료',
    cards: [
      { label: 'What we know', value: '필수', note: '현재까지 확인된 사실' },
      { label: 'What we tried', value: '필수', note: '원격 처리 시도' },
      { label: 'What we need', value: '필수', note: '현장 요청사항' },
    ],
    guard: 'VS 완료 ≠ A/S Case Close / 자동 Close 금지', returnRule: 'Case 결과와 Close는 분리 명령',
  },
  '/vendors': {
    id: 'PCI-201', title: '거래처 관리', summary: '파트너·제조사·공급사·VAN/PG/POS 등을 하나의 거래처 Master에서 유형으로 구분.', state: '목록 · 상세 · 유형',
    cards: [
      { label: '거래처 유형', value: '다중', note: '중복 Master 금지' },
      { label: '상태', value: '활성/비활성', note: 'History 유지' },
      { label: '관련 업무', value: '계약/수발주/AS', note: 'Domain Link' },
    ],
    guard: '거래처 유형별 별도 Master 생성 금지', returnRule: '관련 Domain 처리 후 거래처 Context 복귀',
  },
  '/team': {
    id: 'PHR-101', title: '우리 팀', summary: '직원/조직 Canonical Surface. Physical IAM은 별도 HOLD.', state: '조직 · 구성원 · 업무분장',
    cards: [
      { label: '구성원', value: 'Mock', note: 'Logical employee reference' },
      { label: '역할', value: '업무분장', note: '권한과 표시 역할 분리' },
      { label: 'IAM', value: 'HOLD', note: 'Physical Auth schema 미연결' },
    ],
    guard: 'PHR-106 신규 생성 금지', returnRule: '조직/업무분장 변경은 Audit 대상',
  },
  '/settings/permissions': {
    id: 'PSET-102', title: '권한 설정', summary: 'Menu + Row Scope + Field Visibility + Action Permission.', state: '외부 파트너 · 내부 직원 · 내부 관리자 · 운영자',
    cards: [
      { label: 'Row Scope', value: 'Required', note: '조회 범위' },
      { label: 'Field', value: 'Required', note: '민감 필드 표시 제어' },
      { label: 'Action', value: 'Required', note: '명령 권한' },
    ],
    guard: 'Legacy allow-all RLS 재사용 금지 / Default Deny', returnRule: '변경 시 Audit Before/After',
  },
  '/settings/menu': {
    id: 'PSET-103', title: '화면·메뉴 설정', summary: 'Canonical ID는 고정하고 표시값만 설정.', state: '표시명 · 순서 · 노출',
    cards: [
      { label: 'Canonical ID', value: 'LOCKED', note: 'Route/Data Owner 변경 금지' },
      { label: 'Display Name', value: 'Editable', note: '표시 문구만 변경' },
      { label: 'Visibility', value: 'Editable', note: 'Permission과 함께 평가' },
    ],
    guard: 'PMG/PSET-106를 설정으로 임의 승격 금지', returnRule: '설정 변경 → Audit Log → Shell 재조회',
  },
}

function MockScreen({ spec }: { spec: ScreenSpec }) {
  return (
    <section className="panel">
      <div className="screen-head">
        <div><span className="eyebrow">{spec.id}</span><h1>{spec.title}</h1><p>{spec.summary}</p></div>
        <span className="state-pill">{spec.state}</span>
      </div>
      <div className="card-grid">
        {spec.cards.map((card) => <article className="metric-card" key={card.label}><small>{card.label}</small><strong>{card.value}</strong><p>{card.note}</p></article>)}
      </div>
      <div className="rule-grid">
        <article><small>Guard</small><strong>{spec.guard}</strong></article>
        <article><small>Return</small><strong>{spec.returnRule}</strong></article>
      </div>
      <p className="hold-note">Logical/Mock only · Physical DB / Provider / Production Binding = HOLD</p>
    </section>
  )
}

export function App() {
  return (
    <div className="shell">
      <aside className="sidebar">
        <strong>PayPlay OC v2</strong><span className="build-tag">EXECUTION / MOCK</span>
        <nav>{MENU.map(([id, label, path]) => <NavLink key={id} to={path} className={({ isActive }) => isActive ? 'active' : undefined}><small>{id}</small><span>{label}</span></NavLink>)}</nav>
      </aside>
      <main className="content">
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          {MENU.map(([, , path]) => <Route key={path} path={path} element={<MockScreen spec={SCREENS[path]} />} />)}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </main>
    </div>
  )
}
