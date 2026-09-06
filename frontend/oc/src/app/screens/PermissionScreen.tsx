import { useState } from 'react'
import { ACTOR_CLASSES, type ActorClass, type PermissionAction, usePrototypeStore } from '../../store/prototypeStore'
import { FieldMasked, PermissionDeniedState } from '../shared'

const ACTIONS: PermissionAction[] = ['create', 'edit', 'change_status', 'export', 'delete_deactivate', 'close', 'recover']
const SAMPLE_MENUS: { id: string; label: string }[] = [
  { id: 'settings.permissions', label: '권한 설정' },
  { id: 'ops.receivable', label: '미수금 관리' },
  { id: 'customer360.finance', label: '고객360 정산 필드' },
]

export function PermissionScreen() {
  const actor = usePrototypeStore((s) => s.actor)
  const permissions = usePrototypeStore((s) => s.permissions)
  const auditLog = usePrototypeStore((s) => s.auditLog)
  const setPermission = usePrototypeStore((s) => s.setPermission)
  const canAccessMenu = usePrototypeStore((s) => s.canAccessMenu)

  const [targetActor, setTargetActor] = useState<ActorClass>('내부 직원')
  const [reason, setReason] = useState('')
  const [urlTestActor, setUrlTestActor] = useState<ActorClass>('외부 파트너')
  const [saveMessage, setSaveMessage] = useState<string | undefined>()

  const perm = permissions[targetActor]
  const isSelfEdit = targetActor === actor

  if (!canAccessMenu(actor, 'settings.permissions')) {
    return <section className="panel">
      <div className="screen-head"><div><span className="eyebrow">PSET-102</span><h1>권한 설정</h1></div></div>
      <PermissionDeniedState message={`현재 역할(${actor})은 권한 설정 화면에 접근할 수 없습니다.`} />
    </section>
  }

  return <section className="panel">
    <div className="screen-head"><div><span className="eyebrow">PSET-102</span><h1>권한 설정</h1><p>Menu + Row Scope + Field Visibility + Action Permission. Default Deny.</p></div></div>

    <div className="inline-form-row">
      <label>대상 역할 <select value={targetActor} onChange={(e) => setTargetActor(e.target.value as ActorClass)}>{ACTOR_CLASSES.map((a) => <option key={a} value={a}>{a}</option>)}</select></label>
    </div>

    <div className="plain-columns plain-columns-even mt-16">
      <div>
        <div className="section-label">Menu Access</div>
        <ul className="plain-list">{SAMPLE_MENUS.map((m) => <li key={m.id} className="plain-row"><strong>{m.label}</strong><span>{perm.menuAccess[m.id] ? '허용' : 'Denied'}</span></li>)}</ul>

        <div className="section-label" style={{ marginTop: 16 }}>Row Scope</div>
        <p className="detail-subline">{perm.rowScope}</p>

        <div className="section-label" style={{ marginTop: 16 }}>Field Visibility (고객 정산 금액)</div>
        <p className="detail-subline">{perm.fieldVisibility.customerFinanceAmount === 'visible' ? '1,200,000원' : <FieldMasked />} ({perm.fieldVisibility.customerFinanceAmount})</p>
      </div>
      <div>
        <div className="section-label">Action Permission</div>
        <ul className="plain-list">{ACTIONS.map((a) => <li key={a} className="plain-row"><strong>{a}</strong><span>{perm.actionPermission[a] ? '허용' : 'Denied'}</span></li>)}</ul>
      </div>
    </div>

    <div className="section-label" style={{ marginTop: 20 }}>권한 변경 (Audit 필수)</div>
    <div className="inline-form-row">
      <input type="text" placeholder="변경 사유" value={reason} onChange={(e) => setReason(e.target.value)} />
      <button type="button" className="btn-primary" disabled={isSelfEdit || !reason.trim()} onClick={() => {
        setPermission(targetActor, { rowScope: perm.rowScope === 'ALL' ? 'ORG' : 'ALL' }, reason.trim(), 'Row Scope 변경')
        setReason('')
        setSaveMessage('변경 완료 · Audit 기록됨')
      }}>Row Scope 순환 변경 Preview</button>
    </div>
    {isSelfEdit ? <p className="inline-error">자기 자신의 권한은 본인이 수정할 수 없습니다 (Self-escalation 방지).</p> : null}
    {saveMessage ? <p className="hold-note">{saveMessage}</p> : null}

    <div className="section-label" style={{ marginTop: 20 }}>Direct URL 접근 테스트</div>
    <div className="inline-form-row">
      <select value={urlTestActor} onChange={(e) => setUrlTestActor(e.target.value as ActorClass)}>{ACTOR_CLASSES.map((a) => <option key={a} value={a}>{a}</option>)}</select>
      <span className="detail-subline">역할로 `/settings/permissions` 직접 접근 시:</span>
    </div>
    {canAccessMenu(urlTestActor, 'settings.permissions') ? <p className="hold-note">허용됨 (hidden menu 여부와 무관하게 실제 권한 검사 통과)</p> : <PermissionDeniedState message={`${urlTestActor}는 숨겨진 메뉴 뒤에서도 직접 URL 접근이 차단됩니다.`} />}

    <div className="section-label" style={{ marginTop: 20 }}>Audit / 변경 이력</div>
    {auditLog.length === 0 ? <p className="plain-empty">기록된 변경 이력이 없습니다.</p> : <ul className="plain-list">{auditLog.map((a) => <li key={a.id} className="plain-row"><strong>{a.timestamp} · {a.target}</strong><span>{a.actor} · 사유: {a.reason}</span></li>)}</ul>}

    <div className="rule-grid"><article><small>Guard</small><strong>Legacy allow-all RLS 재사용 금지 / Default Deny</strong></article><article><small>Return</small><strong>변경 시 Audit Before/After</strong></article></div>
    <p className="hold-note">Logical/Mock only · Shared IAM Physical Architecture = HOLD</p>
  </section>
}
