"use client";

import { useState } from "react";
import { faqs } from "@/config/site";

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-24 border-t border-line section-space">
      <div className="shell grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="eyebrow" data-reveal>
            07 — Questions
          </div>
          <h2 className="h2 mt-5" data-reveal>
            The things you&rsquo;re about to ask.
          </h2>
          <p className="lede mt-5" data-reveal>
            And if it&rsquo;s not here, ask it on the call. We&rsquo;d rather answer it
            now than have it sit in the back of your head for a week.
          </p>
        </div>

        <div className="lg:col-span-8">
          <div className="border-t border-line" data-reveal>
            {faqs.map((f, i) => {
              const on = open === i;
              return (
                <div key={f.q} className="border-b border-line">
                  <button
                    onClick={() => setOpen(on ? null : i)}
                    aria-expanded={on}
                    className="flex w-full items-start justify-between gap-6 py-6 text-left"
                  >
                    <span
                      className={`text-[17px] font-semibold tracking-[-0.018em] transition-colors duration-300 ${
                        on ? "text-chalk" : "text-body"
                      }`}
                    >
                      {f.q}
                    </span>
                    <span className="relative mt-1.5 h-3 w-3 shrink-0">
                      <span
                        className={`absolute left-0 top-[5px] h-[1.5px] w-3 transition-colors duration-300 ${
                          on ? "bg-royal" : "bg-muted"
                        }`}
                      />
                      <span
                        className={`absolute left-0 top-[5px] h-[1.5px] w-3 transition-all duration-300 ${
                          on ? "rotate-0 bg-royal opacity-0" : "rotate-90 bg-muted"
                        }`}
                      />
                    </span>
                  </button>
                  <div
                    className="grid transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{
                      gridTemplateRows: on ? "1fr" : "0fr",
                      opacity: on ? 1 : 0,
                    }}
                  >
                    <div className="overflow-hidden">
                      <p className="max-w-[64ch] pb-7 pr-10 text-[14.5px] leading-relaxed text-muted">
                        {f.a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
