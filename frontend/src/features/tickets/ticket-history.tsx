import {
  Activity,
  ArrowRight,
  Clock3,
  History,
  UserRound,
} from "lucide-react";

import type { TicketHistory } from "@/types/ticket-history";

interface TicketHistoryProps {
  history: TicketHistory[];
}

function formatDate(value: string | null): string {
  if (!value) return "Fecha no disponible";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Fecha inválida";
  }

  return new Intl.DateTimeFormat("es-PE", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Lima",
  }).format(date);
}

export default function TicketHistorySection({
  history,
}: TicketHistoryProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-7 flex items-center gap-3">
        <History className="text-blue-600" size={22} />

        <div>
          <h3 className="text-lg font-bold text-slate-900">
            Historial de actividad
          </h3>

          <p className="text-sm text-slate-500">
            Registro de cambios y seguimiento del ticket.
          </p>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center">
          <Activity
            size={28}
            className="mx-auto mb-3 text-slate-400"
          />

          <p className="text-sm text-slate-500">
            Este ticket todavía no tiene movimientos registrados.
          </p>
        </div>
      ) : (
        <ol className="relative ml-3 border-l-2 border-slate-200">
          {history.map((item) => (
            <li key={item.id} className="relative mb-8 ml-7 last:mb-0">
              <span className="absolute -left-[38px] flex h-5 w-5 items-center justify-center rounded-full border-4 border-white bg-blue-600" />

              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="rounded-md bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    {item.action}
                  </span>

                  <span className="flex items-center gap-1 text-xs text-slate-400">
                    <Clock3 size={13} />
                    {formatDate(item.created_at)}
                  </span>
                </div>

                {item.description && (
                  <p className="text-sm leading-6 text-slate-700">
                    {item.description}
                  </p>
                )}

                {item.field && (
                  <p className="text-xs text-slate-500">
                    Campo modificado:{" "}
                    <span className="font-semibold">
                      {item.field}
                    </span>
                  </p>
                )}

                {(item.old_value !== null ||
                  item.new_value !== null) && (
                  <div className="flex flex-wrap items-center gap-3 rounded-lg bg-slate-50 px-4 py-3 text-sm">
                    <span className="break-all text-slate-500">
                      {item.old_value ?? "Sin valor"}
                    </span>

                    <ArrowRight
                      size={15}
                      className="shrink-0 text-slate-400"
                    />

                    <span className="break-all font-semibold text-slate-800">
                      {item.new_value ?? "Sin valor"}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <UserRound size={14} />

                  <span>
                    {item.user?.name ?? "Sistema"}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
