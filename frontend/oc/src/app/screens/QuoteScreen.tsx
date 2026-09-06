import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { usePrototypeStore } from '../../store/prototypeStore'
import { EmptyState, formatCurrency, type NavigationState } from '../shared'

export function QuoteScreen() {
  const location = useLocation()
  const navigate = useNavigate()
  const navState = (location.state ?? {}) as NavigationState
  const quotes = usePrototypeStore((s) => s.quotes)
  const sendQuote = usePrototypeStore((s) => s.sendQuote)
  const convertQuoteToContract = usePrototypeStore((s) => s.convertQuoteToContract)

  const [selectedId, setSelectedId] = useState<string | undefined>((navState as { focusQuoteId?: string }).focusQuoteId ?? quotes[0]?.id)
  const [convertError, setConvertError] = useState<string | undefined>()
  const selected = quotes.find((q) => q.id === selectedId)
  const total = selected ? selected.lineItems.reduce((sum, li) => sum + li.qty * li.unitPrice, 0) : 0

  return <section className="panel">
    <div className="screen-head"><div><span className="eyebrow">PST-401 / PST-402</span><h1>견적서 관리</h1><p>작성 · 수정 · PDF · 전송 · 상태 · 계약 전환. 내부 승인 Flow는 현재 범위에서 제외.</p></div></div>

    {quotes.length === 0 ? <EmptyState message="작성된 견적이 없습니다. 영업 Queue의 방문영업 단계에서 견적을 생성하세요." action={{ label: '영업 Queue로 이동', onClick: () => navigate('/sales') }} /> : <div className="plain-columns plain-columns-list-detail">
      <div>
        <div className="section-label">견적 목록</div>
        <ul className="plain-list">
          {quotes.map((q) => <li key={q.id}>
            <button type="button" className={q.id === selectedId ? 'plain-row active' : 'plain-row'} onClick={() => { setSelectedId(q.id); setConvertError(undefined) }}>
              <strong>{q.customerRef} · {q.storeRef}</strong>
              <span>{q.status}</span>
            </button>
          </li>)}
        </ul>
      </div>

      {selected ? <div className="detail-panel">
        <div className="section-label">{selected.id} · {selected.status}</div>
        <strong className="detail-title">{selected.customerRef} · {selected.storeRef}</strong>
        <span className="detail-subline">담당 {selected.salesperson} · 유효기간 {selected.validityPeriod || '미지정'}</span>

        <table className="plain-table">
          <thead><tr><th>품목</th><th>수량</th><th>단가</th><th>할인 사유</th><th>소계</th></tr></thead>
          <tbody>
            {selected.lineItems.map((li) => <tr key={li.id}>
              <td>{li.name}</td><td>{li.qty}</td><td>{formatCurrency(li.unitPrice)}</td>
              <td>{li.unitPrice < li.listPrice ? (li.discountReason || <span className="inline-error">할인 사유 누락</span>) : '-'}</td>
              <td>{formatCurrency(li.qty * li.unitPrice)}</td>
            </tr>)}
          </tbody>
        </table>
        <p className="detail-subline" style={{ textAlign: 'right' }}>합계 {formatCurrency(total)}</p>

        <div className="action-zone">
          <button type="button" className="btn-secondary" onClick={() => sendQuote(selected.id, true)}><strong>전송 실패 Preview</strong><span>실패해도 견적은 삭제되지 않음</span></button>
          <button type="button" className="btn-primary" onClick={() => sendQuote(selected.id, false)}><strong>PDF 전송</strong><span>고객에게 견적 발송</span></button>
        </div>
        {selected.sendFailure ? <p className="inline-error">{selected.sendFailure}</p> : null}
        {selected.sentAt ? <p className="hold-note">발송 시각: {selected.sentAt}</p> : null}

        <button type="button" className="btn-primary" style={{ marginTop: 12 }} disabled={selected.status === '계약전환' || selected.status === '취소'} onClick={() => {
          const id = convertQuoteToContract(selected.id)
          if (!id) { setConvertError('계약 전환에 실패했습니다.'); return }
          navigate('/contracts', { state: { returnTo: '/quotes', originLabel: '견적서 관리', focusContractId: id } satisfies NavigationState & { focusContractId: string } })
        }}>
          <strong>{selected.status === '계약전환' ? '계약전환 완료됨' : '계약 전환'}</strong>
          <span>사용자 명시 Action · 견적 Snapshot 보존</span>
        </button>
        {convertError ? <p className="inline-error">{convertError}</p> : null}

        <div className="section-label" style={{ marginTop: 16 }}>History</div>
        <ul className="plain-list">{selected.history.map((h, i) => <li key={i} className="plain-row"><strong>{h.at}</strong><span>{h.event}</span></li>)}</ul>
      </div> : null}
    </div>}

    {navState.returnTo ? <div className="return-strip"><span>{navState.originLabel ?? '이전 Context'}에서 진입</span><button className="btn-tertiary" onClick={() => navigate(navState.returnTo!)}>이전 Context로 돌아가기</button></div> : null}
    <div className="rule-grid"><article><small>Guard</small><strong>할인·수수료 Formula 미확정 값 임의 구현 금지</strong></article><article><small>Return</small><strong>계약전환 후 Customer360 Context 유지</strong></article></div>
    <p className="hold-note">Logical/Mock only · Provider/e-sign Binding = HOLD</p>
  </section>
}
