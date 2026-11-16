export interface TicketUser {
  id: number;
  name: string;
  email: string;
}

export interface TicketRelation {
  id: number;
  name: string;
}

export interface TicketPriority extends TicketRelation {
  sla_minutes: number;
}

export interface TicketStatus extends TicketRelation {
  slug: string;
}

export interface Ticket {
  id: number;
  ticket_number: string;
  title: string;
  description: string | null;
  user: TicketUser | null;
  category: TicketRelation | null;
  priority: TicketPriority | null;
  status: TicketStatus | null;
  assigned_user: TicketUser | null;
  sla: {
    due_at: string | null;
    status: string;
  };
  due_at: string | null;
  resolved_at: string | null;
  closed_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface TicketsResponse {
  data: Ticket[];
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
  };
}
