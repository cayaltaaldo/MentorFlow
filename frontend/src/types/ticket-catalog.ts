export interface TicketCategory {
  id: number;
  name: string;
  description: string | null;
}

export interface TicketPriority {
  id: number;
  name: string;
  sla_minutes: number;
}

export interface TicketCatalogResponse<T> {
  data: T[];
}

export interface CreateTicketPayload {
  category_id: number;
  priority_id: number;
  title: string;
  description: string;
}
