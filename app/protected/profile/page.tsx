import React from "react";
import Image from "next/image";
import { createClient } from "@/utils/supabase/server";

const profile = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div>
      <div className="min-h-screen bg-background p-8">
        {user && (
          <h1 className="mb-8 text-4xl font-bold text-foreground">
            Hello {user.email}!
          </h1>
        )}
      </div>
    </div>
  );
};

export default profile;
