import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link"
import Image from 'next/image'

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const { data: test } = await supabase.from('test').select()

  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="mb-8 text-4xl font-bold text-foreground">BillBoard</h1>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Policies Section */}
        <div className="col-span-2 flex flex-col border-2 rounded-xl shadow-sm p-4">
          <div className="flex-grow">
            <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
              <Image
                src="/placeholder.svg?height=200&width=400"
                alt="Policies"
                layout="fill"
                objectFit="cover"
              />
            </div>
          </div>
          <div>
            <div className="mb-2 text-2xl font-semibold text-foreground">Policies</div>
            <p className="text-sm text-gray-600 mb-3">
              Stay informed about the latest policies and legislative updates. Access comprehensive information on current and proposed bills.
            </p>
          </div>
          <div>
            <Link href="/protected/policies" className="text-blue-600 hover:underline">
              Learn more
            </Link>
          </div>
        </div>

        {/* Forums Section */}
        <div className="flex flex-col border-2 rounded-xl shadow-sm p-4">
          <div className="flex-grow">
            <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
              <Image
                src="/placeholder.svg?height=200&width=400"
                alt="Forums"
                layout="fill"
                objectFit="cover"
              />
            </div>
          </div>
          <div>
            <div className="mb-2 text-2xl font-semibold text-foreground">Forums</div>
            <p className="text-sm text-gray-600 mb-3">
              Engage in discussions about policies and share your thoughts with the community.
            </p>
          </div>
          <div>
            <Link href="/protected/forums" className="text-blue-600 hover:underline">
              Join the conversation
            </Link>
          </div>
        </div>

        {/* Profile Section */}
        <div className="flex flex-col border-2 rounded-xl shadow-sm p-4">
          <div className="flex-grow">
            <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
              <Image
                src="/placeholder.svg?height=200&width=400"
                alt="Profile"
                layout="fill"
                objectFit="cover"
              />
            </div>
          </div>
          <div>
            <div className="mb-2 text-2xl font-semibold text-foreground">Profile</div>
            <p className="text-sm text-gray-600 mb-3">
              Manage your account settings and preferences.
            </p>
          </div>
          <div>
            <Link href="/protected/profile" className="text-blue-600 hover:underline">
              View profile
            </Link>
          </div>
        </div>

        {/* Representatives Section */}
        <div className="col-span-2 flex flex-col border-2 rounded-xl shadow-sm p-4">
          <div className="flex-grow">
            <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
              <Image
                src="/placeholder.svg?height=200&width=400"
                alt="Representatives"
                layout="fill"
                objectFit="cover"
              />
            </div>
          </div>
          <div>
            <div className="mb-2 text-2xl font-semibold text-foreground">Representatives</div>
            <p className="text-sm text-gray-600 mb-3">
              Learn about your elected officials and their voting records.
            </p>
          </div>
          <div>
            <Link href="/protected/representatives" className="text-blue-600 hover:underline">
              Meet your representatives
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}