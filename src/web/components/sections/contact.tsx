import { useRef, useState, type FormEvent } from "react";
import { ArrowUpRight, Check, Loader2 } from "lucide-react";
import { FEATURE_OPTIONS, SECTORS, SITE, type SectorId } from "../../lib/site";
import { Kicker, PillButton, Reveal } from "../ui/primitives";
import { SlideToVerify } from "../ui/slide-to-verify";

type Status = "error" | "idle" | "sending" | "sent";

export function Contact() {
  const [sector, setSector] = useState<SectorId>("real-estate");
  const [area, setArea] = useState(3000);
  const [features, setFeatures] = useState<string[]>(["Walkable 3D tour"]);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [verified, setVerified] = useState(false);
  const loadedAt = useRef(Date.now());
  const estimate = Math.round((area / SITE.rateUnit) * SITE.rate);
  function toggle(feature: string) {
    setFeatures((current) =>
      current.includes(feature) ? current.filter((f) => f !== feature) : [...current, feature],
    );
  }
  function reset() {
    loadedAt.current = Date.now();
    setError("");
    setVerified(false);
    setStatus("idle");
  }
  async function send(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending" || !verified) return;
    const values = new FormData(e.currentTarget);
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/submit", {
        body: JSON.stringify({
          company: String(values.get("company") ?? ""),
          email: String(values.get("email") ?? ""),
          estimate: `$${estimate.toLocaleString()} USD`,
          features: features.join(", "),
          honeypot,
          name: String(values.get("name") ?? ""),
          notes: String(values.get("notes") ?? ""),
          sector: SECTORS.find((s) => s.id === sector)?.label ?? sector,
          sliderVerified: String(verified),
          squareFeet: `${area.toLocaleString()} sq ft`,
          timestamp: loadedAt.current,
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const result = (await res.json().catch(() => null)) as { message?: string; success?: boolean } | null;
      if (result?.success) {
        setStatus("sent");
      } else {
        setStatus("error");
        setError(result?.message ?? (res.status === 429 ? "Too many submissions, please try again later." : "Something went wrong. Please try again."));
      }
    } catch {
      setStatus("error");
      setError("Network error. Please check your connection and try again.");
    }
  }
  return (
    <section id="estimate" className="relative overflow-hidden bg-void py-24 md:py-36">
      <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-copper/5 blur-[100px]" />
      <div className="shell">
        <Reveal className="editorial-head">
          <Kicker index="06">Your next first impression</Kicker>
          <div>
            <h2 className="display text-4xl md:text-6xl">
              Let's bring your
              <br />
              <em className="text-white/45">place to life.</em>
            </h2>
            <p className="body-copy mt-7 max-w-[48ch]">
              Tell us what you're showing. Get an indicative estimate, then send the brief that
              turns it into a project.
            </p>
          </div>
        </Reveal>
        <div className="mt-16 grid gap-14 md:grid-cols-[1fr_1.1fr] md:gap-24">
          <div className="border-t border-white/15 pt-7">
            <Kicker tone="dim">Project estimator</Kicker>
            <fieldset className="mt-9">
              <legend className="micro mb-4 text-white/40">Property type</legend>
              <div className="flex flex-wrap gap-2">
                {SECTORS.map((s) => (
                  <button
                    type="button"
                    key={s.id}
                    onClick={() => setSector(s.id)}
                    aria-pressed={sector === s.id}
                    className={`choice-chip ${sector === s.id ? "selected" : ""}`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </fieldset>
            <div className="mt-10">
              <div className="mb-7 flex items-end justify-between">
                <label htmlFor="area" className="micro text-white/40">
                  Square footage
                </label>
                <output htmlFor="area" className="display text-3xl">
                  {area.toLocaleString()}{" "}
                  <span className="font-body text-xs text-white/40">sq ft</span>
                </output>
              </div>
              <input
                id="area"
                aria-label="Square footage"
                type="range"
                min={500}
                max={20000}
                step={250}
                value={area}
                onChange={(e) => setArea(Number(e.target.value))}
              />
              <div className="micro mt-4 flex justify-between text-white/30">
                <span>500</span>
                <span>20,000</span>
              </div>
            </div>
            <fieldset className="mt-10">
              <legend className="micro mb-4 text-white/40">Requested features</legend>
              <div className="flex flex-wrap gap-2">
                {FEATURE_OPTIONS.map((f) => (
                  <button
                    type="button"
                    key={f}
                    aria-pressed={features.includes(f)}
                    onClick={() => toggle(f)}
                    className={`choice-chip ${features.includes(f) ? "selected" : ""}`}
                  >
                    {features.includes(f) && <Check size={12} />} {f}
                  </button>
                ))}
              </div>
            </fieldset>
            <div className="mt-12 border-t border-white/10 pt-7">
              <p className="micro text-ember">Indicative size-based estimate</p>
              <p className="display mt-4 text-6xl">
                ${estimate.toLocaleString()}{" "}
                <span className="font-body text-xs text-white/40">USD</span>
              </p>
              <p className="mt-5 text-xs leading-6 text-white/40">
                $250 per 2,500 sq ft. Feature selections are included in your brief but do not alter
                this guide calculation. Final pricing, outdoor coverage and delivery options
                confirmed during briefing.
              </p>
            </div>
          </div>
          <div id="contact" className="border-t border-white/15 pt-7">
            <Kicker tone="dim">The brief</Kicker>
            {status === "sent" ? (
              <div aria-live="polite" className="py-16">
                <Check className="mb-7 text-ember" size={30} />
                <h3 className="display text-4xl">Your brief is on its way.</h3>
                <p className="body-copy mt-6">
                  Thank you. We've received your project details and will reply by email.
                </p>
                <PillButton className="mt-8" onClick={reset}>
                  Send another brief
                </PillButton>
              </div>
            ) : (
              <form onSubmit={send} className="mt-7">
                <label className="field-label">
                  Full name <span>*</span>
                  <input
                    aria-label="Full name"
                    required
                    name="name"
                    maxLength={120}
                    autoComplete="name"
                    placeholder="Your name"
                  />
                </label>
                <label className="field-label">
                  Email address <span>*</span>
                  <input
                    aria-label="Email address"
                    required
                    type="email"
                    name="email"
                    maxLength={200}
                    autoComplete="email"
                    placeholder="you@company.com"
                  />
                </label>
                <label className="field-label">
                  Company <span className="text-white/30">(optional)</span>
                  <input
                    aria-label="Company"
                    name="company"
                    maxLength={160}
                    autoComplete="organization"
                    placeholder="Company or property name"
                  />
                </label>
                <label className="field-label">
                  Tell us about the space
                  <textarea
                    aria-label="Tell us about the space"
                    name="notes"
                    maxLength={4000}
                    rows={3}
                    placeholder="Location, project scope, available imagery and what you'd like to create."
                  />
                </label>
                <p className="micro my-7 text-white/35">
                  {SECTORS.find((s) => s.id === sector)?.label} · {area.toLocaleString()} sq ft ·{" "}
                  {features.length} features
                </p>
                <input
                  aria-hidden="true"
                  autoComplete="off"
                  className="absolute -left-[9999px] h-px w-px opacity-0"
                  name="website"
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  type="text"
                  value={honeypot}
                />
                <div className="mb-7">
                  <SlideToVerify onVerify={() => setVerified(true)} verified={verified} />
                </div>
                {status === "error" && (
                  <p role="alert" className="mb-5 text-sm text-ember">
                    We couldn't send your brief. {error}
                  </p>
                )}
                <PillButton type="submit" solid disabled={status === "sending" || !verified}>
                  {status === "sending" ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      Sending brief
                    </>
                  ) : (
                    <>
                      Send brief
                      <ArrowUpRight size={16} />
                    </>
                  )}
                </PillButton>
                <p className="mt-6 text-xs leading-6 text-white/35">
                  We use these details only to reply to your enquiry.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="bg-void">
      <div className="shell border-t border-white/10 py-14">
        <div className="flex flex-col justify-between gap-8 md:flex-row">
          <a href="#top" className="display text-3xl">
            The Walkthrough AI.
          </a>
          <div className="flex gap-8 text-xs text-white/50">
            <a href="#sectors">Services</a>
            <a href="#work">Concept collection</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
        <div className="mt-14 flex flex-col justify-between gap-5 border-t border-white/10 pt-7 md:flex-row">
          <p className="micro text-white/30">© 2026 The Walkthrough AI</p>
          <p className="micro text-white/30">Listings. Suites. Fairways.</p>
        </div>
      </div>
    </footer>
  );
}
