"use server";

import { createClient } from "@/lib/supabase/server";

export async function joinWaitlist(email: string) {
  try {
    // Validate email
    if (!email || !email.includes("@")) {
      return {
        success: false,
        error: "Please enter a valid email address",
      };
    }

    const supabase = await createClient();

    // Insert email into waitlist table
    const { data, error } = await supabase
      .from("waitlist")
      .insert([
        {
          email: email.toLowerCase().trim(),
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      // Handle duplicate email gracefully
      if (error.code === "23505") {
        return {
          success: true,
          message: "You're already on the waitlist! We'll be in touch soon.",
        };
      }

      console.error("Supabase error:", error);
      return {
        success: false,
        error: "Something went wrong. Please try again.",
      };
    }

    return {
      success: true,
      message: "🎉 You're on the list! We'll email you when we launch.",
      data,
    };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Waitlist error:", errorMessage);
    return {
      success: false,
      error: "Something went wrong. Please try again.",
    };
  }
}
