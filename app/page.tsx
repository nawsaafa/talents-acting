export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-col items-center gap-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-black dark:text-white">
          Talents Acting
        </h1>
        <p className="max-w-md text-lg text-zinc-600 dark:text-zinc-400">
          Talent management platform for actors, comedians, and performers
        </p>
        <div className="flex gap-4">
          <a
            href="/api/health"
            className="rounded-full border border-zinc-300 px-6 py-2 text-sm font-medium transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
          >
            Health Check
          </a>
        </div>
      </main>
    </div>
  );
}
