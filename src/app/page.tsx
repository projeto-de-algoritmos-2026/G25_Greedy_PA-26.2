import { Header } from "@/components/Header";
import { Planner } from "@/components/Planner";

export default function Home() {
  return (
    <>
      <Header />
      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6">
        <div className="max-w-2xl">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Seu dia é uma mochila.
          </h1>
          <p className="mt-2 text-muted">
            Diga quanto tempo você tem, liste o que precisa fazer e veja o
            algoritmo do Knapsack escolher, passo a passo, o que cabe.
          </p>
        </div>
        <Planner />
      </main>
    </>
  );
}
