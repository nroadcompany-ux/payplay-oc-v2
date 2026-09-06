import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { usePrototypeStore, type PoStatus, type ShipmentStatus } from '../../store/prototypeStore'
import { formatCurrency, type NavigationState } from '../shared'

const PO_STEPS: PoStatus[] = ['발주요청', '발주확정', '입고대기', '부분입고', '입고완료']
const SHIPMENT_STEPS: ShipmentStatus[] = ['준비', '집화', '이동중', '배송완료']

export function OperationsScreen() {
  const location = useLocation()
  const navigate = useNavigate()
  const navState = (location.state ?? {}) as NavigationState
  const purchaseOrders = usePrototypeStore((s) => s.purchaseOrders)
  const advancePo = usePrototypeStore((s) => s.advancePo)
  const shipments = usePrototypeStore((s) => s.shipments)
  const advanceShipment = usePrototypeStore((s) => s.advanceShipment)
  const inventory = usePrototypeStore((s) => s.inventory)
  const receivables = usePrototypeStore((s) => s.receivables)
  const recordPayment = usePrototypeStore((s) => s.recordReceivablePayment)
  const markComplete = usePrototypeStore((s) => s.markReceivableComplete)
  const setFollowUp = usePrototypeStore((s) => s.setReceivableFollowUp)

  const [paymentDraft, setPaymentDraft] = useState<Record<string, string>>({})
  const [receivableError, setReceivableError] = useState<Record<string, string | undefined>>({})

  return <section className="panel">
    <div className="screen-head"><div><span className="eyebrow">PCS-104 / 105 / 106</span><h1>수발주·미수금·재고</h1><p>각 Domain이 자신의 Source Transaction을 소유. Customer360/TODAY는 요약·Projection만.</p></div></div>

    <div className="section-label">발주 (PCS-104)</div>
    <ul className="plain-list">
      {purchaseOrders.map((po) => <li key={po.id} className="plain-row">
        <strong>{po.id} · {po.vendorRef}</strong>
        <span>{po.status} · {po.items.map((i) => `${i.sku}×${i.qty}`).join(', ')}</span>
        <div className="action-zone" style={{ marginTop: 4 }}>
          {PO_STEPS.map((step) => <button key={step} type="button" className="btn-secondary" disabled={po.status === step} onClick={() => advancePo(po.id, step)}>{step}</button>)}
          <button type="button" className="btn-secondary" onClick={() => advancePo(po.id, '취소')}>취소</button>
        </div>
      </li>)}
    </ul>

    <div className="section-label" style={{ marginTop: 20 }}>배송 (PCS-104)</div>
    <ul className="plain-list">
      {shipments.map((sh) => <li key={sh.id} className="plain-row">
        <strong>{sh.id} · {sh.customerRef} ({sh.carrier})</strong>
        <span>{sh.status}</span>
        <div className="action-zone" style={{ marginTop: 4 }}>
          {SHIPMENT_STEPS.map((step) => <button key={step} type="button" className="btn-secondary" disabled={sh.status === step} onClick={() => advanceShipment(sh.id, step)}>{step}</button>)}
          <button type="button" className="btn-secondary" onClick={() => advanceShipment(sh.id, '실패')}>실패 Preview</button>
        </div>
      </li>)}
    </ul>

    <div className="section-label" style={{ marginTop: 20 }}>재고 (PCS-106 · Logical only)</div>
    <table className="plain-table">
      <thead><tr><th>SKU</th><th>품명</th><th>보유</th><th>예약</th><th>상태</th></tr></thead>
      <tbody>{inventory.map((i) => <tr key={i.sku}><td>{i.sku}</td><td>{i.name}</td><td>{i.onHand}</td><td>{i.reserved}</td><td>{i.shortage ? <span className="inline-error">부족</span> : '정상'}</td></tr>)}</tbody>
    </table>

    <div className="section-label" style={{ marginTop: 20 }}>미수금 (PCS-105)</div>
    <ul className="plain-list">
      {receivables.map((r) => <li key={r.id} className="plain-row">
        <strong>{r.customerRef}</strong>
        <span>{r.status} · 예정 {formatCurrency(r.expectedAmount)} / 입금 {formatCurrency(r.receivedAmount)} · 만기 {r.dueDate}</span>
        <div className="inline-form-row" style={{ marginTop: 4 }}>
          <input type="number" placeholder="입금액" value={paymentDraft[r.id] ?? ''} onChange={(e) => setPaymentDraft((p) => ({ ...p, [r.id]: e.target.value }))} />
          <button type="button" className="btn-secondary" onClick={() => {
            const amount = Number(paymentDraft[r.id] ?? 0)
            const res = recordPayment(r.id, amount)
            setReceivableError((p) => ({ ...p, [r.id]: res.ok ? undefined : res.reason }))
            if (res.ok) setPaymentDraft((p) => ({ ...p, [r.id]: '' }))
          }}>수납 기록</button>
          <button type="button" className="btn-secondary" onClick={() => setFollowUp(r.id, '내일', '후속 연락 필요')}>후속일 지정</button>
          <button type="button" className="btn-primary" onClick={() => { const res = markComplete(r.id); setReceivableError((p) => ({ ...p, [r.id]: res.ok ? undefined : res.reason })) }}>완료 확인</button>
        </div>
        {receivableError[r.id] ? <p className="inline-error">{receivableError[r.id]}</p> : null}
        {r.followUpAt ? <span className="detail-subline">후속일: {r.followUpAt} · {r.followUpNote}</span> : null}
      </li>)}
    </ul>

    {navState.returnTo ? <div className="return-strip"><span>{navState.originLabel ?? '이전 Context'}에서 진입</span><button className="btn-tertiary" onClick={() => navigate(navState.returnTo!)}>이전 Context로 돌아가기</button></div> : null}
    <div className="rule-grid"><article><small>Guard</small><strong>Physical DB/Provider Binding 금지, 일부입금은 자동 완료되지 않음</strong></article><article><small>Return</small><strong>각 Source Domain 처리 후 Customer360/TODAY로 복귀</strong></article></div>
    <p className="hold-note">Logical/Mock only · Logen Production Binding / 재고 Physical Migration = HOLD</p>
  </section>
}
