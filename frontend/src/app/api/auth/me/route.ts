
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  laravelApi,
  LaravelApiError,
} from "@/lib/laravel-api";

import type { CurrentUserResponse } from "@/types/auth";

export async function GET() {
  const cookieStore = await cookies();

  const token = cookieStore.get("mentorflow_session")?.value;

  if (!token) {
    return NextResponse.json(
      {
        success: false,
        message: "No has iniciado sesión.",
      },
      { status: 401 },
    );
  }

  try {
    const result = await laravelApi<CurrentUserResponse>(
      "/user",
      { method: "GET" },
      token,
    );

    return NextResponse.json(result);
  } catch (error) {
    const status =
      error instanceof LaravelApiError ? error.status : 500;

    const response = NextResponse.json(
      {
        success: false,
        message:
          error instanceof LaravelApiError
            ? error.message
            : "No se pudo consultar el usuario.",
      },
      { status },
    );

    if (status === 401) {
      response.cookies.delete("mentorflow_session");
    }

    return response;
  }
}
