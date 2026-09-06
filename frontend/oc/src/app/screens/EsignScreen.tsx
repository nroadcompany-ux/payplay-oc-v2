import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { usePrototypeStore } from '../../store/prototypeStore'
import { EmptyState, type NavigationState } from '../shared'

const DEFAULT_CATALOG = [
  { id: 'DOC-MAIN', label: '계약서 본문', required: true },
  { id: 'DOC-TERMS', label: '이용약관 동의서', required: true },
  { id: 'DOC-AUTOPAY', label: '자동이체 신청서', required: false },
  { id: 'DOC-INSTALL', label: '설치 확인서', required: false },
]

export function EsignScreen() {
  const location = useLocation()
  const navigate = useNavigate()
  const navState = (location.state ?? {}) as NavigationState & { focusContractId?: string }
  const contracts = usePrototypeStore((s) => s.contracts)
  const startEsignPlan = usePrototypeStore((s) => s.startEsignPlan)
  const toggleEsignDocument = usePrototypeStore((s) => s.toggleEsignDocument)
  const sendForSignature = usePrototypeStore((s) => s.sendForSignature)
  const completeEsignDocument = usePrototypeStore((s) => s.completeEsignDocument)

  const contract = contracts.find((c) => c.id === (navState.focusContractId ?? contracts[0]?.id))
  const [optionalSelection, setOptionalSelection] = useState<string[]>([])
  const [sendError, setSendError] = useState<string | undefined>()

  if (!contract) {
    return <section className="panel">
      <div className="screen-head"><div><span className="eyebrow">e-Sign</span><h1>전자서명 문서 선택</h1><p>계약별 발송 문서 선택 → 발송 준비 → Submission Status.</p></div></div>
      <EmptyState message="선택된 계약이 없습니다." action={{ label: '계약 관리로 이동', onClick: () => navigate('/contracts') }} />
    </section>
  }

  const planStarted = contract.esign.documents.length > 0
  const documents = planStarted ? contract.esign.documents : DEFAULT_CATALOG.map((d) => ({ ...d, selected: d.required || optionalSelection.includes(d.id), status: '대기' as const }))

  return <section className="panel">
    <div className="screen-head"><div><span className="eyebrow">e-Sign</span><h1>전자서명 문서 선택</h1><p>{contract.customerRef} · {contract.storeRef} 계약의 발송 문서를 선택합니다.</p></div></div>

    <div className="section-label">문서 선택 (필수 문서는 항상 포함)</div>
    <ul className="plain-list">
      {documents.map((d) => <li key={d.id} className="plain-row">
        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input type="checkbox" checked={d.selected} disabled={d.required || planStarted} onChange={() => {
            if (planStarted) toggleEsignDocument(contract.id, d.id)
            else setOptionalSelection((prev) => prev.includes(d.id) ? prev.filter((x) => x !== d.id) : [...prev, d.id])
          }} />
          <strong>{d.label}</strong>{d.required ? <span> · 필수</span> : <span> · 선택</span>}
        </label>
        {planStarted ? <span>{(d as { status: string }).status}</span> : null}
      </li>)}
    </ul>

    {!planStarted ? <button type="button" className="btn-primary" onClick={() => startEsignPlan(contract.id, [...DEFAULT_CATALOG.filter((d) => d.required).map((d) => d.id), ...optionalSelection])}>
      <strong>발송 준비</strong><span>Document Plan Snapshot 생성</span>
    </button> : (
      <div>
        <div className="action-zone">
          <button type="button" className="btn-primary" onClick={() => { const r = sendForSignature(contract.id); setSendError(r.ok ? undefined : r.reason) }} disabled={contract.esign.submissionStatus !== '준비'}>
            <strong>{contract.esign.submissionStatus === '준비' ? '전자서명 발송' : '발송 상태: ' + contract.esign.submissionStatus}</strong>
            <span>필수 문서 누락 시 발송 차단</span>
          </button>
        </div>
        {sendError ? <p className="inline-error">{sendError}</p> : null}

        {contract.esign.submissionStatus === '발송중' || contract.esign.submissionStatus === '일부완료' || contract.esign.submissionStatus === '실패' ? (
          <div className="action-zone">
            {contract.esign.documents.filter((d) => d.selected && d.status !== '완료').map((d) => <div key={d.id} className="plain-row" style={{ minWidth: 220 }}>
              <strong>{d.label}</strong>
              <div className="action-zone" style={{ marginTop: 4 }}>
                <button type="button" className="btn-secondary" onClick={() => completeEsignDocument(contract.id, d.id, '완료')}>완료 처리</button>
                <button type="button" className="btn-secondary" onClick={() => completeEsignDocument(contract.id, d.id, '실패')}>실패 처리</button>
              </div>
            </div>)}
          </div>
        ) : null}
      </div>
    )}

    <p className="hold-note">Submission Status: {contract.esign.submissionStatus} · e-sign 완료가 계약 전체 완료를 의미하지 않습니다.</p>

    <div className="section-label">Activity</div>
    <ul className="plain-list">{contract.esign.history.map((h, i) => <li key={i} className="plain-row"><strong>{h.at}</strong><span>{h.event}</span></li>)}</ul>

    <div className="return-strip"><span>{navState.originLabel ?? '계약 관리'}에서 진입</span><button className="btn-tertiary" onClick={() => navigate(navState.returnTo ?? '/contracts')}>이전 Context로 돌아가기</button></div>
    <div className="rule-grid"><article><small>Guard</small><strong>Provider Credential/Production Binding 금지</strong></article><article><small>Return</small><strong>실패/재시도 History 삭제 금지</strong></article></div>
    <p className="hold-note">Logical/Mock only · Real e-sign Provider Binding = HOLD</p>
  </section>
}
