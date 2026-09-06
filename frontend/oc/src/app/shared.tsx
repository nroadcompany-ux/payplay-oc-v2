import { useQuery } from '@tanstack/react-query'
import { fetchMockResource } from '../api/mockApi'
import { type ActorClass, actorRank } from '../store/prototypeStore'

export type NavigationState = { returnTo?: string; originLabel?: string }

export function formatCurrency(amount: number) {
  return `${amount.toLocaleString('ko-KR')}원`
}

// --- Minimal inline icon glyphs (no icon library dependency) ---
function IconCircle({ children }: { children: React.ReactNode }) {
  return <svg className="state-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">{children}</svg>
}
export function IconEmpty() {
  return <IconCircle><rect x="3" y="6" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5" /><path d="M3 10h14" stroke="currentColor" strokeWidth="1.5" /></IconCircle>
}
export function IconError() {
  return <IconCircle><circle cx="10" cy="10" r="7.25" stroke="currentColor" strokeWidth="1.5" /><path d="M10 6.5v4.2M10 13.4h.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></IconCircle>
}
export function IconDenied() {
  return <IconCircle><circle cx="10" cy="10" r="7.25" stroke="currentColor" strokeWidth="1.5" /><path d="M5.5 5.5l9 9" stroke="currentColor" strokeWidth="1.5" /></IconCircle>
}
export function IconSpinner() {
  return <svg className="state-icon spin" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="7.25" stroke="currentColor" strokeOpacity=".2" strokeWidth="1.5" /><path d="M17.25 10a7.25 7.25 0 0 0-7.25-7.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
}

export function LoadingState({ label = '불러오는 중…' }: { label?: string }) {
  return <div className="state-block" role="status"><IconSpinner /><p>{label}</p></div>
}

export function EmptyState({ message, action }: { message: string; action?: { label: string; onClick: () => void } }) {
  return <div className="state-block">
    <IconEmpty />
    <p>{message}</p>
    {action ? <button type="button" className="btn-tertiary" onClick={action.onClick}>{action.label}</button> : null}
  </div>
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return <div className="state-block state-block-error" role="alert">
    <IconError />
    <p>{message}</p>
    {onRetry ? <button type="button" className="btn-secondary" onClick={onRetry}>다시 시도</button> : null}
  </div>
}

export function PermissionDeniedState({ message = '이 화면에 접근할 권한이 없습니다.', onReturn }: { message?: string; onReturn?: () => void }) {
  return <div className="state-block state-block-denied" role="alert">
    <IconDenied />
    <p>{message}</p>
    {onReturn ? <button type="button" className="btn-tertiary" onClick={onReturn}>이전 화면으로</button> : null}
  </div>
}

export function FieldMasked({ label }: { label?: string }) {
  return <span className="field-masked" title="권한이 없어 마스킹 처리되었습니다">{label ?? '••••••'}</span>
}

// A required-menu access gate for screens outside PSET-102 itself.
// minActor: the lowest ActorClass rank allowed to view this screen's real content.
export function hasMenuRank(actor: ActorClass, minActor: ActorClass) {
  return actorRank(actor) >= actorRank(minActor)
}

export function LiveContract({ endpoint }: { endpoint: string }) {
  const query = useQuery({ queryKey: ['mock-contract', endpoint], queryFn: () => fetchMockResource(endpoint) })
  if (query.isLoading) return <div className="api-box"><LoadingState label="Mock API 연결 중…" /></div>
  if (query.isError) return <div className="api-box api-error"><ErrorState message="Mock API 연결 실패 · 화면은 Static Contract로 유지됩니다." onRetry={() => query.refetch()} /></div>
  return <div className="api-box"><strong>LIVE MOCK API</strong><code>{JSON.stringify(query.data, null, 2)}</code></div>
}
