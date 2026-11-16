
import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import Sidebar from "@/components/layout/sidebar";
import Topbar from "@/components/layout/topbar";

import {
  laravelApi,
  LaravelApiError,
} from "@/lib/laravel-api";

import type {
  CurrentUserResponse,
} from "@/types/auth";

export const dynamic = "force-dynamic";

export default async function PanelLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("mentorflow_session")?.value;

  if (!token) {
    redirect("/login");
  }

  let user;

  try {
    const response = await laravelApi<CurrentUserResponse>(
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

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      <Sidebar user={user} />

      <div className="min-h-screen md:pl-64">
        <Topbar user={user} />

        <main className="px-5 py-8 sm:px-8 lg:px-10">
          <div className="mx-auto w-full max-w-[1440px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
