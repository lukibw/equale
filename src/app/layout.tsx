import "./global.css";
import type { PropsWithChildren } from "react";
import type { Metadata } from "next";
import { Lato } from "next/font/google";

const lato = Lato({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = { title: "Equale" };

export default function Layout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body className={lato.className}>{children}</body>
    </html>
  );
}
