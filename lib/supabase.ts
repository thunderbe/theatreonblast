// lib/supabase.ts
// Two clients:
// - createServerClient: for Server Components, API routes, Server Actions
// - createBrowserClient: for Client Components (search, filters, forms)

import { createServerClient as _createServerClient } from "@supabase/ssr";
import { createBrowserClient as _createBrowserClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Genre =
  | "Musical"
  | "Play / Drama"
  | "Comedy"
  | "Children's Theatre"
  | "Experimental";

export interface Venue {
  id: string;
  name: string;
  slug: string;
  address: string | null;
  city: string;
  state: string;
  neighborhood: string | null;
  website: string | null;
  bio: string | null;
  photos: string[];
  social_links: string[];
  status: "pending" | "active" | "suspended";
  created_at: string;
}

export interface Show {
  id: string;
  venue_id: string;
  genre_id: string;
  title: string;
  slug: string;
  description: string | null;
  poster_url: string | null;
  ticket_url: string | null;
  price_min: number | null;
  price_max: number | null;
  is_free: boolean;
  status: "pending" | "approved" | "published" | "archived" | "rejected";
  confidence_score: number | null;
  source: "submission" | "scraper";
  created_at: string;
  updated_at: string;
  // Joined fields
  venue?: Venue;
  genre?: { id: string; name: Genre; slug: string };
  next_date?: string | null;
  dates?: ShowDate[];
}

export interface ShowDate {
  id: string;
  show_id: string;
  starts_at: string;
  ends_at: string | null;
  is_cancelled: boolean;
}

export interface Submission {
  id: string;
  show_id: string | null;
  source_type: "submission" | "scraper";
  source_url: string | null;
  raw_data: Record<string, unknown> | null;
  confidence_score: number | null;
  status: "pending" | "approved" | "rejected";
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
}

// ─── Server client (Server Components & API routes) ───────────────────────────

export async function createServerSupabaseClient() {
  const cookieStore = await cookies();
  return _createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component — safe to ignore
          }
        },
      },
    }
  );
}

// Service role client — bypasses RLS. Use ONLY in API routes, never client-side.
export function createAdminSupabaseClient() {
  return _createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// ─── Browser client (Client Components) ───────────────────────────────────────

export function createBrowserSupabaseClient() {
  return _createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// ─── Query helpers ────────────────────────────────────────────────────────────

// Get published shows with venue + genre joined, ordered by next upcoming date
export async function getPublishedShows(options?: {
  genre?: string;
  venue_id?: string;
  limit?: number;
  from_date?: string;
  to_date?: string;
}) {
  const supabase = await createServerSupabaseClient();
  let query = supabase
    .from("shows")
    .select(`
      *,
      venue:venues(id, name, slug, city, neighborhood),
      genre:genres(id, name, slug),
      dates:show_dates(id, starts_at, ends_at, is_cancelled)
    `)
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (options?.genre) {
    const { data: genreRow } = await supabase
      .from("genres")
      .select("id")
      .eq("slug", options.genre)
      .single();
    if (genreRow) query = query.eq("genre_id", genreRow.id);
  }

  if (options?.venue_id) {
    query = query.eq("venue_id", options.venue_id);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as Show[];
}

// Get shows with dates falling within a date range (for "this weekend" filter)
export async function getShowsThisWeekend() {
  const supabase = await createServerSupabaseClient();

  // Get next Friday and Sunday
  const now = new Date();
  const day = now.getDay();
  const daysUntilFriday = (5 - day + 7) % 7 || 7;
  const friday = new Date(now);
  friday.setDate(now.getDate() + daysUntilFriday);
  friday.setHours(0, 0, 0, 0);

  const sunday = new Date(friday);
  sunday.setDate(friday.getDate() + 2);
  sunday.setHours(23, 59, 59, 999);

  const { data: dateRows, error } = await supabase
    .from("show_dates")
    .select("show_id")
    .gte("starts_at", friday.toISOString())
    .lte("starts_at", sunday.toISOString())
    .eq("is_cancelled", false);

  if (error) throw error;

  const showIds = [...new Set((dateRows ?? []).map((r) => r.show_id))];
  if (showIds.length === 0) return [];

  const { data, error: showError } = await supabase
    .from("shows")
    .select(`
      *,
      venue:venues(id, name, slug, city, neighborhood),
      genre:genres(id, name, slug),
      dates:show_dates(id, starts_at, ends_at, is_cancelled)
    `)
    .eq("status", "published")
    .in("id", showIds);

  if (showError) throw showError;
  return (data ?? []) as Show[];
}

// Get a single show by slug
export async function getShowBySlug(slug: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("shows")
    .select(`
      *,
      venue:venues(*),
      genre:genres(id, name, slug),
      dates:show_dates(id, starts_at, ends_at, is_cancelled)
    `)
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error) return null;
  return data as Show;
}

// Get active venues
export async function getActiveVenues(limit?: number) {
  const supabase = await createServerSupabaseClient();
  let query = supabase
    .from("venues")
    .select("*")
    .eq("status", "active")
    .order("name");

  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as Venue[];
}

// Get a single venue by slug
export async function getVenueBySlug(slug: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("venues")
    .select("*")
    .eq("slug", slug)
    .eq("status", "active")
    .single();

  if (error) return null;
  return data as Venue;
}

// Get pending submissions for the admin review queue
export async function getPendingSubmissions() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("submissions")
    .select(`*, show:shows(*, venue:venues(name), genre:genres(name))`)
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

// ─── Utility ──────────────────────────────────────────────────────────────────

export function formatPrice(
  min: number | null,
  max: number | null,
  is_free: boolean
): string | null {
  if (is_free) return "Free";
  if (!min) return null;
  const lo = `$${Math.round(min / 100)}`;
  const hi = max && max !== min ? `$${Math.round(max / 100)}` : null;
  return hi ? `${lo}–${hi}` : lo;
}

export function genreColors(genre: string): { bg: string; text: string } {
  const map: Record<string, { bg: string; text: string }> = {
    "Musical":            { bg: "#FAEEDA", text: "#633806" },
    "Play / Drama":       { bg: "#EEEDFE", text: "#3C3489" },
    "Comedy":             { bg: "#EAF3DE", text: "#27500A" },
    "Children's Theatre": { bg: "#E1F5EE", text: "#085041" },
    "Experimental":       { bg: "#FAECE7", text: "#712B13" },
  };
  return map[genre] ?? { bg: "#F1EFE8", text: "#444441" };
}
