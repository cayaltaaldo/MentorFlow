
export interface TicketDashboardStats {
  total_tickets: number;
  open_tickets: number;
  resolved_tickets: number;
  cancelled_tickets: number;

  sla: {
    on_track: number;
    at_risk: number;
    breached: number;
    unknown: number;
  };

  historical_sla: {
    met: number;
    breached: number;
    unknown: number;
  };
}

export interface TicketDashboardResponse {
  data: TicketDashboardStats;
}
