import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_right,_#99f6e4,_transparent_40%),radial-gradient(circle_at_bottom_left,_#fde68a,_transparent_35%)] px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <header className="rounded-3xl border bg-white/90 p-8 shadow-sm backdrop-blur">
          <p className="inline-block rounded-full bg-teal-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-teal-700">
            Malaysian Subscription + BNPL Planner
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
            GajiGuard keeps your monthly deductions visible.
          </h1>
          <p className="mt-4 max-w-2xl text-slate-700">
            Track Netflix, Spotify, Atome, and any installment in one calendar so salary day is predictable.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/signup" className="rounded-xl bg-teal-700 px-5 py-3 font-semibold text-white">
              Create account
            </Link>
            <Link href="/login" className="rounded-xl border px-5 py-3 font-semibold text-slate-900">
              Log in
            </Link>
          </div>
        </header>
      </div>
    </main>
  );
}
