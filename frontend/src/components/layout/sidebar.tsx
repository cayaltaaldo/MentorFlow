"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  GraduationCap,
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
        throw new Error("No se pudo cerrar la sesión.");
      }

      setIsOpen(false);
      router.replace("/login");
      router.refresh();
    } catch {
      setError(
        "No se pudo cerrar la sesión. Inténtalo nuevamente."
      );
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <>
      {/* Barra superior para celulares */}
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 md:hidden">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-blue-600" />

          <span className="text-lg font-bold text-slate-900">
            MentorFlow
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Abrir menú"
          className="rounded-lg p-2 text-slate-700 hover:bg-slate-100"
        >
          <Menu size={22} />
        </button>
      </header>

      {/* Fondo oscuro del menú móvil */}
      {isOpen && (
        <button
          type="button"
          aria-label="Cerrar menú lateral"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
        />
      )}

      {/* Menú lateral */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-64 flex-col
          border-r border-slate-200 bg-white
          transition-transform duration-200
          md:translate-x-0
          ${
            isOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* Logo */}
        <div className="flex h-20 items-center justify-between border-b border-slate-100 px-6">
          <Link
            href="/dashboard"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3"
          >
            <div className="rounded-xl bg-blue-600 p-2 text-white">
              <GraduationCap size={22} />
            </div>

            <div>
              <p className="text-lg font-bold text-slate-900">
                MentorFlow
              </p>

              <p className="text-xs text-slate-500">
                Gestión de incidencias
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Cerrar menú"
            className="text-slate-600 md:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navegación */}
        <nav className="flex-1 space-y-1 px-4 py-6">
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
                aria-current={
                  isActive ? "page" : undefined
                }
                className={`
                  flex items-center gap-3 rounded-xl
                  px-4 py-3 text-sm font-medium
                  transition-colors
                  ${
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }
                `}
              >
                <Icon size={19} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Usuario y cierre de sesión */}
        <div className="border-t border-slate-200 p-4">
          <div className="mb-4 rounded-xl bg-slate-50 p-3">
            <p className="truncate text-sm font-semibold text-slate-900">
              {user.name}
            </p>

            <p className="truncate text-xs text-slate-500">
              {user.email}
            </p>
          </div>

          {error && (
            <p
              role="alert"
              className="mb-3 text-xs text-red-600"
            >
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <LogOut size={19} />

            {isLoggingOut
              ? "Cerrando sesión..."
              : "Cerrar sesión"}
          </button>
        </div>
      </aside>
    </>
  );
}
