import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { usePrototypeStore, type VsStatus } from '../../store/prototypeStore'
import { EmptyState, LiveContract, type NavigationState } from '../shared'
import { mockEndpoints } from '../../api/mockApi'

const EVIDENCE_LABELS: Record<string, string> = { photo: '사진', serial: 'Serial/Asset', testResult: 'Test Result', customerConfirm: '고객 확인' }
const PROGRESS: VsStatus[] = ['배정', '도착', '작업중']

export function VsScreen() {
  const location = useLocation()
  const navigate = useNavigate()
  const navState = (location.state ?? {}) as NavigationState
  const vsJobs = usePrototypeStore((s) => s.vsJobs)
  const advance = usePrototypeStore((s) => s.vsAdvance)
  const toggleEvidence = usePrototypeStore((s) => s.vsToggleEvidence)
  const requestPartial = usePrototypeStore((s) => s.vsRequestPartial)
  const requestRevisit = usePrototypeStore((s) => s.vsRequestRevisit)
  const verifiedComplete = usePrototypeStore((s) => s.vsVerifiedComplete)

  const [selectedId, setSelectedId] = useState<string | undefined>(vsJobs[0]?.id)
  const [completeError, setCompleteError] = useState<string | undefined>()
  const [remainingWork, setRemainingWork] = useState('')
  const [revisitReason, setRevisitReason] = useState('')
  const selected = vsJobs.find((v) => v.id === selectedId)

  if (vsJobs.length === 0) {
    return <section className="panel">
      <div className="screen-head"><div><span className="eyebrow">PCS-102</span><h1>신규설치 및 A/S 방문 (VS)</h1><p>현장 Action과 Evidence를 분리하고 Verified Complete Gate를 적용.</p></div></div>
      <EmptyState message="배정된 VS 작업이 없습니다. A/S 접수에서 CS→VS Handoff를 먼저 생성하세요." action={{ label: 'A/S 접수로 이동', onClick: () => navigate('/as-cases') }} />
      <p className="hold-note">Logical/Mock only · Physical DB / Provider / Production Binding = HOLD</p>
    </section>
  }

  return <section className="panel vs-mobile-aware">
    <div className="screen-head"><div><span className="eyebrow">PCS-102</span><h1>신규설치 및 A/S 방문 (VS)</h1><p>현장 Action과 Evidence를 분리하고 Verified Complete Gate를 적용.</p></div></div>

    <div className="plain-columns plain-columns-list-detail">
      <div>
        <div className="section-label">VS 작업 목록</div>
        <ul className="plain-list">
          {vsJobs.map((v) => <li key={v.id}>
            <button type="button" className={v.id === selectedId ? 'plain-row active' : 'plain-row'} onClick={() => { setSelectedId(v.id); setCompleteError(undefined) }}>
              <strong>{v.customerRef}</strong>
              <span>{v.status}</span>
            </button>
          </li>)}
        </ul>
      </div>

      {selected ? <div className="detail-panel">
        <div className="section-label">{selected.id} · {selected.status}</div>

        <div className="action-zone">
          {PROGRESS.map((step) => <button key={step} type="button" className="btn-secondary" disabled={selected.status === 'Verified Complete'} onClick={() => advance(selected.id, step)}><strong>{step}</strong><span>현장 진행 단계</span></button>)}
        </div>

        <div className="evidence-zone">
          <div className="section-label">Verified Complete Evidence</div>
          <div className="check-row">
            {(Object.keys(EVIDENCE_LABELS) as (keyof typeof selected.evidence)[]).map((key) => (
              <label key={key}><input type="checkbox" checked={selected.evidence[key]} onChange={() => toggleEvidence(selected.id, key)} disabled={selected.status === 'Verified Complete'} />{EVIDENCE_LABELS[key]}</label>
            ))}
          </div>
          <small>{Object.values(selected.evidence).filter(Boolean).length}/4 충족 · 4개 미만이면 Missing Evidence</small>
        </div>

        <div className="handoff-grid" style={{ marginTop: 16 }}>
          <label>부분완료 · 잔여 작업<textarea value={remainingWork} onChange={(e) => setRemainingWork(e.target.value)} placeholder="잔여 작업 내용" /></label>
          <label>재방문 사유<textarea value={revisitReason} onChange={(e) => setRevisitReason(e.target.value)} placeholder="재방문이 필요한 이유" /></label>
        </div>
        <div className="action-zone">
          <button type="button" className="btn-secondary" onClick={() => { if (remainingWork.trim()) requestPartial(selected.id, 1, remainingWork.trim()) }}><strong>부분완료 처리</strong><span>완료 수량/잔여 작업 기록</span></button>
          <button type="button" className="btn-secondary" onClick={() => { if (revisitReason.trim()) requestRevisit(selected.id, revisitReason.trim()) }}><strong>재방문 필요</strong><span>사유 기록 · History 보존</span></button>
        </div>

        <button type="button" className="btn-primary" onClick={() => { const r = verifiedComplete(selected.id); setCompleteError(r.ok ? undefined : r.reason) }} disabled={selected.status === 'Verified Complete'}>
          <strong>{selected.status === 'Verified Complete' ? 'Verified Complete 완료됨' : 'Verified Complete 요청'}</strong>
          <span>필수 Evidence 충족 후 → Activity Ledger → Customer360/TODAY</span>
        </button>
        {completeError ? <p className="inline-error">{completeError}</p> : null}

        {selected.partial ? <p className="hold-note">부분완료: {selected.partial.remainingWork}</p> : null}
        {selected.revisit ? <p className="hold-note">재방문 사유: {selected.revisit.reason}</p> : null}
      </div> : null}
    </div>

    <div className="return-strip"><span>{navState.originLabel ?? 'A/S 접수'}에서 진입</span><button className="btn-tertiary" onClick={() => navigate(navState.returnTo ?? '/as-cases')}>이전 Context로 돌아가기</button></div>
    <div className="rule-grid"><article><small>Guard</small><strong>이동중/Offline/기사 중복배정 Exact Rule은 HOLD</strong></article><article><small>Return</small><strong>결과 → Activity Ledger → Customer360 / TODAY</strong></article></div>
    <LiveContract endpoint={mockEndpoints.service()} />
    <p className="hold-note">Logical/Mock only · Physical DB / Provider / Production Binding = HOLD</p>
  </section>
}
