import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL =
  process.env.LARAVEL_API_URL ??
  "http://127.0.0.1:8000/api";

export async function POST(request: NextRequest) {
  const token = (await cookies()).get(
    "mentorflow_session"
  )?.value;

  if (!token) {
    return NextResponse.json(
      { message: "No autenticado." },
      { status: 401 }
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "El cuerpo de la solicitud no es válido." },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(`${API_URL}/tickets`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const result: unknown = await response.json();

    return NextResponse.json(result, {
      status: response.status,
    });
  } catch {
    return NextResponse.json(
      {
        message:
          "No se pudo conectar con el servidor de Laravel.",
      },
      { status: 502 }
    );
  }
}
