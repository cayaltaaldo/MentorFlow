"use client";

import { usePathname } from "next/navigation";
import { CircleUserRound } from "lucide-react";

import type { AuthUser } from "@/types/auth";

interface TopbarProps {
  user: AuthUser;
}

export default function Topbar({ user }: TopbarProps) {
  const pathname = usePathname();

  const title = pathname.startsWith("/tickets")
    ? "Gestión de tickets"
    : "Panel de control";

  const initials = user.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="flex min-h-[72px] items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:px-10">
        <div>
          <p className="text-xs font-medium text-slate-400">
            MentorFlow / Panel
          </p>

          <h1 className="mt-1 text-lg font-semibold text-slate-900">
            {title}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-slate-800">
              {user.name}
            </p>

            <p className="text-xs text-slate-500">
              {user.email}
            </p>
          </div>

          <div
            aria-label={`Usuario: ${user.name}`}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700"
          >
            {initials || <CircleUserRound size={20} />}
          </div>
        </div>
      </div>
    </header>
  );
}
