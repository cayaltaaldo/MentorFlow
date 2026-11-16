
import "server-only";

const API_URL = process.env.LARAVEL_API_URL;

export class LaravelApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "LaravelApiError";
  }
}

export async function laravelApi<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string,
): Promise<T> {
  if (!API_URL) {
    throw new Error(
      "Falta configurar LARAVEL_API_URL en .env.local",
    );
  }

  const headers = new Headers(options.headers);

  headers.set("Accept", "application/json");

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let response: Response;

  try {
    response = await fetch(
      `${API_URL}/${endpoint.replace(/^\/+/, "")}`,
      {
        ...options,
        headers,
        cache: "no-store",
      },
    );
  } catch {
    throw new LaravelApiError(
      503,
      "No se pudo conectar con el servidor Laravel.",
    );
  }

  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    let message = "Ocurrió un error al consultar la API.";

    if (data && typeof data === "object" && "message" in data) {
      const apiMessage = data.message;

      if (typeof apiMessage === "string") {
        message = apiMessage;
      }
    }

    throw new LaravelApiError(response.status, message);
  }

  return data as T;
}
    