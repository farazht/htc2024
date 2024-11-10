import { createClient } from "./supabase/client"

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



