import { useState } from "react";
import { ArrowUpRight, ChevronDown, MoveUpRight } from "lucide-react";
import { CAPABILITIES, REVEALS, SECTORS, FAQS } from "../../lib/site";
import { CompareFrame, Kicker, PillButton, Reveal } from "../ui/primitives";

export function Sectors() {
  const [active, setActive] = useState(0);
  const sector = SECTORS[active]!;
  const descriptions = [
    "Let buyers explore the layout, understand the flow and return to the rooms that matter. AI walkthroughs bring your real estate photography together into a more compelling view of the property.",
    "From the suite to the terrace, from the lobby to the pool. Give prospective guests a feel for your rooms and grounds before they choose where to stay.",
    "Show the line from tee to green. Cinematic flyovers reveal fairways, hazards and the character of your course, bringing the next round a little closer.",
  ];
  return (
    <section id="sectors" className="sector-section bg-void py-24 md:py-36">
      <div className="shell">
        <Reveal className="mb-16 grid gap-8 md:grid-cols-[1fr_2fr]">
          <Kicker index="01">A sense of place</Kicker>
          <h2 className="display text-4xl md:text-6xl">
            A front door.
            <br />A first tee.
            <br />
            <span className="text-white/40">A whole new perspective.</span>
          </h2>
        </Reveal>
        <div className="mb-8 flex flex-wrap gap-2" role="tablist" aria-label="Explore our services">
          {SECTORS.map((s, i) => (
            <button
              key={s.id}
              role="tab"
              aria-selected={i === active}
              aria-controls="sector-panel"
              id={`tab-${s.id}`}
              onClick={() => setActive(i)}
              className={`sector-tab ${active === i ? "selected" : ""}`}
            >
              <span className="mr-3 text-white/30">0{i + 1}</span>
              {s.label}
            </button>
          ))}
        </div>
        <div
          id="sector-panel"
          role="tabpanel"
          aria-labelledby={`tab-${sector.id}`}
          className="grid overflow-hidden border-y border-white/10 md:grid-cols-[1.4fr_1fr]"
        >
          <div className="relative aspect-4/3 overflow-hidden md:aspect-auto md:min-h-[560px]">
            <img
              key={sector.id}
              src={sector.image}
              alt={sector.alt}
              className="rise h-full w-full object-cover"
              loading="lazy"
            />
            <span className="absolute bottom-6 left-6 micro rounded-full border border-white/20 bg-black/30 px-4 py-2 backdrop-blur-sm">
              AI concept image
            </span>
          </div>
          <div className="flex flex-col justify-center bg-char p-8 md:p-12">
            <Kicker>{sector.kicker}</Kicker>
            <h3 className="display my-7 whitespace-pre-line text-3xl md:text-4xl">
              {
                [
                  "Let them feel\nthe floor plan.",
                  "A stay begins\nbefore arrival.",
                  "Give every fairway\nits moment.",
                ][active]
              }
            </h3>
            <p className="body-copy">{descriptions[active]}</p>
            <div className="my-8 h-px bg-white/10" />
            <p className="micro mb-5 text-white/40">
              {
                [
                  "Interior + exterior walkthroughs",
                  "Room tours + resort flyovers",
                  "Tee-to-green aerial sequences",
                ][active]
              }
            </p>
            <a className="inline-flex items-center gap-3 text-sm text-ember" href="#estimate">
              Brief us on your {active === 2 ? "course" : active === 1 ? "destination" : "property"}
              <ArrowUpRight size={17} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Transformations() {
  return (
    <section id="features" className="py-24 md:py-36">
      <div className="shell">
        <Reveal className="editorial-head">
          <Kicker index="02">Small changes. A different feeling.</Kicker>
          <div>
            <h2 className="display text-4xl md:text-6xl">
              The space stays.
              <br />
              <em className="font-light text-white/45">The possibilities change.</em>
            </h2>
            <p className="body-copy mt-7 max-w-[48ch]">
              Give your photography a second life. Slide across each frame to see what staging and
              light can do.
            </p>
          </div>
        </Reveal>
        <div className="mt-16 grid gap-12 md:grid-cols-2">
          {REVEALS.map((r, i) => (
            <Reveal key={r.id} delay={i * 100}>
              <CompareFrame {...r} alt={`${r.title} AI-generated before-and-after illustration`} />
              <Kicker className="mt-7" tone="dim">
                {r.kicker}
              </Kicker>
              <h3 className="display mt-4 text-3xl">{r.title}</h3>
              <p className="body-copy mt-4 max-w-[50ch]">
                {i === 0
                  ? "Help viewers imagine an empty room furnished, without physically staging the property. These illustrative plates show the same room, with and without furniture."
                  : "An atmospheric twilight treatment brings warmth to a daytime exterior. This illustrative pair shows how a change of light can change a first impression."}
              </p>
            </Reveal>
          ))}
        </div>
        <p className="mt-10 text-xs text-white/40">
          AI-generated examples, not client projects. Enhanced imagery should be disclosed wherever
          it is published.
        </p>
      </div>
      <div
        className="mt-20 overflow-hidden border-y border-white/10 py-7"
        aria-label="Additional AI image enhancements"
      >
        <div className="marquee-track flex w-max gap-12">
          {[0, 1].map((copy) => (
            <div key={copy} aria-hidden={copy === 1} className="flex gap-12">
              {CAPABILITIES.map((cap) => (
                <span
                  key={cap}
                  className="micro flex items-center gap-12 whitespace-nowrap text-white/40"
                >
                  {cap}
                  <span className="text-ember/50">/</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Process() {
  const steps = [
    [
      "Share your media",
      "Send us your property photos, room imagery or course coverage. We’ll review what you have, understand your goals and confirm the scope.",
    ],
    [
      "We shape the experience",
      "We build your walkthrough or flyover and apply the agreed enhancements. You review the result before the final delivery.",
    ],
    [
      "Bring your space to the world",
      "Receive the agreed assets for your website, listings and marketing. We’ll confirm sharing and embedding options as part of your brief.",
    ],
  ];
  return (
    <section id="process" className="bg-paper py-24 text-ink md:py-36">
      <div className="shell">
        <Reveal className="editorial-head">
          <Kicker index="03" tone="ink">
            From stills to presence
          </Kicker>
          <h2 className="display text-4xl md:text-6xl">
            You have the photos.
            <br />
            We take it from there.
          </h2>
        </Reveal>
        <div className="mt-16 grid gap-10 md:grid-cols-3">
          {steps.map(([title, text], i) => (
            <Reveal key={title} delay={100 * i} className="border-t border-ink/15 pt-6">
              <p className="display mb-12 text-5xl text-copper/60">0{i + 1}</p>
              <h3 className="display text-3xl">{title}</h3>
              <p className="mt-5 text-sm leading-7 text-ink/60">{text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Portfolio() {
  const [modal, setModal] = useState<number | null>(null);
  const items = [
    {
      name: "The coastal residence",
      type: "Real estate · Walkthrough concept",
      image: "work-01.png",
      detail:
        "An intimate look at architecture, light and the rooms that make a property distinctive. A concept for interior and exterior real estate walkthroughs.",
    },
    {
      name: "The quiet escape",
      type: "Hospitality · Resort flyover concept",
      image: "work-02.png",
      detail:
        "Pool, suite, landscape. A concept for presenting a resort as one connected destination, rather than a series of isolated thumbnails.",
    },
    {
      name: "The closing hole",
      type: "Golf · Aerial flyover concept",
      image: "work-03.png",
      detail:
        "An overhead perspective on the green and its surrounding hazards. A concept for tee-to-green flyovers and course marketing.",
    },
  ];
  return (
    <section id="work" className="py-24 md:py-36">
      <div className="shell">
        <Reveal className="editorial-head">
          <Kicker index="04">The possibilities, illustrated</Kicker>
          <div>
            <h2 className="display text-4xl md:text-6xl">
              Three places.
              <br />
              Three reasons to linger.
            </h2>
            <p className="body-copy mt-7">
              An AI-generated concept collection. Your space is next.
            </p>
          </div>
        </Reveal>
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {items.map((item, i) => (
            <Reveal key={item.name} delay={i * 100}>
              <button onClick={() => setModal(i)} className="group w-full text-left">
                <div className="relative aspect-4/5 overflow-hidden">
                  <img
                    src={`${import.meta.env.BASE_URL}images/${item.image}`}
                    alt={item.name + ", AI-generated architectural concept"}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute bottom-5 right-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/20 backdrop-blur">
                    <MoveUpRight size={18} />
                  </div>
                </div>
                <p className="micro mt-6 text-white/35">0{i + 1} · AI concept</p>
                <h3 className="display mt-3 text-3xl">{item.name}</h3>
                <p className="mt-2 text-xs text-white/50">{item.type}</p>
              </button>
            </Reveal>
          ))}
        </div>
        <div className="mt-24 grid gap-8 border-t border-white/10 pt-12 md:grid-cols-[1fr_2fr]">
          <Kicker tone="dim">Client voices</Kicker>
          <div>
            <p className="display text-3xl text-white/65">
              Real projects. Real feedback.
              <br />
              <em>Coming to this collection soon.</em>
            </p>
            <p className="body-copy mt-5 max-w-[50ch]">
              This new brochure is awaiting approved client testimonials. No fictional endorsements
              or performance claims are shown here.
            </p>
          </div>
        </div>
        {modal !== null && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-6 backdrop-blur"
            onClick={() => setModal(null)}
            role="presentation"
          >
            <dialog
              ref={(node) => { if (node && !node.open) node.showModal(); }}
              onCancel={() => setModal(null)}
              aria-label={items[modal]!.name}
              className="fixed inset-0 m-auto grid max-h-[85vh] w-[calc(100%-48px)] max-w-4xl overflow-auto border border-white/15 bg-ink text-paper backdrop:bg-black/85 md:grid-cols-2"
            >
              <img
                className="h-full w-full object-cover"
                src={`${import.meta.env.BASE_URL}images/${items[modal]!.image}`}
                alt={items[modal]!.name}
              />
              <div className="p-10">
                <button
                  autoFocus
                  onClick={() => setModal(null)}
                  className="mb-14 text-xs text-white/60"
                >
                  Close ×
                </button>
                <Kicker>AI-generated concept</Kicker>
                <h3 className="display my-6 text-4xl">{items[modal]!.name}</h3>
                <p className="body-copy">{items[modal]!.detail}</p>
                <PillButton className="mt-9" href="#estimate" onClick={() => setModal(null)}>
                  Create something like this
                </PillButton>
              </div>
            </dialog>
          </div>
        )}
      </div>
    </section>
  );
}

export function Questions() {
  const questions = [
    [
      FAQS[0]!.q,
      "Start with the photographs and any floor plans you already have. Coverage, image quality and the experience you want determine what else is needed. We’ll review the material before confirming your project.",
    ],
    [
      "Can you work with hotels and golf courses?",
      "Yes. We create room walkthroughs, resort and grounds flyovers, and golf course aerial experiences as well as residential real estate walkthroughs. Each brief is scoped to the property.",
    ],
    [
      "How does the estimate work?",
      "The current guide rate is $250 per 2,500 square feet. The calculator is an indicative size-based estimate, not a fixed quote. Selected enhancements, outdoor coverage, hosting and delivery requirements are confirmed during briefing.",
    ],
    [
      "Are the examples on this page real projects?",
      "The imagery on this new brochure is AI-generated placeholder artwork. The comparison pairs and concept collection illustrate creative directions; they are not client case studies or functioning 3D tours.",
    ],
  ];
  return (
    <section className="shell pb-24 md:pb-36">
      <div className="editorial-head">
        <Kicker index="05">A few practical things</Kicker>
        <div>
          {questions.map(([q, a]) => (
            <details key={q} className="group border-t border-white/10 py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-sm text-white/80">
                {q}
                <ChevronDown
                  size={15}
                  className="shrink-0 text-ember transition-transform group-open:rotate-180"
                />
              </summary>
              <p className="body-copy mt-5 pr-8 text-sm">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
