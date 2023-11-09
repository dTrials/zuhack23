"use client";
import { createClient } from "@supabase/supabase-js";

export default async function client() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY as string;
  const supabase = createClient(supabaseUrl, supabaseKey);
}
