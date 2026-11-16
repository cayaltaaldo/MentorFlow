export interface TicketHistoryUser {
  id: number;
  name: string;
  email: string;
}

export interface TicketHistory {
  id: number;
  action: string;
  field: string | null;
  old_value: string | null;
  new_value: string | null;
  description: string | null;
  user?: TicketHistoryUser | null;
  created_at: string | null;
}

export interface TicketHistoryResponse {
  data: TicketHistory[];
}
