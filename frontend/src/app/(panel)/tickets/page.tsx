import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Plus, Ticket } from "lucide-react";

import TicketsFilters from "@/features/tickets/tickets-filters";
import TicketsTable from "@/features/tickets/tickets-table";

import {
  laravelApi,
  LaravelApiError,
} from "@/lib/laravel-api";

import type { TicketsResponse } from "@/types/ticket";

export const dynamic = "force-dynamic";

type SearchParams = {
  search?: string | string[];
  status?: string | string[];
  sort?: string | string[];
  page?: string | string[];
};

type TicketsPageProps = {
  searchParams: Promise<SearchParams>;
};

function singleValue(
  value: string | string[] | undefined,
  fallback = ""
): string {
  return typeof value === "string" ? value : fallback;
}

const validStatuses = new Set([
  "",
  "open",
  "waiting",
  "assigned",
  "in-progress",
  "resolved",
  "closed",
  "cancelled",
]);

const validSorts = new Set([
  "created_at",
  "-created_at",
  "updated_at",
  "-updated_at",
  "due_at",
  "-due_at",
]);

function pageUrl(
  page: number,
  search: string,
  status: string,
  sort: string
) {
  const params = new URLSearchParams();

  if (search) params.set("search", search);
  if (status) params.set("status", status);

  params.set("sort", sort);
  params.set("page", String(page));

  return `/tickets?${params.toString()}`;
}

export default async function TicketsPage({
  searchParams,
}: TicketsPageProps) {
  const cookieStore = await cookies();
  const token = cookieStore.get("mentorflow_session")?.value;

  if (!token) {
    redirect("/login");
  }

  const params = await searchParams;

  const search = singleValue(params.search).slice(0, 100);

  const requestedStatus = singleValue(params.status);
  const status = validStatuses.has(requestedStatus)
    ? requestedStatus
    : "";

  const requestedSort = singleValue(
    params.sort,
    "-created_at"
  );

  const sort = validSorts.has(requestedSort)
    ? requestedSort
    : "-created_at";

  const requestedPage = singleValue(params.page, "1");
  const parsedPage = Number(requestedPage);

  const page =
    Number.isSafeInteger(parsedPage) && parsedPage > 0
      ? parsedPage
      : 1;

  const query = new URLSearchParams({
    page: String(page),
    per_page: "15",
    sort,
  });

  if (search) query.set("search", search);
  if (status) query.set("status", status);

  let result: TicketsResponse | null = null;
  let errorMessage: string | null = null;

  try {
    result = await laravelApi<TicketsResponse>(
      `/tickets?${query.toString()}`,
      {},
      token
    );
  } catch (error) {
    if (error instanceof LaravelApiError) {
      errorMessage =
        error.status === 403
          ? "No tienes permiso para consultar los tickets."
          : error.message;
    } else {
      errorMessage = "No se pudieron cargar los tickets.";
    }
  }

  return (
    <div className="space-y-7">
      {/* Encabezado */}
      <section className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Tickets
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Consulta, busca y filtra las incidencias
            registradas en MentorFlow.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700">
            <Ticket size={18} />
            Gestión de incidencias
          </div>

          <Link
            href="/tickets/new"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <Plus size={18} />
            Nuevo ticket
          </Link>
        </div>
      </section>

      {/* Filtros */}
      <section>
        <TicketsFilters
          search={search}
          status={status}
          sort={sort}
        />
      </section>

      {/* Errores */}
      {errorMessage && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {errorMessage}
        </div>
      )}

      {/* Listado */}
      {result && (
        <section className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-600">
              <span className="font-semibold text-slate-900">
                {result.meta.total.toLocaleString("es-PE")}
              </span>{" "}
              tickets encontrados
            </p>

            <p className="text-sm text-slate-500">
              Página {result.meta.current_page} de{" "}
              {result.meta.last_page}
            </p>
          </div>

          <div className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <TicketsTable tickets={result.data} />
            </div>
          </div>

          {/* Paginación */}
          <div className="flex items-center justify-between gap-3">
            {result.meta.current_page > 1 ? (
              <Link
                href={pageUrl(
                  result.meta.current_page - 1,
                  search,
                  status,
                  sort
                )}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Anterior
              </Link>
            ) : (
              <span className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-400">
                Anterior
              </span>
            )}

            <span className="text-sm text-slate-500">
              {result.meta.current_page} /{" "}
              {result.meta.last_page}
            </span>

            {result.meta.current_page <
            result.meta.last_page ? (
              <Link
                href={pageUrl(
                  result.meta.current_page + 1,
                  search,
                  status,
                  sort
                )}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Siguiente
              </Link>
            ) : (
              <span className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-400">
                Siguiente
              </span>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
