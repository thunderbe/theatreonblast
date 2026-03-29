// app/page.tsx
// Homepage — pulls live data from Supabase
// Shows "this weekend" by default, with genre filter pills

import Link from "next/link";
import { getShowsThisWeekend, getActiveVenues, formatPrice, genreColors } from "@/lib/supabase";

const GENRES = ["All genres", "Musical", "Comedy", "Play / Drama", "Experimental", "Children's Theatre"];

export default async function HomePage() {
  // Fetch in parallel
  const [shows, venues] = await Promise.all([
    getShowsThisWeekend(),
    getActiveVenues(4),
  ]);

  return (
    <main style={{ fontFamily: "'DM Sans', sans-serif", color: "#1a1a1a", maxWidth: "100%" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .tob-logo { font-family: 'Cormorant Garamond', serif; font-weight: 700; }
        .tob-heading { font-family: 'Cormorant Garamond', serif; font-weight: 700; }
        .show-card:hover { border-color: #3B6D11 !important; }
        .venue-card:hover { border-color: #3B6D11 !important; }
        .nav-link:hover { color: #1a1a1a !important; }
        @media (max-width: 600px) {
          .hero-title { font-size: 38px !important; }
          .search-wrap { flex-direction: column; }
          .submit-banner-inner { flex-direction: column; }
          .nav-links-desktop { display: none !important; }
        }
      `}</style>

      {/* Nav */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 24px", borderBottom: "0.5px solid #e5e5e5"
      }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <span className="tob-logo" style={{ fontSize: 26, color: "#3B6D11", letterSpacing: "0.5px" }}>
            TheatreOnBlast
          </span>
        </Link>
        <div className="nav-links-desktop" style={{ display: "flex", gap: 20, fontSize: 13, color: "#888" }}>
          <Link href="/shows" className="nav-link" style={{ color: "#888", textDecoration: "none" }}>Shows</Link>
          <Link href="/venues" className="nav-link" style={{ color: "#888", textDecoration: "none" }}>Venues</Link>
          <Link href="/shows?filter=weekend" className="nav-link" style={{ color: "#888", textDecoration: "none" }}>This weekend</Link>
        </div>
        <Link href="/submit">
          <button style={{
            fontSize: 12, fontWeight: 500, padding: "6px 14px", borderRadius: 20,
            background: "#3B6D11", color: "#fff", cursor: "pointer", border: "none"
          }}>
            List your show
          </button>
        </Link>
      </nav>

      {/* Hero */}
      <div style={{ padding: "48px 24px 36px", textAlign: "center" }}>
        <div style={{
          fontSize: 12, fontWeight: 500, letterSpacing: "1px", color: "#27500A",
          background: "#EAF3DE", padding: "4px 12px", borderRadius: 20,
          display: "inline-block", marginBottom: 16
        }}>
          Chicago metro theatre
        </div>
        <h1 className="tob-heading" style={{ fontSize: 52, lineHeight: 1.05, marginBottom: 12 }}>
          Find your next<br />
          <span style={{ color: "#3B6D11" }}>night out</span>
        </h1>
        <p style={{ fontSize: 15, color: "#888", marginBottom: 28 }}>
          Local theatre, musicals, comedy & more — all in one place
        </p>
        <div className="search-wrap" style={{ display: "flex", gap: 8, maxWidth: 480, margin: "0 auto" }}>
          <input
            type="text"
            placeholder="Search shows, venues, genres..."
            style={{
              flex: 1, padding: "10px 16px", borderRadius: 24,
              border: "1.5px solid #d1d1d1", fontSize: 14, outline: "none",
              fontFamily: "'DM Sans', sans-serif"
            }}
          />
          <button style={{
            padding: "10px 20px", borderRadius: 24, background: "#3B6D11",
            color: "#fff", border: "none", fontSize: 14, fontWeight: 500,
            cursor: "pointer", whiteSpace: "nowrap", fontFamily: "'DM Sans', sans-serif"
          }}>
            Search
          </button>
        </div>

        {/* Genre filter pills */}
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 16, flexWrap: "wrap" }}>
          {GENRES.map((g, i) => (
            <Link
              key={g}
              href={i === 0 ? "/shows" : `/shows?genre=${g.toLowerCase().replace(/ \/ /g, "-").replace(/ /g, "-")}`}
              style={{ textDecoration: "none" }}
            >
              <span style={{
                fontSize: 12, padding: "5px 14px", borderRadius: 20, cursor: "pointer",
                border: i === 0 ? "1px solid #3B6D11" : "0.5px solid #d1d1d1",
                background: i === 0 ? "#EAF3DE" : "#fff",
                color: i === 0 ? "#27500A" : "#888",
                display: "inline-block"
              }}>
                {g}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* What's on section */}
      <div style={{ padding: "0 24px 40px" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 16 }}>
          <h2 className="tob-heading" style={{ fontSize: 26 }}>What&apos;s on</h2>
          <Link href="/shows" style={{ fontSize: 13, color: "#3B6D11", textDecoration: "none" }}>See all →</Link>
        </div>

        {/* Weekend tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
          {[
            { label: "This weekend", href: "/shows?filter=weekend" },
            { label: "Next weekend",  href: "/shows?filter=next-weekend" },
            { label: "This month",    href: "/shows?filter=month" },
          ].map((t, i) => (
            <Link key={t.label} href={t.href} style={{ textDecoration: "none" }}>
              <span style={{
                fontSize: 13, padding: "6px 16px", borderRadius: 20, cursor: "pointer",
                border: i === 0 ? "1px solid #3B6D11" : "0.5px solid #e5e5e5",
                background: i === 0 ? "#3B6D11" : "#fff",
                color: i === 0 ? "#fff" : "#888",
                display: "inline-block"
              }}>
                {t.label}
              </span>
            </Link>
          ))}
        </div>

        {/* Show cards */}
        {shows.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "48px 24px",
            color: "#888", fontSize: 15, border: "0.5px dashed #d1d1d1",
            borderRadius: 12
          }}>
            No shows listed yet this weekend.{" "}
            <Link href="/submit" style={{ color: "#3B6D11" }}>Be the first to add one →</Link>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: 12
          }}>
            {shows.map((show) => {
              const genreName = show.genre?.name ?? "";
              const colors = genreColors(genreName);
              const price = formatPrice(show.price_min, show.price_max, show.is_free);
              return (
                <Link key={show.id} href={`/shows/${show.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <div className="show-card" style={{
                    background: "#fff", border: "0.5px solid #e5e5e5",
                    borderRadius: 12, overflow: "hidden", cursor: "pointer",
                    transition: "border-color 0.15s"
                  }}>
                    {show.poster_url ? (
                      <img
                        src={show.poster_url}
                        alt={show.title}
                        style={{ width: "100%", height: 110, objectFit: "cover" }}
                      />
                    ) : (
                      <div style={{
                        height: 110, display: "flex", alignItems: "center", justifyContent: "center",
                        background: colors.bg, color: colors.text,
                        fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 700,
                        padding: "0 12px", textAlign: "center"
                      }}>
                        {show.title}
                      </div>
                    )}
                    <div style={{ padding: "10px 12px" }}>
                      <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 3, lineHeight: 1.3 }}>
                        {show.title}
                      </div>
                      <div style={{ fontSize: 11, color: "#888", marginBottom: 6 }}>
                        {show.venue?.name}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{
                          fontSize: 10, padding: "2px 8px", borderRadius: 10,
                          background: colors.bg, color: colors.text
                        }}>
                          {genreName}
                        </span>
                        {price && (
                          <span style={{ fontSize: 11, fontWeight: 500, color: "#27500A" }}>
                            {price}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Venues section */}
      {venues.length > 0 && (
        <div style={{ padding: "0 24px 40px" }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 16 }}>
            <h2 className="tob-heading" style={{ fontSize: 26 }}>Chicago venues</h2>
            <Link href="/venues" style={{ fontSize: 13, color: "#3B6D11", textDecoration: "none" }}>See all →</Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10 }}>
            {venues.map((venue) => {
              const initials = venue.name.split(" ").map((w: string) => w[0]).slice(0, 2).join("").toUpperCase();
              return (
                <Link key={venue.id} href={`/venues/${venue.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <div className="venue-card" style={{
                    background: "#f9f9f7", borderRadius: 12, padding: 14, cursor: "pointer",
                    border: "0.5px solid #e5e5e5", transition: "border-color 0.15s"
                  }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: "50%", background: "#EAF3DE",
                      color: "#27500A", display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 13, fontWeight: 500, marginBottom: 8
                    }}>
                      {initials}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 2, lineHeight: 1.3 }}>
                      {venue.name}
                    </div>
                    <div style={{ fontSize: 11, color: "#888" }}>
                      {venue.city}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Submit banner */}
      <div style={{ margin: "0 24px 40px" }}>
        <div className="submit-banner-inner" style={{
          background: "#EAF3DE", borderRadius: 16, padding: "20px 24px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: 16, border: "0.5px solid #C0DD97"
        }}>
          <div>
            <h3 className="tob-heading" style={{ fontSize: 22, color: "#173404", marginBottom: 4 }}>
              Running a show in Chicago?
            </h3>
            <p style={{ fontSize: 13, color: "#27500A" }}>
              List it free — reach thousands of theatre fans in minutes
            </p>
          </div>
          <Link href="/submit">
            <button style={{
              background: "#3B6D11", color: "#fff", border: "none", padding: "10px 20px",
              borderRadius: 20, fontSize: 13, fontWeight: 500, cursor: "pointer",
              whiteSpace: "nowrap", fontFamily: "'DM Sans', sans-serif"
            }}>
              List your show →
            </button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        padding: "20px 24px", borderTop: "0.5px solid #e5e5e5",
        display: "flex", justifyContent: "space-between", alignItems: "center"
      }}>
        <span className="tob-logo" style={{ fontSize: 18, color: "#3B6D11" }}>TheatreOnBlast</span>
        <div style={{ display: "flex", gap: 16, fontSize: 12, color: "#888" }}>
          <Link href="/about" style={{ color: "#888", textDecoration: "none" }}>About</Link>
          <Link href="/submit" style={{ color: "#888", textDecoration: "none" }}>Submit a show</Link>
          <Link href="/contact" style={{ color: "#888", textDecoration: "none" }}>Contact</Link>
        </div>
      </footer>

    </main>
  );
}
