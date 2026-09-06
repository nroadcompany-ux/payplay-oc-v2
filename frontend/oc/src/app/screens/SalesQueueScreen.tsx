import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { usePrototypeStore, type LeadStage } from '../../store/prototypeStore'
import { EmptyState, LiveContract, type NavigationState } from '../shared'
import { mockEndpoints } from '../../api/mockApi'

const STAGES: LeadStage[] = ['신규유입', '가망고객', 'TM 일정', '방문영업']
const NEXT_STAGE: Partial<Record<LeadStage, LeadStage>> = { '신규유입': '가망고객', '가망고객': 'TM 일정', 'TM 일정': '방문영업' }

export function SalesQueueScreen() {
  const navigate = useNavigate()
  const leads = usePrototypeStore((s) => s.leads)
  const advanceLead = usePrototypeStore((s) => s.advanceLead)
  const createQuoteFromLead = usePrototypeStore((s) => s.createQuoteFromLead)
  const [filter, setFilter] = useState<LeadStage | 'ALL'>('ALL')
  const [selectedId, setSelectedId] = useState<string | undefined>(leads[0]?.id)

  const filtered = useMemo(() => filter === 'ALL' ? leads : leads.filter((l) => l.stage === filter), [leads, filter])
  const selected = leads.find((l) => l.id === selectedId)

  return <section className="panel">
    <div className="screen-head"><div><span className="eyebrow">PST-101/102/103/201</span><h1>영업 Queue</h1><p>신규유입 → 가망고객 → TM/방문 일정. Customer Master를 새로 만들지 않고 고객360을 참조하는 View/Queue.</p></div></div>

    <div className="chip-row">
      <button type="button" className={filter === 'ALL' ? 'chip active' : 'chip'} onClick={() => setFilter('ALL')}>전체</button>
      {STAGES.map((s) => <button key={s} type="button" className={filter === s ? 'chip active' : 'chip'} onClick={() => setFilter(s)}>{s}</button>)}
    </div>

    {filtered.length === 0 ? <EmptyState message="해당 단계의 Queue가 비어 있습니다." /> : <div className="plain-columns plain-columns-narrow">
      <div>
        <div className="section-label">Queue</div>
        <ul className="plain-list">
          {filtered.map((l) => <li key={l.id}>
            <button type="button" className={l.id === selectedId ? 'plain-row active' : 'plain-row'} onClick={() => setSelectedId(l.id)}>
              <strong>{l.customerName} · {l.storeName}</strong>
              <span>{l.stage} · {l.nextAction}</span>
            </button>
          </li>)}
        </ul>
      </div>

      {selected ? <div className="detail-panel">
        <div className="section-label">{selected.stage}</div>
        <strong className="detail-title">{selected.customerName} · {selected.storeName}</strong>
        <span className="detail-subline">연락처 {selected.contact} · 유입경로 {selected.source}</span>
        <span className="detail-subline">메모: {selected.note || '-'}</span>

        <ul className="plain-list" style={{ marginTop: 12 }}>
          <div className="section-label">History</div>
          {selected.history.map((h, i) => <li key={i} className="plain-row"><strong>{h.at}</strong><span>{h.event}</span></li>)}
        </ul>

        <div className="action-zone">
          {NEXT_STAGE[selected.stage] ? <button type="button" className="btn-primary" onClick={() => advanceLead(selected.id, NEXT_STAGE[selected.stage]!)}><strong>{NEXT_STAGE[selected.stage]}(으)로 전환</strong><span>수동 전환 · 자동 상태전이 금지</span></button> : null}
          {selected.stage === '방문영업' ? <button type="button" className="btn-secondary" onClick={() => { const id = createQuoteFromLead(selected.id); navigate('/quotes', { state: { returnTo: '/sales', originLabel: '영업 Queue', focusQuoteId: id } satisfies NavigationState & { focusQuoteId: string } }) }}><strong>견적 작성</strong><span>Quote 신규 생성 → 견적서 관리로 이동</span></button> : null}
        </div>
      </div> : null}
    </div>}

    <div className="rule-grid"><article><small>Guard</small><strong>Customer Master 중복 생성 및 자동 상태전이 금지</strong></article><article><small>Return</small><strong>업무 완료/취소 → Customer360 Context 복귀</strong></article></div>
    <LiveContract endpoint={mockEndpoints.sales} />
    <p className="hold-note">Logical/Mock only · Physical DB / Provider / Production Binding = HOLD</p>
  </section>
}
