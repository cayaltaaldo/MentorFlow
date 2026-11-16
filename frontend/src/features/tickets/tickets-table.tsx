import type { Ticket } from "@/types/ticket";

type TicketsTableProps = {
  tickets: Ticket[];
};

const statusLabels: Record<string, string> = {
  open: "Abierto",
  waiting: "En espera",
  assigned: "Asignado",
  "in-progress": "En proceso",
  resolved: "Resuelto",
  closed: "Cerrado",
  cancelled: "Cancelado",
};

const slaLabels: Record<string, string> = {
  on_track: "En plazo",
  at_risk: "En riesgo",
  breached: "Vencido",
  met: "Cumplido",
  unknown: "Sin fecha",
};

function formatDate(value: string | null) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "America/Lima",
  }).format(date);
}

export default function TicketsTable({
  tickets,
}: TicketsTableProps) {
  if (tickets.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
        <p className="font-semibold text-slate-800">
          No se encontraron tickets
        </p>

        <p className="mt-2 text-sm text-slate-500">
          Prueba con otros términos o filtros.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-[900px] text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-5 py-4">Ticket</th>
            <th className="px-5 py-4">Solicitante</th>
            <th className="px-5 py-4">Estado</th>
            <th className="px-5 py-4">Prioridad</th>
            <th className="px-5 py-4">SLA</th>
            <th className="px-5 py-4">Creado</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {tickets.map((ticket) => (
            <tr
              key={ticket.id}
              className="hover:bg-slate-50"
            >
              <td className="px-5 py-4">
                <p className="font-semibold text-blue-700">
                  {ticket.ticket_number}
                </p>

                <p className="mt-1 max-w-64 truncate font-medium text-slate-900">
                  {ticket.title}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {ticket.category?.name ?? "Sin categoría"}
                </p>
              </td>

              <td className="px-5 py-4 text-slate-700">
                {ticket.user?.name ?? "Sin usuario"}
              </td>

              <td className="px-5 py-4">
                <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                  {ticket.status
                    ? statusLabels[ticket.status.slug] ??
                      ticket.status.name
                    : "Sin estado"}
                </span>
              </td>

              <td className="px-5 py-4 text-slate-700">
                {ticket.priority?.name ?? "Sin prioridad"}
              </td>

              <td className="px-5 py-4">
                <span
                  className={
                    ticket.sla.status === "breached"
                      ? "font-medium text-red-600"
                      : ticket.sla.status === "met" ||
                          ticket.sla.status === "on_track"
                        ? "font-medium text-emerald-600"
                        : "text-slate-600"
                  }
                >
                  {slaLabels[ticket.sla.status] ??
                    ticket.sla.status}
                </span>
              </td>

              <td className="px-5 py-4 text-slate-600">
                {formatDate(ticket.created_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
