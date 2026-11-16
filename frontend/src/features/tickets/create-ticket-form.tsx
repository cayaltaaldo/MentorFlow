"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  TicketCategory,
  TicketPriority,
  CreateTicketPayload,
} from "@/types/ticket-catalog";

interface CreateTicketFormProps {
  categories: TicketCategory[];
  priorities: TicketPriority[];
}

interface TicketCreatedResponse {
  data: {
    id: number;
    ticket_number: string;
  };
}

interface ApiErrorResponse {
  message?: string;
  errors?: Record<string, string[]>;
}

export function CreateTicketForm({
  categories,
  priorities,
}: CreateTicketFormProps) {
  const router = useRouter();

  const [categoryId, setCategoryId] = useState("");
  const [priorityId, setPriorityId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, string[]>
  >({});

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (loading) return;

    setError("");
    setFieldErrors({});

    if (
      !categoryId ||
      !priorityId ||
      title.trim().length < 5 ||
      title.trim().length > 255 ||
      description.trim().length < 10
    ) {
      setError(
        "Completa todos los campos respetando las longitudes mínimas."
      );
      return;
    }

    const payload: CreateTicketPayload = {
      category_id: Number(categoryId),
      priority_id: Number(priorityId),
      title: title.trim(),
      description: description.trim(),
    };

    setLoading(true);

    try {
      const response = await fetch("/api/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result: TicketCreatedResponse &
        ApiErrorResponse = await response.json();

      if (!response.ok) {
        if (response.status === 422 && result.errors) {
          setFieldErrors(result.errors);
        }

        throw new Error(
          result.message ?? "No se pudo crear el ticket."
        );
      }

      if (!result.data?.id) {
        throw new Error(
          "El servidor no devolvió el identificador del ticket."
        );
      }

      router.push(`/tickets/${result.data.id}`);
      router.refresh();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Ocurrió un error inesperado."
      );
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100";

  const labelClass =
    "mb-2 block text-sm font-medium text-slate-700";

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="category" className={labelClass}>
            Categoría *
          </label>

          <select
            id="category"
            value={categoryId}
            onChange={(event) =>
              setCategoryId(event.target.value)
            }
            required
            disabled={loading}
            className={inputClass}
          >
            <option value="">Selecciona una categoría</option>

            {categories.map((category) => (
              <option
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>
            ))}
          </select>

          {fieldErrors.category_id && (
            <p className="mt-2 text-xs text-red-600">
              {fieldErrors.category_id[0]}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="priority" className={labelClass}>
            Prioridad *
          </label>

          <select
            id="priority"
            value={priorityId}
            onChange={(event) =>
              setPriorityId(event.target.value)
            }
            required
            disabled={loading}
            className={inputClass}
          >
            <option value="">Selecciona una prioridad</option>

            {priorities.map((priority) => (
              <option
                key={priority.id}
                value={priority.id}
              >
                {priority.name}
              </option>
            ))}
          </select>

          {fieldErrors.priority_id && (
            <p className="mt-2 text-xs text-red-600">
              {fieldErrors.priority_id[0]}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="title" className={labelClass}>
          Título del ticket *
        </label>

        <input
          id="title"
          type="text"
          value={title}
          onChange={(event) =>
            setTitle(event.target.value)
          }
          minLength={5}
          maxLength={255}
          required
          disabled={loading}
          placeholder="Ej. Problema de acceso al sistema"
          className={inputClass}
        />

        <p className="mt-2 text-xs text-slate-400">
          Entre 5 y 255 caracteres.
        </p>

        {fieldErrors.title && (
          <p className="mt-2 text-xs text-red-600">
            {fieldErrors.title[0]}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="description" className={labelClass}>
          Descripción *
        </label>

        <textarea
          id="description"
          value={description}
          onChange={(event) =>
            setDescription(event.target.value)
          }
          minLength={10}
          rows={6}
          required
          disabled={loading}
          placeholder="Describe el problema o solicitud con el mayor detalle posible..."
          className={inputClass}
        />

        <p className="mt-2 text-xs text-slate-400">
          Mínimo 10 caracteres.
        </p>

        {fieldErrors.description && (
          <p className="mt-2 text-xs text-red-600">
            {fieldErrors.description[0]}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-200 pt-6">
        <Link
          href="/tickets"
          aria-disabled={loading}
          onClick={(event) => {
            if (loading) event.preventDefault();
          }}
          className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Cancelar
        </Link>

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Creando ticket..." : "Crear ticket"}
        </button>
      </div>
    </form>
  );
}
