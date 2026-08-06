export default function Page() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6 text-neutral-400">
      <div className="flex w-full max-w-md flex-col items-start gap-8">
        <svg
          fill="currentColor"
          viewBox="0 0 147 70"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className="size-10 text-white"
        >
          <path d="M56 50.2031V14H70V60.1562C70 65.5928 65.5928 70 60.1562 70C57.5605 70 54.9982 68.9992 53.1562 67.1573L0 14H19.7969L56 50.2031Z" />
          <path d="M147 56H133V23.9531L100.953 56H133V70H96.6875C85.8144 70 77 61.1856 77 50.3125V14H91V46.1562L123.156 14H91V0H127.312C138.186 0 147 8.81439 147 19.6875V56Z" />
        </svg>

        <div className="space-y-3">
          <h1 className="text-balance text-2xl font-semibold tracking-tight text-white">
            To get started, describe what you want to build.
          </h1>
          <p className="text-pretty text-sm leading-relaxed text-neutral-500">
            This is the default page for a fresh v0 project. Open the prompt and
            tell v0 what to create, or browse the{' '}
            <a
              href="https://v0.app/templates"
              target="_blank"
              rel="noreferrer"
              className="text-neutral-300 underline underline-offset-4 hover:text-white"
            >
              Community
            </a>{' '}
            for inspiration.
          </p>
        </div>
      </div>
    </main>
  )
}
