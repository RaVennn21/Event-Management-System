export interface IRefundPaymentService {
  processPayout(refundId: string, amount: number, bankDetails: any): Promise<string>;
}
