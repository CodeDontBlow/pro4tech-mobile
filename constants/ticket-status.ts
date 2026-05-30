export type TicketStatus =
  | 'TRIAGE'
  | 'OPENED'
  | 'ESCALATED'
  | 'CLOSED'
  | 'RESOLVED';

export const statusLabelMap: Record<TicketStatus, string> = {
  TRIAGE: 'Triagem',
  OPENED: 'Aberto',
  ESCALATED: 'Escalado',
  CLOSED: 'Encerrado',
  RESOLVED: 'Resolvido',
};

export const CLOSED_LIKE_STATUSES: TicketStatus[] = ['CLOSED', 'RESOLVED'];
