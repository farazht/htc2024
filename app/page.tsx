  import Hero from "@/components/hero";
import ConnectSupabaseSteps from "@/components/tutorial/connect-supabase-steps";
import SignUpUserSteps from "@/components/tutorial/sign-up-user-steps";
import { Button } from "@/components/ui/button";
import {MessagesSquare, Scale, BookUser} from "lucide-react"
import Link from "next/link";

export default async function Index() {
  return (
<main className="container mx-auto px-4 py-12">
        <section className="mb-16 text-center">
          <h1 className="text-5xl font-bold mb-6">Welcome to BillBoard</h1>
          <p className="text-xl mb-8">Your go-to platform for keeping up with the latest policies, starting community discussions, creating petitions, and running polls – empowering you to make a difference!</p>
        </section>

        <section className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <Scale className="mx-auto h-12 w-12 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">New and Proposed Legislation</h2>
            <p>Keep up to date with the latest policies!</p>
          </div>
          <div className="text-center">
            <MessagesSquare className="mx-auto h-12 w-12 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Discussion Board</h2>
            <p>Start discussions, create petitions, and run polls within your community and make your voice heard!</p>
          </div>
          <div className="text-center">
            <BookUser className="mx-auto h-12 w-12 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Local Representatives</h2>
            <p>Find out who your local representative at every level of government is, and how to contact them!</p>
          </div>
        </section>
        <section className="text-center mb-16">
        <h2 className="text-3xl font-bold mb-6">Join BillBoard Today</h2>
        <p className="text-xl mb-8">Be part of the change. Sign up now to start engaging with your community and making your voice heard!</p>
        <Link href="/sign-up">
          <Button size="lg" className="font-semibold">
            Sign Up
          </Button>
        </Link>
      </section>
      </main>
  );
}
