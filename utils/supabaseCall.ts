import { create } from "domain";
import { createClient } from "./supabase/client"
import { error } from "console";
import { Vote } from "lucide-react";


export async function RetrievePolicy() {
    const supabase = createClient(); // Initialize supabase client
    const { data, error } = await supabase
        .from('Policy') // Replace with your actual table name
        .select('*');

    if (error) {
        console.log('Error in supabaseCall retrieve policy', error);
        return []; // Return an empty array in case of error
    }
    return data || []; // Ensure it returns an array
}

export async function RetrieveSinglePolicy(id: number) {
    console.log('process prior to supabase call ', id)
    const supabase = createClient();
    const {data, error} = await supabase
    .from('Policy')
    .select("*")
    .eq("id", id)

    if (error) {
        console.log('Error in supabaseCall retrieve policy', error);
        return []; // Return an empty array in case of error
    }
    return data
}


//RATINGS AND IT WORKS
export async function InsertLikesDislikes(userID: string, feedback: number, policyId: number) {
    const supabase = createClient();

    // Await the result of checkForLikeDislike
    const deleted = await checkForLikeDislike(userID, policyId);
    // Check if a deletion occurred (deleted will be truthy if rows were deleted)
    if (deleted === null) {
        const { data, error } = await supabase
            .from('PolicyRatings')
            .insert({
                user_id: userID,
                vote: feedback,
                policy_id: policyId
            });
            if(error){
                console.log('error in insertLikesDislikes', error)
            }
        return { data, error }; // Return both data and error
    } else {
        return null; // Return null if no deletion occurred
    }
}

export async function checkForLikeDislike(userID: string, policyId: number) {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('PolicyRatings')
        .select('*')
        .eq('user_id', userID)
        .eq('policy_id', policyId)
        .single(); // Get the existing vote if it exists

    if (data) {
        // If a vote exists, delete it
        const { data: deleteData, error: deleteError } = await supabase
            .from('PolicyRatings')
            .delete()
            .eq('user_id', userID)
            .eq('policy_id', policyId);

        if (deleteError) {
            console.error('Error deleting existing vote:', deleteError);
            return null; // Return null if deletion fails
        }
        return data; // Return the existing vote data
    }

    return null; // Return null if no existing vote
}

export async function RetrievePolicyRatings(policyId: number) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('PolicyRatings')
        .select('vote') // Assuming 'vote' column has 1 for positive and -1 for negative
        .eq('policy_id', policyId);

    if (error) {
        console.log('hallo')
        console.error('Error retrieving policy ratings:', error);
        return { likes: 0, dislikes: 0 };
    }
    

    // Count positive and negative votes
    const likes = data.filter(rating => rating.vote === 1).length;
    const dislikes = data.filter(rating => rating.vote === -1).length;

    return { likes, dislikes };
}



//COmpleted

export async function RetrieveUserId(){
    const supabase = createClient();

    const {
        data: { user },
      } = await supabase.auth.getUser();

      
      return(user?.id)
      
}



//NOT DONE
export async function RetrieveComments(policyId: number) {
    const supabase = createClient();

    console.log("Entering comment retrieval function");
    const { data, error } = await supabase
        .from('comments') // Replace with your actual comments table name
        .select('*')
        .eq('policy_id', policyId); // Filter comments by policy ID

    if (error) {
        console.error('Error retrieving comments:', error);
        return []; // Return an empty array in case of error
    }
    return data || []; // Ensure it returns an array
}

export async function InsertComment(comment: { content: string; policy_id: number }) {
    const supabase = createClient();

    console.log("Inserting new comment:", comment);
    const { data, error } = await supabase
        .from('comments') // Replace with your actual comments table name
        .insert([comment]); // Insert the new comment

    if (error) {
        console.error('Error adding comment:', error);
        return { data: null, error }; // Return the error if it occurs
    }
    return { data, error: null }; // Return the inserted comment data
}

// New function to check if an address exists
export const checkAddressExists = async (userId: string, supabase: any) => {
  const { data: existingAddress, error: addressError } = await supabase
    .from('address')
    .select('*')
    .eq('id', userId)
    .single(); // This will throw an error if no rows are found

  if (addressError) {
    if (addressError.code === 'PGRST116') {
      // No rows found, treat as address does not exist
      return { exists: false, error: null }; // No error, address does not exist
    }
    console.error('Error checking address:', addressError);
    return { exists: false, error: addressError }; // Return other errors
  }

  return { exists: !!existingAddress, error: null }; // Return existence status
}
function single() {
    throw new Error("Function not implemented.");
}

