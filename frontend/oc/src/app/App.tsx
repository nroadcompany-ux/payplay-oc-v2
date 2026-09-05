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

function Placeholder({ id, title }: { id: string; title: string }) {
  return (
    <section className="panel">
      <span className="eyebrow">{id}</span>
      <h1>{title}</h1>
      <p>Logical/Mock 구현 단계입니다. Physical DB, Provider, Production Binding은 연결하지 않습니다.</p>
    </section>
  )
}

export function App() {
  return (
    <div className="shell">
      <aside className="sidebar">
        <strong>PayPlay OC v2</strong>
        <nav>
          {MENU.map(([id, label, path]) => (
            <NavLink key={id} to={path} className={({ isActive }) => (isActive ? 'active' : undefined)}>
              <small>{id}</small>
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="content">
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          {MENU.map(([id, label, path]) => (
            <Route key={id} path={path} element={<Placeholder id={id} title={label} />} />
          ))}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </main>
    </div>
  )
}
