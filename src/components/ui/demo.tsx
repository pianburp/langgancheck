import { Component } from "@/components/ui/etheral-shadow";
import { AuthButton } from "@/components/auth/auth-button";

const DemoOne = () => {
  return (
    <main className="relative min-h-screen w-full overflow-hidden text-foreground">
      <div className="pointer-events-none absolute inset-0 z-0">
        <Component
          color="rgba(128, 128, 128, 1)"
          animation={{ scale: 100, speed: 90 }}
          noise={{ opacity: 1, scale: 1.2 }}
          sizing="stretch"
          className="h-full w-full"
        />
      </div>

      <div className="relative z-10">
        <section className="flex min-h-[70vh] items-center justify-center px-6 py-16 text-center">
          <div className="max-w-3xl rounded-2xl bg-background/35 p-8 shadow-xl backdrop-blur-sm">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
              LangganCheck
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Track every subscription before it drains your budget
            </h1>
            <p className="mt-5 text-base text-muted-foreground sm:text-lg">
              A clean monthly view of what renews, what to cancel, and where your recurring spend is growing.
            </p>
          </div>
        </section>

        <section className="flex min-h-[30vh] items-start justify-center px-6 pb-16">
          <div className="w-full max-w-xl rounded-2xl border border-border/60 bg-background/45 p-8 text-center shadow-lg backdrop-blur-sm">
            <h2 className="text-2xl font-semibold sm:text-3xl">
              Start with Google in one click
            </h2>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base">
              Import your subscriptions and review your next renewal dates from your dashboard.
            </p>
            <div className="mt-6 flex justify-center">
              <AuthButton />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export { DemoOne };
