import { create } from "domain";
import { createClient } from "./supabase/client"
import { error } from "console";
import { Vote } from "lucide-react";


export async function RetrievePolicy() {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('Policy')
        .select('*');

    if (error) {
        console.log('Error in supabaseCall retrieve policy', error);
        return [];
    }
    return data || [];
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
        return [];
    }
    return data
}


//RATINGS AND IT WORKS
export async function InsertLikesDislikes(userID: string, feedback: number, policyId: number) {
    const supabase = createClient();

    const deleted = await checkForLikeDislike(userID, policyId);

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
        return { data, error };
    } else {
        return null;
    }
}

export async function checkForLikeDislike(userID: string, policyId: number) {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('PolicyRatings')
        .select('*')
        .eq('user_id', userID)
        .eq('policy_id', policyId)
        .single();

    if (data) {
        const { data: deleteData, error: deleteError } = await supabase
            .from('PolicyRatings')
            .delete()
            .eq('user_id', userID)
            .eq('policy_id', policyId);

        if (deleteError) {
            console.error('Error deleting existing vote:', deleteError);
            return null;
        }
        return data;
    }

    return null;
}

export async function RetrievePolicyRatings(policyId: number) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('PolicyRatings')
        .select('vote')
        .eq('policy_id', policyId);

    if (error) {
        console.log('hallo')
        console.error('Error retrieving policy ratings:', error);
        return { likes: 0, dislikes: 0 };
    }
    
    const likes = data.filter(rating => rating.vote === 1).length;
    const dislikes = data.filter(rating => rating.vote === -1).length;

    return { likes, dislikes };
}

// completed
export async function RetrieveUserId(){
    const supabase = createClient();

    const {
        data: { user },
      } = await supabase.auth.getUser();

      
      return(user?.id)
      
}

// not done (??)
export async function RetrieveComments(policyId: number) {
    const supabase = createClient();

    console.log("Entering comment retrieval function");
    const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('policy_id', policyId);

    if (error) {
        console.error('Error retrieving comments:', error);
        return [];
    }
    return data || [];
}

export async function InsertComment(comment: { content: string; policy_id: number }) {
    const supabase = createClient();

    console.log("Inserting new comment:", comment);
    const { data, error } = await supabase
        .from('comments')
        .insert([comment]);

    if (error) {
        console.error('Error adding comment:', error);
        return { data: null, error };
    }
    return { data, error: null };
}

// new function to check if an address exists
export const checkAddressExists = async (userId: string, supabase: any) => {
  const { data: existingAddress, error: addressError } = await supabase
    .from('address')
    .select('*')
    .eq('id', userId)
    .single();

  if (addressError) {
    if (addressError.code === 'PGRST116') {
     
      return { exists: false, error: null };
    }
    console.error('Error checking address:', addressError);
    return { exists: false, error: addressError };
  }

  return { exists: !!existingAddress, error: null };
}
function single() {
    throw new Error("Function not implemented.");
}

