import api from './api';

export type TicketStatus =
  | 'TRIAGE'
  | 'OPENED'
  | 'ESCALATED'
  | 'CLOSED'
  | 'RESOLVED';

export type TicketResponse = {
  id: string;
  ticketNumber: number;
  companyId: string;
  clientId: string;
  agentId?: string | null;
  supportGroupId?: string | null;
  subjectId?: string | null;
  status: TicketStatus;
  priority?: string | null;
  ratingScore?: number | null;
  ratingComment?: string | null;
  createdAt: string;
  updatedAt: string;
  closedAt?: string | null;
  isArchived: boolean;
  deletedAt?: string | null;
  client?: { id: string; name: string };
  agent?: {
    id: string;
    supportLevel: string;
    user?: { name?: string; avatarUrl?: string };
  };
  company?: { id: string; name: string };
  supportGroup?: { id: string; name: string } | null;
  subject?: { id: string; name: string } | null;
};

export type TicketListResponse = {
  data: TicketResponse[];
  meta: { total: number; page: number; lastPage: number; limit: number };
};

export const ticketService = {
  async list(params?: {
    page?: number;
    limit?: number;
    status?: TicketStatus;
    includeArchived?: boolean;
  }): Promise<TicketListResponse> {
    const { data } = await api.get<TicketListResponse>('/tickets', {
      params,
    });
    return data;
  },

  async getById(
    ticketId: string,
    includeArchived?: boolean,
  ): Promise<TicketResponse> {
    const { data } = await api.get<TicketResponse>(`/tickets/${ticketId}`, {
      params: includeArchived ? { includeArchived: true } : undefined,
    });
    return data;
  },
};