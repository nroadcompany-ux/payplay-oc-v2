import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { usePrototypeStore, type ContractReviewType } from '../../store/prototypeStore'
import { EmptyState, type NavigationState } from '../shared'

const REVIEW_TYPES: ContractReviewType[] = ['해지', '명의변경', '양도양수', '계약변경']

export function ContractScreen() {
  const location = useLocation()
  const navigate = useNavigate()
  const navState = (location.state ?? {}) as NavigationState & { focusContractId?: string }
  const contracts = usePrototypeStore((s) => s.contracts)

  const [selectedId, setSelectedId] = useState<string | undefined>(navState.focusContractId ?? contracts[0]?.id)
  const selected = contracts.find((c) => c.id === selectedId)
  const [reviewType, setReviewType] = useState<ContractReviewType | ''>('')

  return <section className="panel">
    <div className="screen-head"><div><span className="eyebrow">Contract</span><h1>계약 관리</h1><p>계약 심의(변경·해지) 4유형과 만료 관리를 포함한 계약 Core.</p></div></div>

    {contracts.length === 0 ? <EmptyState message="생성된 계약이 없습니다. 견적서 관리에서 계약 전환을 먼저 진행하세요." action={{ label: '견적서 관리로 이동', onClick: () => navigate('/quotes') }} /> : <div className="plain-columns plain-columns-list-detail">
      <div>
        <div className="section-label">계약 목록</div>
        <ul className="plain-list">
          {contracts.map((c) => <li key={c.id}>
            <button type="button" className={c.id === selectedId ? 'plain-row active' : 'plain-row'} onClick={() => setSelectedId(c.id)}>
              <strong>{c.customerRef} · {c.storeRef}</strong>
              <span>{c.status}{c.reviewType ? ` · ${c.reviewType} 심의` : ''}</span>
            </button>
          </li>)}
        </ul>
      </div>

      {selected ? <div className="detail-panel">
        <div className="section-label">{selected.id} · {selected.status}</div>
        <strong className="detail-title">{selected.customerRef} · {selected.storeRef}</strong>
        <span className="detail-subline">견적 참조: {selected.quoteRef ?? '-'} · 생성일 {selected.createdAt}</span>
        <span className="detail-subline">전자서명 상태: {selected.esign.submissionStatus}</span>

        <div className="action-zone">
          <button type="button" className="btn-primary" onClick={() => navigate('/esign', { state: { returnTo: '/contracts', originLabel: '계약 관리', focusContractId: selected.id } satisfies NavigationState & { focusContractId: string } })}>
            <strong>전자서명 문서 선택</strong><span>Contract Context → e-sign</span>
          </button>
        </div>

        <div className="section-label" style={{ marginTop: 16 }}>계약 심의 (PST-302)</div>
        <div className="inline-form-row">
          <select value={reviewType} onChange={(e) => setReviewType(e.target.value as ContractReviewType | '')}>
            <option value="">심의 유형 선택</option>
            {REVIEW_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <button type="button" className="btn-secondary" disabled={!reviewType} onClick={() => { /* prototype preview only, persisted=false */ }}>심의 요청 Preview</button>
        </div>
        <p className="hold-note">해지 / 명의변경 / 양도양수 / 계약변경 4유형 · Action Preview는 persisted=false</p>

        <div className="section-label" style={{ marginTop: 16 }}>Activity</div>
        <ul className="plain-list">{selected.history.map((h, i) => <li key={i} className="plain-row"><strong>{h.at}</strong><span>{h.event}</span></li>)}</ul>
      </div> : null}
    </div>}

    {navState.returnTo ? <div className="return-strip"><span>{navState.originLabel ?? '이전 Context'}에서 진입</span><button className="btn-tertiary" onClick={() => navigate(navState.returnTo!)}>이전 Context로 돌아가기</button></div> : null}
    <div className="rule-grid"><article><small>Guard</small><strong>e-sign 완료가 계약 전체 완료를 자동으로 만들지 않음</strong></article><article><small>Return</small><strong>계약 처리 후 Customer360 Context 유지</strong></article></div>
    <p className="hold-note">Logical/Mock only · Provider/e-sign Production Binding = HOLD</p>
  </section>
}
