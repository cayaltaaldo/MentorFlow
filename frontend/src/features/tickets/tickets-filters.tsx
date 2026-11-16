type TicketsFiltersProps = {
  search: string;
  status: string;
  sort: string;
};

const statuses = [
  { value: "", label: "Todos los estados" },
  { value: "open", label: "Abierto" },
  { value: "waiting", label: "En espera" },
  { value: "assigned", label: "Asignado" },
  { value: "in-progress", label: "En proceso" },
  { value: "resolved", label: "Resuelto" },
  { value: "closed", label: "Cerrado" },
  { value: "cancelled", label: "Cancelado" },
];

export default function TicketsFilters({
  search,
  status,
  sort,
}: TicketsFiltersProps) {
  return (
    <form
      action="/tickets"
      method="GET"
      className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-[minmax(0,1fr)_180px_190px_auto]"
    >
      <input
        type="search"
        name="search"
        maxLength={100}
        defaultValue={search}
        placeholder="Buscar número, título o usuario..."
        aria-label="Buscar tickets"
        className="min-w-0 rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500"
      />

      <select
        name="status"
        defaultValue={status}
        aria-label="Filtrar por estado"
        className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700"
      >
        {statuses.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>

      <select
        name="sort"
        defaultValue={sort}
        aria-label="Ordenar tickets"
        className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700"
      >
        <option value="-created_at">Más recientes</option>
        <option value="created_at">Más antiguos</option>
        <option value="-updated_at">Actualizados recientemente</option>
        <option value="updated_at">Menos recientes en actualizar</option>
        <option value="due_at">SLA más próximo</option>
        <option value="-due_at">SLA más lejano</option>
      </select>

      <button
        type="submit"
        className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
      >
        Aplicar
      </button>
    </form>
  );
}
