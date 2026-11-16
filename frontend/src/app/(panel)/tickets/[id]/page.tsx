import Link from "next/link";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Mail,
  Tag,
  Ticket as TicketIcon,
  UserRound,
} from "lucide-react";

import {
  laravelApi,
  LaravelApiError,
} from "@/lib/laravel-api";

import TicketHistorySection from "@/features/tickets/ticket-history";

import type { Ticket } from "@/types/ticket";
import type {
  TicketHistory,
  TicketHistoryResponse,
} from "@/types/ticket-history";

export const dynamic = "force-dynamic";

// ============================================
// TIPOS
// ============================================

interface TicketDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

interface TicketDetailResponse {
  data: Ticket;
}

// ============================================
// FUNCIONES AUXILIARES
// ============================================

function formatDate(value: string | null): string {
  if (!value) {
    return "No registrada";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Fecha inválida";
  }

  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Lima",
  }).format(date);
}

function formatSlaStatus(status?: string): string {
  switch (status) {
    case "on_track":
      return "Dentro del plazo";

    case "at_risk":
      return "En riesgo";

    case "breached":
      return "Vencido";

    case "met":
      return "Cumplido";

    case "unknown":
      return "Sin información";

    default:
      return status ?? "No disponible";
  }
}

function getStatusStyle(slug?: string): string {
  switch (slug) {
    case "open":
      return "bg-blue-50 text-blue-700";

    case "waiting":
      return "bg-amber-50 text-amber-700";

    case "assigned":
      return "bg-indigo-50 text-indigo-700";

    case "in-progress":
      return "bg-violet-50 text-violet-700";

    case "resolved":
      return "bg-emerald-50 text-emerald-700";

    case "closed":
      return "bg-slate-100 text-slate-700";

    case "cancelled":
      return "bg-red-50 text-red-700";

    default:
      return "bg-slate-100 text-slate-600";
  }
}

// ============================================
// COMPONENTE PARA MOSTRAR DATOS
// ============================================

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="text-sm font-semibold text-slate-800">
        {value}
      </p>
    </div>
  );
}

// ============================================
// PÁGINA PRINCIPAL
// ============================================

export default async function TicketDetailPage({
  params,
}: TicketDetailPageProps) {
  // Obtener ID desde la URL
  const { id } = await params;

  // Validar ID
  if (!/^[1-9]\d*$/.test(id)) {
    notFound();
  }

  // Obtener sesión
  const cookieStore = await cookies();

  const token = cookieStore.get(
    "mentorflow_session"
  )?.value;

  if (!token) {
    redirect("/login");
  }

  // Variables del ticket e historial
  let ticket: Ticket;

  let history: TicketHistory[] = [];

  let historyError = false;

  // ============================================
  // 1. CONSULTAR DETALLE DEL TICKET
  // ============================================

  try {
    const response =
      await laravelApi<TicketDetailResponse>(
        `/tickets/${id}`,
        {},
        token
      );

    ticket = response.data;
  } catch (error) {
    if (error instanceof LaravelApiError) {
      if (error.status === 404) {
        notFound();
      }

      if (error.status === 401) {
        redirect("/login");
      }

      if (error.status === 403) {
        return (
          <div
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-800"
          >
            No tienes permiso para consultar este ticket.
          </div>
        );
      }
    }

    return (
      <div
        role="alert"
        className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-800"
      >
        No se pudo cargar el detalle del ticket.
      </div>
    );
  }

  // ============================================
  // 2. CONSULTAR HISTORIAL DEL TICKET
  // ============================================

  try {
    const historyResponse =
      await laravelApi<TicketHistoryResponse>(
        `/tickets/${id}/history`,
        {},
        token
      );

    history = historyResponse.data;
  } catch (error) {
    if (
      error instanceof LaravelApiError &&
      error.status === 401
    ) {
      redirect("/login");
    }

    historyError = true;
  }

  // ============================================
  // 3. MOSTRAR PÁGINA
  // ============================================

  return (
    <div className="space-y-7">
      {/* VOLVER AL LISTADO */}

      <Link
        href="/tickets"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-blue-600"
      >
        <ArrowLeft size={17} />
        Volver a tickets
      </Link>

      {/* ENCABEZADO DEL TICKET */}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="min-w-0 space-y-3">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <TicketIcon size={17} />

              <span>{ticket.ticket_number}</span>
            </div>

            <h2 className="break-words text-2xl font-bold tracking-tight text-slate-900">
              {ticket.title}
            </h2>

            <p className="text-sm text-slate-500">
              Creado el {formatDate(ticket.created_at)}
            </p>
          </div>

          <span
            className={`rounded-full px-4 py-2 text-sm font-semibold ${getStatusStyle(
              ticket.status?.slug
            )}`}
          >
            {ticket.status?.name ?? "Sin estado"}
          </span>
        </div>

        {/* DESCRIPCIÓN */}

        <div className="mt-8 border-t border-slate-100 pt-7">
          <h3 className="text-base font-bold text-slate-900">
            Descripción
          </h3>

          <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-slate-600">
            {ticket.description ||
              "Este ticket no tiene una descripción registrada."}
          </p>
        </div>
      </section>

      {/* INFORMACIÓN GENERAL */}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* COLUMNA PRINCIPAL */}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="mb-6 flex items-center gap-2">
            <Tag
              size={19}
              className="text-blue-600"
            />

            <h3 className="text-lg font-bold text-slate-900">
              Información del ticket
            </h3>
          </div>

          <div className="grid gap-7 sm:grid-cols-2">
            <DetailItem
              label="Categoría"
              value={
                ticket.category?.name ??
                "Sin categoría"
              }
            />

            <DetailItem
              label="Prioridad"
              value={
                ticket.priority?.name ??
                "Sin prioridad"
              }
            />

            <DetailItem
              label="Estado"
              value={
                ticket.status?.name ??
                "Sin estado"
              }
            />

            <DetailItem
              label="Tiempo SLA configurado"
              value={
                ticket.priority?.sla_minutes != null
                  ? `${ticket.priority.sla_minutes} minutos`
                  : "No configurado"
              }
            />
          </div>

          {/* FECHAS IMPORTANTES */}

          <div className="mt-8 border-t border-slate-100 pt-7">
            <div className="mb-5 flex items-center gap-2">
              <CalendarDays
                size={19}
                className="text-blue-600"
              />

              <h3 className="text-base font-bold text-slate-900">
                Fechas importantes
              </h3>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <DetailItem
                label="Creación"
                value={formatDate(
                  ticket.created_at
                )}
              />

              <DetailItem
                label="Última actualización"
                value={formatDate(
                  ticket.updated_at
                )}
              />

              <DetailItem
                label="Resolución"
                value={formatDate(
                  ticket.resolved_at
                )}
              />

              <DetailItem
                label="Cierre"
                value={formatDate(
                  ticket.closed_at
                )}
              />
            </div>
          </div>
        </section>

        {/* COLUMNA LATERAL */}

        <div className="space-y-6">
          {/* PERSONAS */}

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
              <UserRound
                size={19}
                className="text-blue-600"
              />

              <h3 className="font-bold text-slate-900">
                Personas
              </h3>
            </div>

            <div className="space-y-6">
              {/* SOLICITANTE */}

              <div>
                <p className="text-xs font-medium uppercase text-slate-400">
                  Solicitante
                </p>

                <p className="mt-2 text-sm font-semibold text-slate-800">
                  {ticket.user?.name ??
                    "No disponible"}
                </p>

                {ticket.user?.email && (
                  <p className="mt-1 flex items-center gap-2 break-all text-xs text-slate-500">
                    <Mail size={14} />

                    {ticket.user.email}
                  </p>
                )}
              </div>

              {/* RESPONSABLE */}

              <div className="border-t border-slate-100 pt-5">
                <p className="text-xs font-medium uppercase text-slate-400">
                  Responsable asignado
                </p>

                <p className="mt-2 text-sm font-semibold text-slate-800">
                  {ticket.assigned_user?.name ??
                    "Sin asignar"}
                </p>

                {ticket.assigned_user?.email && (
                  <p className="mt-1 break-all text-xs text-slate-500">
                    {ticket.assigned_user.email}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* SEGUIMIENTO SLA */}

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
              <Clock3
                size={19}
                className="text-blue-600"
              />

              <h3 className="font-bold text-slate-900">
                Seguimiento SLA
              </h3>
            </div>

            <DetailItem
              label="Estado SLA"
              value={formatSlaStatus(
                ticket.sla?.status
              )}
            />

            <div className="mt-5">
              <DetailItem
                label="Fecha límite"
                value={formatDate(
                  ticket.sla?.due_at ??
                    ticket.due_at
                )}
              />
            </div>
          </section>
        </div>
      </div>

      {/* =====================================
          HISTORIAL DE ACTIVIDAD
          ===================================== */}

      {historyError ? (
        <section
          role="alert"
          className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-800"
        >
          No se pudo cargar el historial de actividad.
        </section>
      ) : (
        <TicketHistorySection history={history} />
      )}
    </div>
  );
}
