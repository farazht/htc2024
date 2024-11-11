"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { RetrievePolicy } from "../../../utils/supabaseCall";

interface Policy {
  id: number;
  title: string;
  summary: string;
  imageUrl: string;
  level: string;
  tags: string[];
  level_of_government: string[];
}

export default function Policies() {
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [policies, setPolicies] = useState<Policy[]>([]);

  const filteredPolicies = policies.filter(
    (policy) =>
      (searchTerm === "" ||
        policy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        policy.summary.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedTopic === null || policy.tags.includes(selectedTopic)) &&
      (selectedLevel === null ||
        (policy.level_of_government &&
          policy.level_of_government.includes(selectedLevel)))
  );

  useEffect(() => {
    const fetchPolicies = async () => {
      console.log("prior to call");
      const retrievedPolicies = await RetrievePolicy();
      console.log("after call", retrievedPolicies);
      setPolicies(retrievedPolicies);
    };
    fetchPolicies();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl sm:text-4xl font-bold text-foreground">
        Our Policies
      </h1>

      <div className="mb-8 space-y-4">
        <Input
          type="text"
          placeholder="Search policies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full transition-shadow duration-300 hover:shadow-lg focus:shadow-xl"
        />

        {/* Tags Filter */}
        <div className="flex flex-wrap gap-2 flex-col">
          <span>Filter by Topic</span>
          <div className="flex flex-row gap-3 flex-wrap">
            <Button
              onClick={() => setSelectedTopic(null)}
              variant={selectedTopic === null ? "default" : "outline"}
              className="transition-transform duration-300 transform hover:scale-105 text-secondary-foreground border-2 border-solid border-muted"
            >
              All Topics
            </Button>
            {Array.from(new Set(policies.flatMap((policy) => policy.tags))).map(
              (tag, index) => (
                <Button
                  key={tag + index}
                  onClick={() => setSelectedTopic(tag)}
                  variant={selectedTopic === tag ? "default" : "outline"}
                  className="transition-transform duration-300 transform hover:scale-105 text-secondary-foreground border-2 border-solid border-muted"
                >
                  {tag}
                </Button>
              )
            )}
          </div>
        </div>

        {/* Levels Filter */}
        <div className="flex flex-wrap gap-2 flex-col">
          <span>Filter by Levels of Government</span>
          <div className="flex flex-row gap-3">
            <Button
              className="w-fit transition-transform duration-300 transform hover:scale-105 text-secondary-foreground border-2 border-solid border-muted"
              onClick={() => setSelectedLevel(null)}
              variant={selectedLevel === null ? "default" : "outline"}
            >
              All Levels
            </Button>
            {["Local", "Provincial", "Federal"].map((level, index) => (
              <Button
                className="w-fit transition-transform duration-300 transform hover:scale-105 text-secondary-foreground border-2 border-solid border-muted"
                key={level + index}
                onClick={() => setSelectedLevel(level)}
                variant={selectedLevel === level ? "default" : "outline"}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredPolicies.length == 0 ? (
          <span className="text-xl">No Results</span>
        ) : null}

        {filteredPolicies.map((policy) => (
          <div
            key={policy.id}
            className="hover:scale-[1.02] h-full flex gap-8 duration-300 ease-in-out transition-transform"
          >
            <div
              className="bg-card rounded-lg shadow-md dark:shadow-sm dark:shadow-gray-700 overflow-hidden cursor-pointer transition-transform duration-300 ease-in-out p-5 slide-up"
              onClick={() =>
                router.push(`/protected/policies/policy/${policy.id}`)
              }
            >
              <div className="p-4 flex flex-col h-full gap-5 ">
                <h2 className="text-xl font-semibold mb-2">{policy.title}</h2>
                <p className="text-secondary mb-2">{policy.summary}</p>

                <div className="mt-auto">
                  <span className="bg-blue-100 text-primary text-xs font-medium px-2.5 py-0.5 rounded">
                    {policy.level_of_government}
                  </span>

                  <div className="flex flex-wrap gap-2 mt-2">
                    {policy.tags.map((tag, index) => (
                      <span
                        key={tag + index}
                        className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded transition-opacity duration-300 hover:opacity-80"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
