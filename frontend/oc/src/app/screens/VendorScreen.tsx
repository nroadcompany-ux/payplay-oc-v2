import { useMemo, useState } from 'react'
import { usePrototypeStore, type VendorType } from '../../store/prototypeStore'
import { EmptyState } from '../shared'

const ALL_TYPES: VendorType[] = ['파트너사', '제조사', '공급사', '설치/AS 협력사', '물류사', 'VAN/PG/POS']

export function VendorScreen() {
  const vendors = usePrototypeStore((s) => s.vendors)
  const toggleActive = usePrototypeStore((s) => s.toggleVendorActive)
  const [typeFilter, setTypeFilter] = useState<VendorType | 'ALL'>('ALL')
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string | undefined>(vendors[0]?.id)

  const filtered = useMemo(() => vendors.filter((v) =>
    (typeFilter === 'ALL' || v.vendorTypes.includes(typeFilter)) &&
    (query.trim() === '' || v.name.includes(query.trim())),
  ), [vendors, typeFilter, query])
  const selected = vendors.find((v) => v.id === selectedId)

  return <section className="panel">
    <div className="screen-head"><div><span className="eyebrow">PCI-201 / PCI-202</span><h1>거래처 관리</h1><p>파트너·제조사·공급사·VAN/PG/POS 등을 하나의 거래처 Master에서 유형으로 구분.</p></div></div>

    <div className="inline-form-row">
      <input type="text" placeholder="거래처명 검색" value={query} onChange={(e) => setQuery(e.target.value)} />
      <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as VendorType | 'ALL')}>
        <option value="ALL">전체 유형</option>
        {ALL_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
      </select>
    </div>

    {filtered.length === 0 ? <EmptyState message="조건에 맞는 거래처가 없습니다." /> : <div className="plain-columns plain-columns-narrow mt-16">
      <div>
        <div className="section-label">거래처 목록</div>
        <ul className="plain-list">
          {filtered.map((v) => <li key={v.id}>
            <button type="button" className={v.id === selectedId ? 'plain-row active' : 'plain-row'} onClick={() => setSelectedId(v.id)}>
              <strong>{v.name}</strong>
              <span>{v.vendorTypes.join(', ')} · {v.activeStatus}</span>
            </button>
          </li>)}
        </ul>
      </div>

      {selected ? <div className="detail-panel">
        <div className="section-label">{selected.id} · {selected.activeStatus}</div>
        <strong className="detail-title">{selected.name}</strong>
        <span className="detail-subline">사업자번호 {selected.bizRegNo} · 대표 {selected.ceo}</span>
        <span className="detail-subline">연락처 {selected.contact} · {selected.address}</span>
        <span className="detail-subline">유형: {selected.vendorTypes.join(', ')}</span>
        <button type="button" className="btn-secondary" style={{ marginTop: 12, justifySelf: 'start' }} onClick={() => toggleActive(selected.id)}>
          {selected.activeStatus === '활성' ? '비활성으로 전환' : '활성으로 전환'}
        </button>
        <p className="hold-note">삭제 대신 Inactive 전환 · 과거 발주 Snapshot은 소급 변경되지 않음</p>
      </div> : null}
    </div>}

    <div className="rule-grid"><article><small>Guard</small><strong>거래처 유형별 별도 Master 생성 금지</strong></article><article><small>Return</small><strong>관련 Domain 처리 후 거래처 Context 복귀</strong></article></div>
    <p className="hold-note">Logical/Mock only · Physical Vendor Entity = HOLD</p>
  </section>
}
