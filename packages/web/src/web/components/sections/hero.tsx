import { ArrowDown } from "lucide-react";
import { SITE } from "../../lib/site";
import { PillButton } from "../ui/primitives";

export function Hero() {
  return (
    <header id="top" className="relative isolate overflow-hidden bg-paper">
      {/* nav */}
      <nav className="absolute inset-x-0 top-0 z-30 mx-auto flex max-w-[1240px] items-center justify-between px-6 py-7 md:px-10">
        <a href="#top" className="flex items-center gap-2.5 text-ink">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
            <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1" opacity="0.45" />
            <circle cx="10" cy="10" r="4.4" stroke="currentColor" strokeWidth="1.2" />
            <circle cx="10" cy="10" r="1.3" fill="#b4614f" />
          </svg>
          <span className="micro">The Walkthrough AI</span>
        </a>
        <div className="hidden items-center gap-9 md:flex">
          {[
            ["Sectors", "#sectors"],
            ["The work", "#work"],
            ["Process", "#process"],
            ["Estimate", "#estimate"],
          ].map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="micro text-[rgba(14,16,17,0.5)] transition-colors duration-300 hover:text-ink"
            >
              {label}
            </a>
          ))}
        </div>
        <a
          href="#estimate"
          className="micro rounded-full border border-[rgba(14,16,17,0.2)] px-5 py-2.5 text-ink transition-colors duration-300 hover:border-copper hover:text-copper"
        >
          Start a brief
        </a>
      </nav>

      {/* hero copy sits on the paper, above the fog */}
      <div className="relative z-20 mx-auto max-w-[1240px] px-6 pt-40 pb-12 text-center md:px-10 md:pt-48">
        <p
          className="micro rise text-[rgba(14,16,17,0.42)]"
          style={{ animationDelay: "120ms" }}
        >
          Real estate · Resorts · Golf
        </p>
        <h1
          className="display rise mx-auto mt-7 max-w-[15ch] text-[clamp(2.6rem,7vw,6rem)] text-ink"
          style={{ animationDelay: "240ms" }}
        >
          Every place, walked before it's visited.
        </h1>
      </div>

      {/* the plate: fog blends up into the paper, terrain falls into ink */}
      <div className="relative">
        <div className="hero-mask relative h-[68vh] min-h-[420px] w-full overflow-hidden md:h-[86vh]">
          <img
            src="/images/hero-aerial.png"
            alt="Aerial view at dawn of a modern estate on a dark headland, fog banks receding to the horizon"
            className="drift h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-ink" />
        </div>

        {/* scroll cue + overlaid meta */}
        <div className="absolute inset-x-0 bottom-0 z-20 mx-auto flex max-w-[1240px] items-end justify-between px-6 pb-10 md:px-10 md:pb-14">
          <p className="micro hidden text-[rgba(242,242,243,0.4)] md:block">
            {SITE.domain}
          </p>
          <a
            href="#sectors"
            className="micro flex items-center gap-2.5 text-[rgba(242,242,243,0.5)] transition-colors duration-300 hover:text-ember"
          >
            Scroll
            <ArrowDown className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {/* the thesis block — off-centre, as on the reference */}
      <div className="bg-ink pb-28 md:pb-40">
        <div className="mx-auto max-w-[1240px] px-6 md:px-10">
          <div className="md:pl-[32%]">
            <h2 className="display max-w-[22ch] text-[clamp(1.7rem,3.3vw,2.7rem)] text-paper">
              We turn the photographs you already have into places people can walk.
            </h2>
            <p className="mt-7 max-w-[54ch] text-[rgba(242,242,243,0.62)]">
              A listing, a suite, a fairway — brought to life as an AI walkthrough or a cinematic
              flyover. Give buyers and guests a richer sense of your space, from wherever they
              happen to be. We review your photography, understand the brief and build the
              experience around the places you want to show.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <PillButton href="#estimate">Start a brief</PillButton>
              <PillButton href="#work">See the work</PillButton>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
