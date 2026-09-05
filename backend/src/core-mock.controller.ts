import { Controller, Get, Param } from '@nestjs/common'

const customer360 = {
  customerId: 'CUST-MOCK-001',
  canonicalOwner: 'PST-301',
  name: '샘플 가맹점',
  currentWork: [
    { sourceId: 'PST-401', title: '견적 진행', state: '진행', returnTo: '/customers' },
    { sourceId: 'PCS-103', title: 'A/S 접수', state: '보류', returnTo: '/customers' },
  ],
  activityLedger: [
    { type: 'QUOTE_UPDATED', sourceId: 'PST-401', appendOnly: true },
    { type: 'AS_VISIT_REQUIRED', sourceId: 'PCS-103', appendOnly: true },
  ],
}

const today = {
  projectionOwner: 'PCS-101',
  sourceMutationAllowed: false,
  states: ['예정', '진행', '보류', '완료'],
  items: [
    { workId: 'W-001', sourceId: 'PCS-103', title: 'A/S 방문 필요', state: '진행', sourcePath: '/as-cases' },
    { workId: 'W-002', sourceId: 'PST-401', title: '견적 확인', state: '예정', sourcePath: '/customers' },
  ],
}

const service = {
  caseId: 'AS-MOCK-001',
  owner: 'PCS-103',
  state: '방문 필요',
  handoff: {
    whatWeKnow: '결제단말 전원 반복 종료',
    whatWeTried: '원격 재부팅 및 케이블 점검',
    whatWeNeed: '현장 전원/단말 테스트',
    remoteImpossibleReason: '현장 전원 측정 필요',
  },
  visit: {
    owner: 'PCS-102',
    evidenceRequired: ['사진', 'Serial/Asset', 'Test Result', '고객 확인'],
    statesSupported: ['도착', '작업 시작', '진단', '부분완료', '재방문', '완료 요청'],
    verifiedCompleteGate: '필수 Evidence 충족 후에만 가능',
  },
  closeRule: 'VS 완료와 A/S Case Close는 별도 명령',
}

const sales = {
  customerMasterOwner: 'PST-301',
  autoTransitionAllowed: false,
  views: [
    { id: 'PST-101', name: '신규유입' },
    { id: 'PST-102', name: '가망고객' },
    { id: 'PST-103', name: 'TM 영업 일정' },
    { id: 'PST-201', name: '방문 영업 일정' },
  ],
  quote: {
    owner: 'PST-401',
    actions: ['작성', '수정', 'PDF', '전송', '상태변경', '견적→계약'],
    internalApprovalIncluded: false,
  },
}

@Controller('mock')
export class CoreMockController {
  @Get('customer360/:id')
  getCustomer360(@Param('id') id: string) {
    return { ...customer360, requestedCustomerId: id, mode: 'LOGICAL_MOCK' }
  }

  @Get('today')
  getToday() {
    return { ...today, mode: 'LOGICAL_MOCK' }
  }

  @Get('service/as-case/:id')
  getServiceCase(@Param('id') id: string) {
    return { ...service, requestedCaseId: id, mode: 'LOGICAL_MOCK' }
  }

  @Get('sales')
  getSales() {
    return { ...sales, mode: 'LOGICAL_MOCK' }
  }
}
