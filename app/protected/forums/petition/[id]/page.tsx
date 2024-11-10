"use client";

import { useState, useEffect } from "react";
import { ArrowBigUp, ArrowBigDown } from "lucide-react";
import { createClient } from "../../../../../utils/supabase/client";
import CommentSection from "@/components/CommentSection";

// Initialize Supabase client
const supabase = createClient();

type ForumPost = {
  id: number;
  title: string;
  description: string;
  author_id: string;
  rating: number;
  timestamp: Date;
  content_type: string;
  upvotes: number;
  downvotes: number;
};

type Signature = {
  firstName: string;
  lastName: string;
  email: string;
};

export default function PetitionView() {
  const [petition, setPetition] = useState<ForumPost | null>(null);
  const [userVote, setUserVote] = useState<"up" | "down" | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [signatures, setSignatures] = useState<Signature[]>([]);

  useEffect(() => {
    // Fetch petition and voting information on component mount
    const fetchPetitionData = async () => {
      try {
        const { data, error } = await supabase
          .schema("Forum")
          .from("Content")
          .select(
            `
            id,
            title,
            description,
            author_id,
            content_type,
            created_at,
            ContentVotes (
              vote
            )
          `
          )
          .eq("id", 1) // Fetch petition with a known ID (or replace 1 with a dynamic value as needed)
          .single();

        if (error) {
          console.error("Error fetching petition data:", error);
          return;
        }

        if (data) {
          // Calculate upvotes and downvotes from ContentVotes
          const { upvotes, downvotes } = data.ContentVotes?.reduce(
            (acc, vote) => {
              if (vote.vote === true) acc.upvotes++;
              else if (vote.vote === false) acc.downvotes++;
              return acc;
            },
            { upvotes: 0, downvotes: 0 }
          ) || { upvotes: 0, downvotes: 0 };

          // Set petition data to match ForumPost type
          const formattedPetition: ForumPost = {
            id: data.id,
            title: data.title,
            description: data.description,
            author_id: data.author_id || "Anonymous",
            rating: upvotes - downvotes,
            timestamp: new Date(data.created_at),
            content_type: data.content_type,
            upvotes,
            downvotes,
          };

          setPetition(formattedPetition);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };

    fetchPetitionData();
  }, []);

  useEffect(() => {
    const fetchSignatures = async () => {
      if (!petition) return; // Only fetch signatures if petition data is available

      try {
        const { data, error } = await supabase
          .schema("Forum")
          .from("Signatures")
          .select("f_name, l_name")
          .eq("petition_id", petition.id); // Use the actual petition ID

        if (error) {
          console.error("Error fetching signatures: ", error);
          return;
        }

        // Map data to create an array of objects with firstName and lastName keys
        const formattedSignatures = data.map((sig) => ({
          firstName: sig.f_name,
          lastName: sig.l_name,
          email: `${sig.f_name.toLowerCase()}.${sig.l_name.toLowerCase()}@example.com`, // Mock email format
        }));

        setSignatures(formattedSignatures);
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };

    fetchSignatures();
  }, [petition]); // Run fetchSignatures only when petition is set

  const handleVote = async (voteType: "up" | "down") => {
    if (!petition) return;

    const voteValue = voteType === "up";

    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.error("User not authenticated.");
      return;
    }

    // Check if the user has already voted on this content
    const { data: existingVote, error: fetchError } = await supabase
      .schema("Forum")
      .from("ContentVotes")
      .select("*")
      .eq("user_id", user.id)
      .eq("content_id", petition.id)
      .maybeSingle();

    if (fetchError) {
      console.error("Error fetching existing vote:", fetchError);
      return;
    }

    if (existingVote) {
      if (existingVote.vote === voteValue) {
        // Undo the vote
        const { error: deleteError } = await supabase
          .schema("Forum")
          .from("ContentVotes")
          .delete()
          .eq("id", existingVote.id);

        if (deleteError) {
          console.error("Error deleting vote:", deleteError);
          return;
        }

        setPetition((prevPetition) => {
          if (!prevPetition) return null;
          const updatedPetition = { ...prevPetition };
          updatedPetition[voteType === "up" ? "upvotes" : "downvotes"]--;
          return updatedPetition;
        });

        setUserVote(null);
      } else {
        // Update the vote to the opposite type
        const { error: updateError } = await supabase
          .schema("Forum")
          .from("ContentVotes")
          .update({ vote: voteValue })
          .eq("id", existingVote.id);

        if (updateError) {
          console.error("Error updating vote:", updateError);
          return;
        }

        setPetition((prevPetition) => {
          if (!prevPetition) return null;
          const updatedPetition = { ...prevPetition };
          updatedPetition[voteType === "up" ? "upvotes" : "downvotes"]++;
          updatedPetition[userVote === "up" ? "upvotes" : "downvotes"]--;
          return updatedPetition;
        });

        setUserVote(voteType);
      }
    } else {
      // Insert a new vote
      const { error: insertError } = await supabase
        .schema("Forum")
        .from("ContentVotes")
        .insert({
          content_id: petition.id,
          user_id: user.id,
          vote: voteValue,
        });

      if (insertError) {
        console.error("Error inserting vote:", insertError);
        return;
      }

      setPetition((prevPetition) => {
        if (!prevPetition) return null;
        const updatedPetition = { ...prevPetition };
        updatedPetition[voteType === "up" ? "upvotes" : "downvotes"]++;
        return updatedPetition;
      });

      setUserVote(voteType);
    }
  };

  const formatDate = (timestamp: Date | undefined) => {
    if (!timestamp) return "Invalid date";
    const date = new Date(timestamp);
    return (
      date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }) +
      " at " +
      date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    );
  };

  const handleSign = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (firstName && lastName && petition) {
      // Ensure petition data is available
      try {
        // Get the current user
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          console.error("User not authenticated.");
          alert("Please sign in to add your signature.");
          return;
        }

        // Create the new signature object
        const newSignature = {
          f_name: firstName,
          l_name: lastName,
          petition_id: petition.id, // Assuming petition ID is the content_id
          user_id: user.id,
        };

        // Insert the new signature into the database
        const { error } = await supabase
          .schema("Forum")
          .from("Signatures")
          .insert(newSignature);

        if (error) {
          console.error("Error inserting signature:", error);
          alert("There was an error signing the petition. Please try again.");
          return;
        }

        // Update local state
        setSignatures([
          ...signatures,
          {
            firstName,
            lastName,
            email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
          },
        ]);

        // Reset input fields
        setFirstName("");
        setLastName("");
        alert("Thank you for signing the petition!");
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-start space-x-4">
          <div className="flex flex-col items-center space-y-2">
            <button
              onClick={() => handleVote("up")}
              className={`p-1 rounded ${userVote === "up" ? "text-orange-500" : "text-gray-500 hover:text-gray-700"}`}
              aria-label="Upvote"
            >
              <ArrowBigUp className="w-6 h-6" />
            </button>
            <span className="font-bold">
              {(petition?.upvotes || 0) - (petition?.downvotes || 0)}
            </span>
            <button
              onClick={() => handleVote("down")}
              className={`p-1 rounded ${userVote === "down" ? "text-blue-500" : "text-gray-500 hover:text-gray-700"}`}
              aria-label="Downvote"
            >
              <ArrowBigDown className="w-6 h-6" />
            </button>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2">{petition?.title}</h1>
            <div className="text-sm text-secondary mb-4">
              Started on{" "}
              {petition?.timestamp
                ? formatDate(petition.timestamp)
                : "Unknown date"}
            </div>
            <div
              className="prose max-w-none mb-6"
              dangerouslySetInnerHTML={{ __html: petition?.description || "" }}
            />
            <div>
              <div className="bg-background p-4 rounded-lg mb-6">
                <h2 className="text-lg font-semibold mb-2">
                  Sign this petition
                </h2>
                <form onSubmit={handleSign} className="space-y-4">
                  <div className="flex space-x-4">
                    <input
                      type="text"
                      placeholder="First Name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="flex-1 p-2 border border-secondary rounded"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Last Name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="flex-1 p-2 border border-secondary rounded"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-primary text-background py-2 px-4 rounded hover:bg-blue-600 transition-colors"
                  >
                    Sign the Petition
                  </button>
                </form>
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">
                    Recent Signatures
                  </h3>
                  <ul className="space-y-2">
                    {signatures.map((signer, index) => (
                      <li key={index} className="text-sm text-secondary">
                        {signer.firstName} {signer.lastName}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="mt-8 space-y-4">
              <CommentSection content_id={petition?.id ?? 0} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
