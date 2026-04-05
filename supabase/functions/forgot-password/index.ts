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
    const { email } = await req.json();
    console.log('Received forgot password request:', { email });

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Supabase client with service role
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    console.log('Checking if user is admin...');
    // Check if user is an admin
    const { data: adminProfile, error: adminError } = await supabase
      .from("admin_profiles")
      .select("id, role, full_name, email")
      .eq("email", email)
      .single();

    console.log('Admin profile lookup result:', { adminProfile, adminError: adminError?.message });

    if (adminError || !adminProfile) {
      console.log('User not found in admin profiles');
      return new Response(
        JSON.stringify({ error: "Email not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log('User role:', adminProfile.role);
    console.log('User ID:', adminProfile.id);

    if (adminProfile.role === 'viewer') {
      console.log('Viewer account detected - creating password reset request');
      
      // Create password reset request
      const { data: resetRequest, error: resetError } = await supabase
        .from('password_reset_requests')
        .insert({
          viewer_id: adminProfile.id,
          viewer_name: adminProfile.full_name,
          viewer_email: adminProfile.email
        })
        .select()
        .single();

      console.log('Reset request result:', { resetRequest, resetError: resetError?.message });

      if (resetError) {
        console.log('Failed to create password reset request:', resetError);
        return new Response(
          JSON.stringify({ error: `Database error: ${resetError.message}` }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.log('Password reset request created:', resetRequest);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: `Password reset request created for ${adminProfile.full_name}. The superadmin has been notified and will set a new password for you.`,
          requiresApproval: true,
          viewerName: adminProfile.full_name
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else {
      console.log('Superadmin account detected - sending reset link');
      
      // For superadmin, we can send a regular password reset email
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email);

      if (resetError) {
        console.log('Password reset error:', resetError);
        return new Response(
          JSON.stringify({ error: resetError.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Password reset link sent to your email",
          requiresApproval: false
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

  } catch (error: any) {
    console.log('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
