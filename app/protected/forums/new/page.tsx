"use client"

import { useSearchParams } from 'next/navigation';

export default function NewPostPage() {
  const searchParams = useSearchParams();
  const type = searchParams.get('type');

  return (
    <div>
      <h1>Create a New {type}</h1>

    </div>
  );
}
