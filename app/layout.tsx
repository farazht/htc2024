import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import "./globals.css";
import { Footer } from "@/components/Footer";
import Image from "next/image";
import Logo from "../components/Logo.png";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "BillBoard",
  description:
    "BillBoard brings local policies to you in a dedicated forum to explore, discuss, and analyze new policies in an open community. Stay informed, engage with others, and more - all for free, today.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen flex flex-col items-center">
            <div className="flex-1 w-full flex flex-col gap-2 items-center">
              <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
                <div className="bg-background w-full fixed border-b-2 border-foreground z-40">
                  <div className="p-5 px-10 m-auto max-w-7xl flex items-center justify-between text-foreground">
                    <Link href="/" className="flex items-center space-x-2">
                      <Image
                        src={Logo}
                        width={32}
                        height={32}
                        className="w-8 h-8"
                        alt="Logo"
                      />
                      <span className="text-xl font-bold">BillBoard</span>
                    </Link>
                    {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
                  </div>
                </div>
              </nav>

              <div className="flex flex-col gap-20 max-w-5xl p-5 w-full items-center min-h-screen">
                {children}
              </div>

              <footer className="w-full">
                <Footer></Footer>
              </footer>
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
