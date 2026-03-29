import Link from "next/link";

// Temporary placeholder data — replace with Supabase queries once connected
const SHOWS = [
  {
    id: "1",
    title: "Chicago",
    slug: "chicago",
    venue: "Steppenwolf Theatre",
    genre: "Musical",
    price_min: 3500,
    price_max: 8500,
    is_free: false,
    poster_color: "#FBEAF0",
    poster_text_color: "#72243E",
    genre_bg: "#FAEEDA",
    genre_color: "#633806",
  },
  {
    id: "2",
    title: "The Nap",
    slug: "the-nap",
    venue: "Goodman Theatre",
    genre: "Comedy",
    price_min: 2000,
    price_max: 6000,
    is_free: false,
    poster_color: "#EAF3DE",
    poster_text_color: "#27500A",
    genre_bg: "#EAF3DE",
    genre_color: "#27500A",
  },
  {
    id: "3",
    title: "Hamlet",
    slug: "hamlet",
    venue: "Chicago Shakespeare",
    genre: "Play / Drama",
    price_min: 4800,
    price_max: 9500,
    is_free: false,
    poster_color: "#EEEDFE",
    poster_text_color: "#3C3489",
    genre_bg: "#EEEDFE",
    genre_color: "#3C3489",
  },
  {
    id: "4",
    title: "Frog & Toad",
    slug: "frog-and-toad",
    venue: "Emerald City Theatre",
    genre: "Children's Theatre",
    price_min: null,
    price_max: null,
    is_free: true,
    poster_color: "#E1F5EE",
    poster_text_color: "#085041",
    genre_bg: "#EAF3DE",
    genre_color: "#27500A",
  },
  {
    id: "5",
    title: "BLASTOFF",
    slug: "blastoff",
    venue: "The Neo-Futurists",
    genre: "Experimental",
    price_min: 1500,
    price_max: 1500,
    is_free: false,
    poster_color: "#FAECE7",
    poster_text_color: "#712B13",
    genre_bg: "#FAECE7",
    genre_color: "#712B13",
  },
  {
    id: "6",
    title: "The Main Stage Show",
    slug: "main-stage-show",
    venue: "The Second City",
    genre: "Comedy",
    price_min: 2800,
    price_max: 5500,
    is_free: false,
    poster_color: "#E6F1FB",
    poster_text_color: "#0C447C",
    genre_bg: "#EAF3DE",
    genre_color: "#27500A",
  },
];

const VENUES = [
  { id: "1", name: "Steppenwolf Theatre", slug: "steppenwolf", neighborhood: "Lincoln Park", show_count: 4, initials: "ST" },
  { id: "2", name: "Goodman Theatre", slug: "goodman", neighborhood: "The Loop", show_count: 3, initials: "GT" },
  { id: "3", name: "The Second City", slug: "second-city", neighborhood: "Old Town", show_count: 6, initials: "SC" },
  { id: "4", name: "Neo-Futurists", slug: "neo-futurists", neighborhood: "Andersonville", show_count: 2, initials: "NF" },
];

const GENRES = ["All genres", "Musical", "Comedy", "Play / Drama", "Experimental", "Children's"];

function formatPrice(min: number | null, max: number | null, is_free: boolean) {
  if (is_free) return "Free";
  if (!min) return null;
  const lo = `$${Math.round(min / 100)}`;
  const hi = max && max !== min ? `$${Math.round(max / 100)}` : null;
  return hi ? `${lo}–${hi}` : lo;
}

export default function HomePage() {
  return (
    <main style={{ fontFamily: "'DM Sans', sans-serif", color: "#1a1a1a", maxWidth: "100%" }}>

      {/* Google Fonts */}
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

        {/* Genre filters */}
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 16, flexWrap: "wrap" }}>
          {GENRES.map((g, i) => (
            <span key={g} style={{
              fontSize: 12, padding: "5px 14px", borderRadius: 20, cursor: "pointer",
              border: i === 0 ? "1px solid #3B6D11" : "0.5px solid #d1d1d1",
              background: i === 0 ? "#EAF3DE" : "#fff",
              color: i === 0 ? "#27500A" : "#888",
            }}>
              {g}
            </span>
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
          {["This weekend", "Next weekend", "This month"].map((t, i) => (
            <span key={t} style={{
              fontSize: 13, padding: "6px 16px", borderRadius: 20, cursor: "pointer",
              border: i === 0 ? "1px solid #3B6D11" : "0.5px solid #e5e5e5",
              background: i === 0 ? "#3B6D11" : "#fff",
              color: i === 0 ? "#fff" : "#888",
            }}>
              {t}
            </span>
          ))}
        </div>

        {/* Show cards grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: 12
        }}>
          {SHOWS.map((show) => (
            <Link key={show.id} href={`/shows/${show.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
              <div className="show-card" style={{
                background: "#fff", border: "0.5px solid #e5e5e5",
                borderRadius: 12, overflow: "hidden", cursor: "pointer",
                transition: "border-color 0.15s"
              }}>
                <div style={{
                  height: 110, display: "flex", alignItems: "center", justifyContent: "center",
                  background: show.poster_color, color: show.poster_text_color,
                  fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 700,
                  letterSpacing: "0.5px", padding: "0 12px", textAlign: "center"
                }}>
                  {show.title}
                </div>
                <div style={{ padding: "10px 12px" }}>
                  <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 3, lineHeight: 1.3 }}>{show.title}</div>
                  <div style={{ fontSize: 11, color: "#888", marginBottom: 6 }}>{show.venue}</div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{
                      fontSize: 10, padding: "2px 8px", borderRadius: 10,
                      background: show.genre_bg, color: show.genre_color
                    }}>
                      {show.genre}
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 500, color: "#27500A" }}>
                      {formatPrice(show.price_min, show.price_max, show.is_free)}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Venues section */}
      <div style={{ padding: "0 24px 40px" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 16 }}>
          <h2 className="tob-heading" style={{ fontSize: 26 }}>Chicago venues</h2>
          <Link href="/venues" style={{ fontSize: 13, color: "#3B6D11", textDecoration: "none" }}>See all →</Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10 }}>
          {VENUES.map((venue) => (
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
                  {venue.initials}
                </div>
                <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 2, lineHeight: 1.3 }}>{venue.name}</div>
                <div style={{ fontSize: 11, color: "#888" }}>{venue.neighborhood} · {venue.show_count} shows</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

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
