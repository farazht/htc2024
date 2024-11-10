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
import Chatbox from "@/components/Chatbox";

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
        {/* Solid Circles */}
        <div className="absolute -top-10 -left-20 w-40 h-40 bg-blue-500 opacity-5 rounded-full"></div>
        <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-green-500 opacity-5 rounded-full"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-red-500 opacity-5 rounded-full"></div>

        {/* Hollow Circles */}
        <div className="absolute top-1/2 left-10 w-24 h-24 border-4 border-yellow-400 opacity-5 rounded-full"></div>
        <div className="absolute bottom-10 left-36 w-48 h-48 border-4 border-indigo-500 opacity-5 rounded-full"></div>

        {/* Solid Triangles */}
        <div className="absolute top-1/3 right-1/4 w-0 h-0 border-l-[30px] border-l-transparent border-r-[30px] border-r-transparent border-b-[50px] border-b-purple-500 opacity-5"></div>
        <div className="absolute top-10 right-20 w-0 h-0 border-l-[40px] border-l-transparent border-r-[40px] border-r-transparent border-b-[70px] border-b-blue-500 opacity-5"></div>
        <div className="absolute bottom-10 right-1/3 w-0 h-0 border-l-[25px] border-l-transparent border-r-[25px] border-r-transparent border-b-[40px] border-b-green-500 opacity-5"></div>

        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="h-auto flex flex-col items-center">
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

              <div className="flex flex-col gap-20 max-w-5xl p-5 w-full items-center h-auto">
                {children}
              </div>

              <footer className="w-full">
                <Footer></Footer>
              </footer>
            </div>
          </main>
          <Chatbox></Chatbox>
        </ThemeProvider>
      </body>
    </html>
  );
}
