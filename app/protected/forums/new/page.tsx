"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import Tiptap from "../../../../components/Tiptap";
import { createClient } from "../../../../utils/supabase/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

// Petition Form Component
function PetitionForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();

  const handleEditorContentChange = (content: string) => {
    setDescription(content);
    console.log(content);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase.schema("Forum").from("Content").insert({
      author_id: user?.id,
      description: description,
      content_type: "petition",
      title: title,
    });

    if (error) {
      console.error("Error creating petition:", error);
      return;
    }

    const element = document.getElementById(`notification`) as HTMLInputElement;

    setTimeout(() => {
      if (element) element.classList.add("opacity-0");
      router.push("/protected/forums");
    }, 1000);

    setTimeout(() => {
      if (element) element.classList.remove("opacity-0");
    }, 100);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="container mx-auto px-4 py-8 flex flex-col gap-5"
      >
        <div
          id={`notification`}
          className="opacity-0 transition-opacity fixed top-40 left-1/2 -translate-x-1/2 z-50"
        >
          <div
            className={`bg-primary text-foreground text-sm p-4 rounded-md font-light`}
          >
            Successfully Submitted Petition!
          </div>
        </div>
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Petition Title
          </label>
          <input
            placeholder="Enter Petition Title"
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-secondary rounded-md bg-background"
            required
          />
        </div>
        <div className="p-4 border bg-background md:w-full rounded-lg shadow-md border-secondary">
          <Tiptap onContentChange={handleEditorContentChange} />
        </div>
        <div className="flex justify-center">
          <Button
            type="submit"
            variant={"outline"}
            className="mt-4 w-32 p-2 bg-primary text-foreground rounded"
          >
            Post
          </Button>
        </div>
      </form>
    </>
  );
}

// Poll Creation Form Component
function PollCreationForm() {
  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState(["", ""]);

  const router = useRouter();

  const addAnswer = () => setAnswers([...answers, ""]);
  const removeAnswer = (index: number) => {
    if (answers.length > 2) {
      setAnswers(answers.filter((_, i) => i !== index));
    }
  };
  const updateAnswer = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // First, create the poll content
    const { data: pollData, error: pollError } = await supabase
      .schema("Forum")
      .from("Content")
      .insert({
        author_id: user?.id,
        description: "",
        content_type: "poll",
        title: question,
      })
      .select()
      .single();

    if (pollError) {
      console.error("Error creating poll:", pollError);
      return;
    }

    const element = document.getElementById(`notification`) as HTMLInputElement;

    setTimeout(() => {
      if (element) element.classList.add("opacity-0");
      router.push("/protected/forums");
    }, 1000);

    setTimeout(() => {
      if (element) element.classList.remove("opacity-0");
    }, 100);

    // Then, insert all poll choices
    const pollChoices = answers.map((answer) => ({
      content_id: pollData.id,
      description: answer,
    }));

    const { error: choicesError } = await supabase
      .schema("Forum")
      .from("PollChoice")
      .insert(pollChoices);

    if (choicesError) {
      console.error("Error creating poll choices:", choicesError);
      return;
    }
  };
  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="container mx-auto px-4 py-8 flex flex-col gap-5"
      >
        <div
          id={`notification`}
          className="opacity-0 transition-opacity fixed top-40 left-1/2 -translate-x-1/2 z-50"
        >
          <div
            className={`bg-primary text-foreground text-sm p-4 rounded-md font-light`}
          >
            Successfully Submitted Poll!
          </div>
        </div>
        <div className="mb-6">
          <label
            htmlFor="question"
            className="block text-sm font-medium text-foreground mb-2"
          >
            Question
          </label>
          <input
            id="question"
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="What question do you want to ask?"
            className="w-full p-2 border border-secondary bg-background rounded-md"
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-2">
            Choices
          </label>
          {answers.map((answer, index) => (
            <div key={index} className="flex mb-2">
              <div className="flex-1 flex items-center border border-secondary rounded-md overflow-hidden">
                <input
                  type="text"
                  value={answer}
                  onChange={(e) => updateAnswer(index, e.target.value)}
                  placeholder="Type a choice"
                  className="flex-1 p-2 outline-none bg-background"
                />
              </div>
              {answers.length > 2 && (
                <button
                  onClick={() => removeAnswer(index)}
                  className="ml-2 p-2 text-gray-500 hover:text-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              )}
            </div>
          ))}
          <Button
            onClick={addAnswer}
            variant={"outline"}
            className="w-full p-2 mt-2 border border-secondary rounded-md bg-primary text-foreground"
          >
            + Add another choice
          </Button>
        </div>
        <div className="flex justify-center">
          <Button
            type="submit"
            variant={"outline"}
            className="mt-4 w-32 p-2 bg-primary text-foreground rounded"
          >
            Post
          </Button>
        </div>
      </form>
    </>
  );
}

// Forum Creation Form Component
function ForumCreationForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const router = useRouter();

  const handleEditorContentChange = (content: string) => {
    setContent(content);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase.schema("Forum").from("Content").insert({
      author_id: user?.id,
      description: content,
      content_type: "forum",
      title: title,
    });

    if (error) {
      console.error("Error creating forum:", error);
      return;
    }

    const element = document.getElementById(`notification`) as HTMLInputElement;

    setTimeout(() => {
      if (element) element.classList.add("opacity-0");
      router.push("/protected/forums");
    }, 1000);

    setTimeout(() => {
      if (element) element.classList.remove("opacity-0");
    }, 100);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="container mx-auto px-4 py-8 flex flex-col gap-5"
      >
        <div
          id={`notification`}
          className="opacity-0 transition-opacity fixed top-40 left-1/2 -translate-x-1/2 z-50"
        >
          <div
            className={`bg-primary text-foreground text-sm p-4 rounded-md font-light`}
          >
            Successfully Submitted Forum!
          </div>
        </div>
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Forum Title
          </label>
          <input
            placeholder="Enter Forum Title"
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-secondary rounded-md bg-background"
            required
          />
        </div>
        <div className="p-4 border bg-background md:w-full rounded-lg shadow-md border-secondary">
          <Tiptap onContentChange={handleEditorContentChange} />
        </div>
        <div className="flex justify-center">
          <Button
            type="submit"
            variant={"outline"}
            className="mt-4 w-32 p-2 bg-primary text-foreground rounded"
          >
            Post
          </Button>
        </div>
      </form>
    </>
  );
}

// New Post Page Component
export default function NewPostPage() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const router = useRouter();
  const handleNewPost = (type: string) => {
    router.push(`/protected/forums/new?type=${type}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {type === "forum" && (
        <>
          <h1 className="mb-8 text-3xl sm:text-4xl font-bold text-foreground">
            New Forum
          </h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="default" className="flex items-center">
                Create Forum
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => handleNewPost("petition")}>
                Create Petition
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handleNewPost("poll")}>
                Create Poll
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <ForumCreationForm />
        </>
      )}
      {type === "poll" && (
        <>
          <h1 className="mb-8 text-3xl sm:text-4xl font-bold text-foreground">
            New Poll
          </h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="default" className="flex items-center">
                Create Poll
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => handleNewPost("forum")}>
                Create Forum
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handleNewPost("petition")}>
                Create Petition
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <PollCreationForm />
        </>
      )}
      {type === "petition" && (
        <>
          <h1 className="mb-8 text-3xl sm:text-4xl font-bold text-foreground">
            New Petition
          </h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="default" className="flex items-center">
                Create Petition
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => handleNewPost("forum")}>
                Create Forum
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handleNewPost("poll")}>
                Create Poll
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <PetitionForm />
        </>
      )}
    </div>
  );
}
