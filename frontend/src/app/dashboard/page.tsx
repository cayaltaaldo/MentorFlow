import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  CircleX,
  Clock3,
  ShieldCheck,
  Ticket,
} from "lucide-react";

import Sidebar from "@/components/layout/sidebar";

import {
  laravelApi,
  LaravelApiError,
} from "@/lib/laravel-api";

import type {
  AuthUser,
  CurrentUserResponse,
} from "@/types/auth";

import type {
  TicketDashboardResponse,
  TicketDashboardStats,
} from "@/types/dashboard";

export const dynamic = "force-dynamic";

type Metric = {
  label: string;
  value: number;
  icon: typeof Ticket;
  color: string;
  background: string;
};

function MetricCard({ metric }: { metric: Metric }) {
  const Icon = metric.icon;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-slate-500">
          {metric.label}
        </p>

        <div
          className={`rounded-xl p-2.5 ${metric.background}`}
        >
          <Icon
            className={`h-5 w-5 ${metric.color}`}
          />
        </div>
      </div>

      <p className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
        {metric.value}
      </p>
    </div>
  );
}

function DashboardContent({
  user,
  stats,
}: {
  user: AuthUser;
  stats: TicketDashboardStats;
}) {
  const metrics: Metric[] = [
    {
      label: "Total de tickets",
      value: stats.total_tickets,
      icon: Ticket,
      color: "text-blue-600",
      background: "bg-blue-50",
    },
    {
      label: "Tickets activos",
      value: stats.open_tickets,
      icon: Clock3,
      color: "text-amber-600",
      background: "bg-amber-50",
    },
    {
      label: "Tickets resueltos",
      value: stats.resolved_tickets,
      icon: CheckCircle2,
      color: "text-emerald-600",
      background: "bg-emerald-50",
    },
    {
      label: "Tickets cancelados",
      value: stats.cancelled_tickets,
      icon: CircleX,
      color: "text-slate-600",
      background: "bg-slate-100",
    },
  ];

  const slaMetrics: Metric[] = [
    {
      label: "En plazo",
      value: stats.sla.on_track,
      icon: ShieldCheck,
      color: "text-emerald-600",
      background: "bg-emerald-50",
    },
    {
      label: "En riesgo",
      value: stats.sla.at_risk,
      icon: AlertTriangle,
      color: "text-amber-600",
      background: "bg-amber-50",
    },
    {
      label: "SLA vencido",
      value: stats.sla.breached,
      icon: Activity,
      color: "text-red-600",
      background: "bg-red-50",
    },
    {
      label: "Sin fecha límite",
      value: stats.sla.unknown,
      icon: Clock3,
      color: "text-slate-600",
      background: "bg-slate-100",
    },
  ];

  const historicalMetrics: Metric[] = [
    {
      label: "SLA cumplido",
      value: stats.historical_sla.met,
      icon: CheckCircle2,
      color: "text-emerald-600",
      background: "bg-emerald-50",
    },
    {
      label: "SLA incumplido",
      value: stats.historical_sla.breached,
      icon: AlertTriangle,
      color: "text-red-600",
      background: "bg-red-50",
    },
    {
      label: "Sin fecha límite",
      value: stats.historical_sla.unknown,
      icon: Clock3,
      color: "text-slate-600",
      background: "bg-slate-100",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar user={user} />

      <main className="min-h-screen md:ml-64">
        <div className="mx-auto max-w-7xl space-y-10 px-5 py-8 sm:px-6 lg:px-10">
          <section>
            <div className="mb-6">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Panel de control
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Bienvenido, {user.name}. Consulta el estado
                general de las incidencias.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {metrics.map((metric) => (
                <MetricCard
                  key={metric.label}
                  metric={metric}
                />
              ))}
            </div>
          </section>

          <section>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900">
                Monitoreo de SLA
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Seguimiento de los tiempos de atención
                de los tickets activos.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {slaMetrics.map((metric) => (
                <MetricCard
                  key={metric.label}
                  metric={metric}
                />
              ))}
            </div>
          </section>

          <section>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900">
                Historial de SLA
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Cumplimiento de los tiempos de resolución
                de los tickets resueltos y cerrados.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {historicalMetrics.map((metric) => (
                <MetricCard
                  key={metric.label}
                  metric={metric}
                />
              ))}
            </div>

            <p className="mt-4 text-xs text-slate-500">
              Los resultados históricos dependen de las
              fechas de resolución registradas en Laravel.
            </p>
          </section>

          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800">
            Los indicadores se obtienen directamente
            de la API de Laravel.
          </div>
        </div>
      </main>
    </div>
  );
}

function DashboardError({
  user,
  message,
}: {
  user: AuthUser;
  message: string;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar user={user} />

      <main className="p-6 md:ml-64 md:p-10">
        <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-8">
          <h1 className="text-2xl font-bold text-slate-900">
            Panel de control
          </h1>

          <p className="mt-2 text-slate-600">
            Bienvenido, {user.name}.
          </p>

          <div
            role="alert"
            className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800"
          >
            {message}
          </div>
        </div>
      </main>
    </div>
  );
}

export default async function DashboardPage() {
  const cookieStore = await cookies();

  const token = cookieStore.get(
    "mentorflow_session"
  )?.value;

  if (!token) {
    redirect("/login");
  }

  let user: AuthUser;

  try {
    const response =
      await laravelApi<CurrentUserResponse>(
        "/user",
        {},
        token
      );

    user = response.data.user;
  } catch (error) {
    if (
      error instanceof LaravelApiError &&
      (error.status === 401 || error.status === 403)
    ) {
      redirect("/login");
    }

    throw error;
  }

  let stats: TicketDashboardStats | null = null;

  let dashboardError: string | null = null;

  try {
    const response =
      await laravelApi<TicketDashboardResponse>(
        "/dashboard/tickets",
        {},
        token
      );

    stats = response.data;
  } catch (error) {
    if (error instanceof LaravelApiError) {
      dashboardError =
        error.status === 403
          ? "Tu usuario no tiene permiso para consultar las estadísticas."
          : error.message;
    } else {
      dashboardError =
        "No se pudieron cargar las estadísticas.";
    }
  }

  if (!stats) {
    return (
      <DashboardError
        user={user}
        message={
          dashboardError ??
          "No hay estadísticas disponibles."
        }
      />
    );
  }

  return (
    <DashboardContent
      user={user}
      stats={stats}
    />
  );
}
