
import LoginForm from "@/features/auth/login-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-700 text-xl font-bold text-white">
            M
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            MentorFlow
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Sistema de gestión de incidencias
          </p>
        </div>

        <h2 className="mb-5 text-lg font-semibold text-slate-800">
          Iniciar sesión
        </h2>

        <LoginForm />

        <p className="mt-8 text-center text-xs text-slate-400">
          MentorFlow · Plataforma de soporte académico
        </p>
      </div>
    </main>
  );
}
