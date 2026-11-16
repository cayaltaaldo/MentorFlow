
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import {
  laravelApi,
  LaravelApiError,
} from "@/lib/laravel-api";

import type { LoginResponse } from "@/types/auth";

const loginSchema = z.object({
  email: z.email("Ingresa un correo válido."),
  password: z.string().min(1, "Ingresa tu contraseña."),
});

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();

    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Revisa el correo y la contraseña.",
        },
        { status: 422 },
      );
    }

    const result = await laravelApi<LoginResponse>(
      "/login",
      {
        method: "POST",
        body: JSON.stringify(validation.data),
      },
    );

    if (!result.data?.token || !result.data?.user) {
      return NextResponse.json(
        {
          success: false,
          message: "Respuesta de autenticación inválida.",
        },
        { status: 502 },
      );
    }

    const response = NextResponse.json({
      success: true,
      message: "Inicio de sesión exitoso.",
      data: {
        user: result.data.user,
      },
    });

    response.cookies.set({
      name: "mentorflow_session",
      value: result.data.token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    return response;
  } catch (error) {
    if (error instanceof LaravelApiError) {
      return NextResponse.json(
        {
          success: false,
          message:
            error.status === 422
              ? "Correo o contraseña incorrectos."
              : error.message,
        },
        { status: error.status },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "No se pudo iniciar sesión.",
      },
      { status: 500 },
    );
  }
}
