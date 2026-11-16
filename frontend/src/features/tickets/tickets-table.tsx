import Link from "next/link";

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

function formatDate(value: string | null): string {
  if (!value) {
    return "—";
  }

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

function getSlaStyle(status: string): string {
  switch (status) {
    case "breached":
      return "font-medium text-red-600";

    case "met":
    case "on_track":
      return "font-medium text-emerald-600";

    case "at_risk":
      return "font-medium text-amber-600";

    default:
      return "text-slate-600";
  }
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
            <th scope="col" className="px-5 py-4">
              Ticket
            </th>

            <th scope="col" className="px-5 py-4">
              Solicitante
            </th>

            <th scope="col" className="px-5 py-4">
              Estado
            </th>

            <th scope="col" className="px-5 py-4">
              Prioridad
            </th>

            <th scope="col" className="px-5 py-4">
              SLA
            </th>

            <th scope="col" className="px-5 py-4">
              Creado
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {tickets.map((ticket) => {
            const ticketUrl = `/tickets/${ticket.id}`;

            const slaStatus =
              ticket.sla?.status ?? "unknown";

            return (
              <tr
                key={ticket.id}
                className="transition-colors hover:bg-slate-50"
              >
                {/* TICKET */}

                <td className="px-5 py-4">
                  <Link
                    href={ticketUrl}
                    className="inline-block font-semibold text-blue-700 transition-colors hover:text-blue-900 hover:underline focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  >
                    {ticket.ticket_number}
                  </Link>

                  <div className="mt-1 max-w-64">
                    <Link
                      href={ticketUrl}
                      className="block truncate font-medium text-slate-900 transition-colors hover:text-blue-700 hover:underline"
                      title={ticket.title}
                    >
                      {ticket.title}
                    </Link>
                  </div>

                  <p className="mt-1 text-xs text-slate-500">
                    {ticket.category?.name ??
                      "Sin categoría"}
                  </p>
                </td>

                {/* SOLICITANTE */}

                <td className="px-5 py-4 text-slate-700">
                  {ticket.user?.name ?? "Sin usuario"}
                </td>

                {/* ESTADO */}

                <td className="px-5 py-4">
                  <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                    {ticket.status
                      ? statusLabels[ticket.status.slug] ??
                        ticket.status.name
                      : "Sin estado"}
                  </span>
                </td>

                {/* PRIORIDAD */}

                <td className="px-5 py-4 text-slate-700">
                  {ticket.priority?.name ??
                    "Sin prioridad"}
                </td>

                {/* SLA */}

                <td className="px-5 py-4">
                  <span className={getSlaStyle(slaStatus)}>
                    {slaLabels[slaStatus] ?? slaStatus}
                  </span>
                </td>

                {/* FECHA DE CREACIÓN */}

                <td className="px-5 py-4 text-slate-600">
                  {formatDate(ticket.created_at)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
