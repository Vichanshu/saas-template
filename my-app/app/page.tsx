import Link from "next/link"
import { ArrowRight, CheckCircle2, ListChecks, ShieldCheck, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"

const features = [
  {
    icon: ListChecks,
    title: "Organize the day",
    description: "Capture tasks, sort priorities, and keep your next move obvious.",
  },
  {
    icon: ShieldCheck,
    title: "Private by design",
    description: "Account access is handled through the same secure auth flow.",
  },
  {
    icon: Sparkles,
    title: "Built to focus",
    description: "A clean workspace for daily planning without extra noise.",
  },
]

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050505] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.07)_1px,transparent_1px)] bg-[size:56px_56px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),transparent_34%),linear-gradient(to_bottom,rgba(5,5,5,0.15),#050505_78%)]" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-6xl flex-col">
        <header className="flex items-center justify-between border-b border-white/10 py-4">
          <Link href="/" className="text-lg font-semibold tracking-normal text-white">
            Todo Master
          </Link>
          <nav className="flex items-center gap-2">
            <Button asChild className="h-9 bg-transparent px-3 text-white hover:bg-white/10">
              <Link href="/signin">Sign in</Link>
            </Button>
            <Button asChild className="h-9 bg-white px-3 text-black hover:bg-white/88">
              <Link href="/signup">Sign up</Link>
            </Button>
          </nav>
        </header>

        <section className="grid flex-1 items-center gap-10 py-12 lg:grid-cols-[1.08fr_0.92fr] lg:py-16">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-lg border border-white/12 bg-white/[0.07] px-3 py-2 text-sm text-white/70 ring-white/15 backdrop-blur-2xl">
              <CheckCircle2 className="size-4 text-white" />
              Plan cleaner. Finish calmer.
            </div>
            <h1 className="max-w-2xl text-5xl font-semibold leading-[1.02] tracking-normal text-white sm:text-6xl lg:text-7xl">
              Todo Master
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-white/62 sm:text-lg">
              A focused task manager for turning scattered plans into a clear daily
              list. Sign in, build your workspace, and keep momentum without the clutter.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild className="h-11 bg-white px-5 text-black hover:bg-white/88">
                <Link href="/signup">
                  Create account
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                className="h-11 border border-white/12 bg-white/[0.06] px-5 text-white hover:bg-white/12"
              >
                <Link href="/signin">I already have one</Link>
              </Button>
            </div>
          </div>

          <div className="border border-white/12 bg-white/[0.07] p-4 shadow-2xl shadow-black/50 ring-1 ring-white/15 backdrop-blur-2xl">
            <div className="border-b border-white/10 px-2 pb-4">
              <p className="text-sm font-medium text-white">Today</p>
              <p className="mt-1 text-sm text-white/52">Three focused priorities</p>
            </div>
            <div className="space-y-3 py-4">
              {["Ship landing page polish", "Review auth flow", "Plan dashboard tasks"].map(
                (task, index) => (
                  <div
                    key={task}
                    className="flex items-center gap-3 border border-white/10 bg-white/[0.05] px-3 py-3"
                  >
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white text-sm font-semibold text-black">
                      {index + 1}
                    </span>
                    <span className="text-sm text-white/76">{task}</span>
                  </div>
                )
              )}
            </div>
            <div className="grid gap-3 pt-1 sm:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon

                return (
                  <div key={feature.title} className="border border-white/10 bg-white/[0.04] p-3">
                    <Icon className="size-4 text-white/72" />
                    <p className="mt-3 text-sm font-medium text-white">{feature.title}</p>
                    <p className="mt-2 text-xs leading-5 text-white/48">{feature.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
