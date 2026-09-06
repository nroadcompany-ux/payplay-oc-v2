import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { usePrototypeStore } from '../../store/prototypeStore'
import { EmptyState, LiveContract, type NavigationState } from '../shared'
import { mockEndpoints } from '../../api/mockApi'

export function AsCaseScreen() {
  const location = useLocation()
  const navigate = useNavigate()
  const navState = (location.state ?? {}) as NavigationState
  const asCases = usePrototypeStore((s) => s.asCases)
  const updateField = usePrototypeStore((s) => s.updateAsCaseHandoffField)
  const addNote = usePrototypeStore((s) => s.addProcessingNote)
  const createVsHandoff = usePrototypeStore((s) => s.createVsHandoff)
  const closeAsCase = usePrototypeStore((s) => s.closeAsCase)
  const vsJobs = usePrototypeStore((s) => s.vsJobs)

  const [selectedId, setSelectedId] = useState<string | undefined>(asCases[0]?.id)
  const [noteDraft, setNoteDraft] = useState('')
  const [handoffError, setHandoffError] = useState<string | undefined>()
  const [closeError, setCloseError] = useState<string | undefined>()
  const selected = asCases.find((a) => a.id === selectedId)
  const relatedVs = selected?.vsRef ? vsJobs.find((v) => v.id === selected.vsRef) : undefined

  const openVs = () => navigate('/field-service', { state: { returnTo: '/as-cases', originLabel: 'A/S 접수' } satisfies NavigationState })

  return <section className="panel">
    <div className="screen-head"><div><span className="eyebrow">PCS-103</span><h1>A/S 접수</h1><p>CS 진단 → 필요 시 VS Handoff → 별도 Case Close.</p></div></div>

    {asCases.length === 0 ? <EmptyState message="접수된 A/S Case가 없습니다." /> : <div className="plain-columns plain-columns-list-detail">
      <div>
        <div className="section-label">Case 목록</div>
        <ul className="plain-list">
          {asCases.map((a) => <li key={a.id}>
            <button type="button" className={a.id === selectedId ? 'plain-row active' : 'plain-row'} onClick={() => { setSelectedId(a.id); setHandoffError(undefined); setCloseError(undefined) }}>
              <strong>{a.customerRef} · {a.storeRef}</strong>
              <span>{a.status}</span>
            </button>
          </li>)}
        </ul>
      </div>
      {selected ? <div className="detail-panel">
        <div className="section-label">Case {selected.id} · {selected.status}</div>
        <div className="handoff-grid">
          <label>What we know<textarea value={selected.whatWeKnow} onChange={(e) => updateField(selected.id, 'whatWeKnow', e.target.value)} placeholder="현재까지 확인된 사실" /></label>
          <label>What we tried<textarea value={selected.whatWeTried} onChange={(e) => updateField(selected.id, 'whatWeTried', e.target.value)} placeholder="원격 처리 시도 내역" /></label>
          <label>What we need<textarea value={selected.whatWeNeed} onChange={(e) => updateField(selected.id, 'whatWeNeed', e.target.value)} placeholder="현장 방문 시 필요한 것" /></label>
          <label>원격 불가 사유<textarea value={selected.remoteImpossibleReason} onChange={(e) => updateField(selected.id, 'remoteImpossibleReason', e.target.value)} placeholder="Remote impossible reason" /></label>
        </div>

        <div className="section-label">Processing Note</div>
        <ul className="plain-list">{selected.processingNotes.map((n, i) => <li key={i} className="plain-row"><strong>{n.at}</strong><span>{n.note}</span></li>)}</ul>
        <div className="inline-form-row">
          <input type="text" value={noteDraft} onChange={(e) => setNoteDraft(e.target.value)} placeholder="처리 메모 추가" />
          <button type="button" className="btn-secondary" onClick={() => { if (noteDraft.trim()) { addNote(selected.id, noteDraft.trim()); setNoteDraft('') } }}>추가</button>
        </div>

        {selected.vsRef ? <div className="return-strip"><span>VS Handoff 생성됨 · {relatedVs?.status ?? '진행 중'}</span><button className="btn-tertiary" onClick={openVs}>VS 실행 화면 열기</button></div> : (
          <button type="button" className="btn-primary" style={{ marginTop: 12 }} onClick={() => {
            const r = createVsHandoff(selected.id)
            if (!r.ok) setHandoffError(r.reason)
            else { setHandoffError(undefined); openVs() }
          }}><strong>CS→VS Handoff 생성</strong><span>4개 필드 입력 후 VS 일정 생성</span></button>
        )}
        {handoffError ? <p className="inline-error">{handoffError}</p> : null}

        <div className="return-strip" style={{ marginTop: 16 }}>
          <span>VS 완료와 A/S Case Close는 별도 명령입니다.</span>
          <button type="button" className="btn-tertiary" onClick={() => { const r = closeAsCase(selected.id); if (!r.ok) setCloseError(r.reason); else setCloseError(undefined) }}>{selected.status === '종료' ? 'Case 종료됨' : 'A/S Case Close'}</button>
        </div>
        {closeError ? <p className="inline-error">{closeError}</p> : null}
      </div> : null}
    </div>}

    {navState.returnTo ? <div className="return-strip"><span>{navState.originLabel ?? '이전 Context'}에서 진입</span><button className="btn-tertiary" onClick={() => navigate(navState.returnTo!)}>이전 Context로 돌아가기</button></div> : null}
    <div className="rule-grid"><article><small>Guard</small><strong>VS 완료 ≠ A/S Case Close / 자동 Close 금지</strong></article><article><small>Return</small><strong>Case 결과와 Close는 분리 명령</strong></article></div>
    <LiveContract endpoint={mockEndpoints.service()} />
    <p className="hold-note">Logical/Mock only · Physical DB / Provider / Production Binding = HOLD</p>
  </section>
}
