import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { laravelApi } from "@/lib/laravel-api";
import {
  TicketCategory,
  TicketPriority,
  TicketCatalogResponse,
} from "@/types/ticket-catalog";

import { CreateTicketForm } from "@/features/tickets/create-ticket-form";

export const dynamic = "force-dynamic";

export default async function NewTicketPage() {
  const token = (await cookies()).get(
    "mentorflow_session"
  )?.value;

  if (!token) {
    redirect("/login");
  }

  let categories: TicketCategory[] = [];
  let priorities: TicketPriority[] = [];
  let loadError = false;

  try {
    const [categoriesResponse, prioritiesResponse] =
      await Promise.all([
        laravelApi<TicketCatalogResponse<TicketCategory>>(
          "/ticket-categories",
          {},
          token
        ),
        laravelApi<TicketCatalogResponse<TicketPriority>>(
          "/ticket-priorities",
          {},
          token
        ),
      ]);

    categories = categoriesResponse.data;
    priorities = prioritiesResponse.data;
  } catch {
    loadError = true;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <Link
          href="/tickets"
          className="text-sm font-medium text-slate-500 hover:text-slate-900"
        >
          ← Volver a tickets
        </Link>

        <h1 className="mt-4 text-2xl font-semibold text-slate-900">
          Crear nuevo ticket
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Registra una solicitud para que pueda ser
          gestionada y supervisada desde MentorFlow.
        </p>
      </div>

      {loadError ? (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700"
        >
          No se pudieron cargar las categorías y prioridades.
          Verifica tu conexión y los permisos de tu usuario.
        </div>
      ) : categories.length === 0 ||
        priorities.length === 0 ? (
        <div
          role="alert"
          className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800"
        >
          No hay categorías o prioridades activas
          disponibles para crear tickets.
        </div>
      ) : (
        <CreateTicketForm
          categories={categories}
          priorities={priorities}
        />
      )}
    </div>
  );
}
