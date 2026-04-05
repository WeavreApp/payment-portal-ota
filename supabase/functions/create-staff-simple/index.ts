import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { full_name, email, password } = await req.json();
    console.log('Received request:', { full_name, email });

    if (!full_name || !email || !password) {
      console.log('Missing fields:', { full_name: !!full_name, email: !!email, password: !!password });
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log('Creating Supabase client...');
    // Create Supabase client with service role
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    console.log('Creating auth user...');
    // Step 1: Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name }
    });

    console.log('Auth result:', { authError: authError?.message, userId: authData?.user?.id });

    if (authError) {
      console.log('Auth error:', authError);
      return new Response(
        JSON.stringify({ error: authError.message }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!authData.user?.id) {
      console.log('No user ID returned');
      return new Response(
        JSON.stringify({ error: "Failed to create user" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log('Creating admin profile...');
    // Step 2: Create admin profile
    const { error: profileError } = await supabase
      .from("admin_profiles")
      .insert({
        id: authData.user.id,
        full_name,
        email,
        role: "viewer"
      });

    console.log('Profile result:', { profileError: profileError?.message });

    if (profileError) {
      console.log('Profile error:', profileError);
      return new Response(
        JSON.stringify({ error: profileError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log('Staff created successfully!');
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Staff account created for ${full_name}`,
        user: { id: authData.user.id, email, full_name }
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
