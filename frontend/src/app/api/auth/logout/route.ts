
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { laravelApi } from "@/lib/laravel-api";

export async function POST() {
  const cookieStore = await cookies();

  const token = cookieStore.get("mentorflow_session")?.value;

  if (token) {
    try {
      await laravelApi(
        "/logout",
        { method: "POST" },
        token,
      );
    } catch {
      // La sesión local se eliminará aunque Laravel no responda.
    }
  }

  const response = NextResponse.json({
    success: true,
    message: "Sesión local cerrada.",
  });

  response.cookies.delete("mentorflow_session");

  return response;
}
