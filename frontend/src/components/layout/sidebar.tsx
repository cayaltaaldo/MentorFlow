"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  Layers3,
  LayoutDashboard,
  Ticket,
  LogOut,
  Menu,
  X,
} from "lucide-react";

import type { AuthUser } from "@/types/auth";

interface SidebarProps {
  user: AuthUser;
}

const navigation = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Tickets",
    href: "/tickets",
    icon: Ticket,
  },
];

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [error, setError] = useState("");

  async function handleLogout() {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    setError("");

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("No se pudo cerrar sesión");
      }

      setIsOpen(false);
      router.replace("/login");
      router.refresh();
    } catch {
      setError("No se pudo cerrar la sesión.");
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <>
      <div className="flex items-center justify-between bg-[#14243a] px-5 py-4 text-white md:hidden">
        <div className="flex items-center gap-2">
          <Layers3 size={23} className="text-blue-400" />
          <span className="text-lg font-bold">MentorFlow</span>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Abrir menú"
          aria-expanded={isOpen}
          className="rounded-lg p-2 hover:bg-white/10"
        >
          <Menu size={22} />
        </button>
      </div>

      {isOpen && (
        <button
          type="button"
          aria-label="Cerrar menú lateral"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex w-64 flex-col
          bg-[#14243a] text-white
          transition-transform duration-200
          md:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
          <Link
            href="/dashboard"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3"
          >
            <div className="rounded-xl bg-blue-500/20 p-2.5">
              <Layers3 size={23} className="text-blue-400" />
            </div>

            <div>
              <p className="text-lg font-bold">MentorFlow</p>
              <p className="text-xs text-slate-400">
                Gestión de incidencias
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Cerrar menú"
            className="md:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-5 pb-3 pt-7">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Principal
          </p>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {navigation.map((item) => {
            const Icon = item.icon;

            const isActive =
              pathname === item.href ||
              pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                aria-current={isActive ? "page" : undefined}
                className={`
                  flex items-center gap-3 rounded-xl px-4 py-3
                  text-sm font-medium transition-colors
                  ${
                    isActive
                      ? "bg-blue-500/20 text-white"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }
                `}
              >
                <Icon
                  size={19}
                  className={
                    isActive ? "text-blue-400" : "text-slate-400"
                  }
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="mb-3 rounded-xl bg-white/5 p-3">
            <p className="truncate text-sm font-semibold text-white">
              {user.name}
            </p>
            <p className="truncate text-xs text-slate-400">
              {user.email}
            </p>
          </div>

          {error && (
            <p role="alert" className="mb-3 text-xs text-red-300">
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-50"
          >
            <LogOut size={19} />
            {isLoggingOut ? "Cerrando sesión..." : "Cerrar sesión"}
          </button>
        </div>
      </aside>
    </>
  );
}
