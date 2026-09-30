import Image from "next/image";

export function Header() {
  return (
    <header className="border-b border-line bg-surface/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-4 sm:px-6">
        <Image src="/logo.svg" alt="" width={36} height={36} priority />
        <div>
          <p className="text-lg font-bold leading-tight tracking-tight">
            Encaixe
          </p>
          <p className="text-xs text-muted">
            O que cabe no seu dia, decidido pelo algoritmo da mochila
          </p>
        </div>
      </div>
    </header>
  );
}
