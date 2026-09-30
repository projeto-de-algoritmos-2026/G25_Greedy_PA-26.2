import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Encaixe | Planeje seu dia com Knapsack",
  description:
    "Escolha um dia, liste suas tarefas e veja o algoritmo da mochila decidir o que cabe no seu tempo.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={jakarta.variable}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
