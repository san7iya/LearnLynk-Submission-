import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
    try {
        if (req.method !== "POST") {
            return new Response(JSON.stringify({error: "Method not allowed"}), {
                status: 405,
            });
        }
        const body = await req.json();
        const { application_id, task_type, due_at } = body;
        
        if (!application_id || !task_type || !due_at) {
            return new Response(JSON.stringify({ error: "Missing required fields" }), {
                status: 400,
            });
        }

        const allowedTypes = ["call", "email", "review"];
        if (!allowedTypes.includes(task_type)) {
            return new Response(
                JSON.stringify({ error: "Invalid task_type" }),
                { status: 400 }
            );
        }

        const dueDate = new Date(due_at);
        if (isNaN(dueDate.getTime())) {
            return new Response(
                JSON.stringify({ error: "Invalid due_at format" }),
                { status: 400 }
            );
        }

        if (dueDate <= new Date()) {
            return new Response(
                JSON.stringify({ error: "due_at must be in the future" }),
                { status: 400 }
            );
        }

        const supabase = createClient(
            Deno.env.get("SUPABASE_URL")!,
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
        );

        const { data, error } = await supabase
        .from("tasks")
        .insert({
            application_id,
            type: task_type,
            due_at,
            status: "pending",
        })
        .select()
        .single();

        if (error) {
            return new Response(JSON.stringify({ error: error.message }), { status: 500 });
        }

        return new Response(
            JSON.stringify({
                success: true,
                task_id: data.id,
            }),
            { status: 200 }
        );
    } catch(err) {
        return new Response(
            JSON.stringify({
            error: "Internal server error",
            }),
            { status: 500 }
        );
    }
});