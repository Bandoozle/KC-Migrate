"use client";

import Image from "next/image";
import { useId, useState, useTransition } from "react";
import { FIND_WAYS, INDUSTRY_EXAMPLES, KOSICK_ROLE } from "@/content/chatgpt-ads-page";
import styles from "./ChatGptAdsPage.module.css";

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
      <circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M15.5 15.5 21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 12a7 7 0 0 1 7-7h2a7 7 0 0 1 0 14h-1l-4 3v-3H11a7 7 0 0 1-7-7Z"
      />
    </svg>
  );
}

export function FindWaysStudio() {
  const baseId = useId();
  const [mode, setMode] = useState(0);
  const [, startTransition] = useTransition();
  const active = FIND_WAYS.modes[mode];

  return (
    <div className={styles.studio}>
      <div className={styles.studioCopy}>
        <p className={styles.label}>{FIND_WAYS.label}</p>
        <h2 id="cg-find" className={styles.title}>
          {FIND_WAYS.title}
        </h2>
        <p className={styles.lead}>{FIND_WAYS.lead}</p>
        <ul className={styles.findPoints}>
          {FIND_WAYS.points.map((point) => {
            const index = FIND_WAYS.modes.findIndex((mode) => mode.id === point.id);
            const selected = index === mode;
            return (
              <li key={point.id}>
                <button
                  type="button"
                  className={styles.findPoint}
                  aria-pressed={selected}
                  onClick={() => {
                    if (index >= 0) startTransition(() => setMode(index));
                  }}
                >
                  <span className={styles.findPointIcon} aria-hidden="true">
                    {point.id === "search" ? <SearchIcon /> : <ChatIcon />}
                  </span>
                  <span className={styles.findPointCopy}>
                    <span className={styles.findPointTitle}>{point.title}</span>
                    <span className={styles.findPointBody}>{point.body}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className={styles.studioCard}>
        <div className={styles.modeTabs} role="tablist" aria-label="How people find businesses">
          {FIND_WAYS.modes.map((item, index) => (
            <button
              key={item.id}
              id={`${baseId}-mode-${item.id}`}
              type="button"
              role="tab"
              aria-selected={index === mode}
              className={styles.modeTab}
              onClick={() => startTransition(() => setMode(index))}
            >
              {item.id === "search" ? <SearchIcon /> : <ChatIcon />}
              {item.tab}
            </button>
          ))}
        </div>

        <div key={active.id} className={styles.studioStage} data-mode={active.id}>
          {active.id === "search" ? (
            <div className={styles.serpRich} aria-hidden="true">
              <div className={styles.serpChrome}>
                <span className={styles.serpLogo}>
                  <b>G</b>
                  <b>o</b>
                  <b>o</b>
                  <b>g</b>
                  <b>l</b>
                  <b>e</b>
                </span>
                <div className={styles.serpBar}>
                  <SearchIcon />
                  <span>{"query" in active ? active.query : ""}</span>
                </div>
                <div className={styles.serpNav}>
                  <span data-on>All</span>
                  <span>Maps</span>
                  <span>Images</span>
                  <span>News</span>
                </div>
              </div>
              {"results" in active
                ? active.results.map((result) => (
                    <div key={result.name} className={styles.serpResult} data-sponsored={result.sponsored ? "true" : undefined}>
                      {result.sponsored ? <span className={styles.pill}>Sponsored</span> : null}
                      <span className={styles.serpUrl}>{result.url}</span>
                      <span className={styles.serpName}>{result.name}</span>
                      <span className={styles.serpLine}>{result.line}</span>
                      {result.sponsored ? (
                        <span className={styles.serpLinks}>
                          <em>Book online</em>
                          <em>Services</em>
                          <em>Reviews</em>
                        </span>
                      ) : null}
                    </div>
                  ))
                : null}
            </div>
          ) : (
            <div className={styles.chatRich} aria-hidden="true">
              <div className={styles.chatHead}>
                <span className={styles.exampleMark} />
                <span>AI assistant</span>
              </div>
              <div className={styles.chatBubble}>{"question" in active ? active.question : ""}</div>
              <div className={styles.chatReply}>
                <p>Here are a few things to look for before you book:</p>
                <ul className={styles.chatAnswer}>
                  {"answer" in active
                    ? active.answer.map((line) => (
                        <li key={line}>{line}</li>
                      ))
                    : null}
                </ul>
              </div>
              {"sponsor" in active ? (
                <div className={styles.sponsorCardPremium}>
                  <span className={styles.sponsorPhotoLg}>
                    <Image src="/wp-content/uploads/2026/06/outdoor-advertising.jpg" alt="" fill sizes="160px" className={styles.cover} />
                  </span>
                  <span className={styles.sponsorCopy}>
                    <span className={styles.pill}>Sponsored</span>
                    <span className={styles.sponsorName}>{active.sponsor.name}</span>
                    <span className={styles.sponsorLine}>{active.sponsor.line}</span>
                    <span className={styles.sponsorAction}>{active.sponsor.action}</span>
                  </span>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function IndustryExamplesStudio() {
  const baseId = useId();
  const [active, setActive] = useState(0);
  const [, startTransition] = useTransition();
  const example = INDUSTRY_EXAMPLES.industries[active];

  return (
    <div className={styles.examples}>
      <div className={styles.examplesCopy}>
        <p className={styles.label}>{INDUSTRY_EXAMPLES.label}</p>
        <h2 id="cg-examples" className={styles.title}>
          {INDUSTRY_EXAMPLES.title}
        </h2>
        <p className={styles.lead}>{INDUSTRY_EXAMPLES.lead}</p>
        <div className={styles.industryTabs} role="tablist" aria-label="Example industries">
          {INDUSTRY_EXAMPLES.industries.map((item, index) => (
            <button
              key={item.id}
              id={`${baseId}-industry-${item.id}`}
              type="button"
              role="tab"
              aria-selected={index === active}
              className={styles.industryTab}
              onClick={() => startTransition(() => setActive(index))}
            >
              {item.tab}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.exampleCard} aria-labelledby={`${baseId}-industry-${example.id}`}>
        <div key={example.id} className={styles.exampleStage}>
          <div className={styles.exampleHead}>
            <span className={styles.exampleMark} />
            <span>AI assistant</span>
            <span className={styles.exampleBadge}>Example</span>
          </div>
          <div className={styles.chatBubble}>{example.question}</div>
          <div className={styles.chatReply}>
            <ul className={styles.chatAnswer}>
              {example.answer.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
          <div className={styles.sponsorCardPremium}>
            <span className={styles.sponsorPhotoLg}>
              <Image src={example.sponsor.image} alt="" fill sizes="180px" className={styles.cover} />
            </span>
            <span className={styles.sponsorCopy}>
              <span className={styles.pill}>Sponsored</span>
              <span className={styles.sponsorName}>{example.sponsor.name}</span>
              <span className={styles.sponsorLine}>{example.sponsor.line}</span>
              <span className={styles.sponsorAction}>{example.sponsor.action}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function StageVisual({ index }: { index: number }) {
  if (index === 0) {
    return (
      <div className={styles.stageArt} data-kind="assess">
        <div className={styles.stageChecklist}>
          <span data-on>Business goals</span>
          <span data-on>Target customers</span>
          <span data-on>Questions they ask</span>
          <span>Markets and availability</span>
        </div>
      </div>
    );
  }
  if (index === 1) {
    return (
      <div className={styles.stageArt} data-kind="prepare">
        <div className={styles.stagePage}>
          <span className={styles.stagePageHero} />
          <strong>Free in-home assessment</strong>
          <em />
          <u>Book now</u>
        </div>
        <div className={styles.stageTrack}>
          <b>Tracking</b>
          <span data-on>Calls</span>
          <span data-on>Forms</span>
          <span>Bookings</span>
        </div>
      </div>
    );
  }
  if (index === 2) {
    return (
      <div className={styles.stageArt} data-kind="plan">
        <div className={styles.stagePlan}>
          <label>
            Audience
            <b>Homeowners · Metro Vancouver</b>
          </label>
          <label>
            Budget
            <b>$2,500 test month</b>
          </label>
          <label>
            Objective
            <b>Booked assessments</b>
          </label>
        </div>
      </div>
    );
  }
  return (
    <div className={styles.stageArt} data-kind="review">
      <div className={styles.stageReport}>
        <div className={styles.stageReportMetrics}>
          <span>
            <small>Clicks</small>
            <b>312</b>
          </span>
          <span>
            <small>Leads</small>
            <b>18</b>
          </span>
          <span>
            <small>Cost / lead</small>
            <b>$94</b>
          </span>
        </div>
        <svg className={styles.stageChart} viewBox="0 0 220 72" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 50 C30 46, 50 58, 80 40 C110 22, 130 34, 160 24 C185 16, 200 28, 220 18" fill="none" stroke="#4285f4" strokeWidth="3" strokeLinecap="round" />
          <path d="M0 50 C30 46, 50 58, 80 40 C110 22, 130 34, 160 24 C185 16, 200 28, 220 18 L220 72 L0 72 Z" fill="rgba(66,133,244,0.12)" />
        </svg>
      </div>
    </div>
  );
}

export function RoleProcessStudio() {
  const baseId = useId();
  const [active, setActive] = useState(0);
  const [, startTransition] = useTransition();
  const step = KOSICK_ROLE.steps[active];

  return (
    <div className={styles.roleStudio}>
      <div className={styles.roleIntro}>
        <p className={styles.label}>{KOSICK_ROLE.label}</p>
        <h2 id="cg-role" className={styles.title}>
          {KOSICK_ROLE.title}
        </h2>
        <p className={styles.lead}>{KOSICK_ROLE.lead}</p>
        <p className={styles.disclosure}>{KOSICK_ROLE.note}</p>
      </div>

      <div className={styles.rolePanel}>
        <div className={styles.roleTabs} role="tablist" aria-label="How we help">
          {KOSICK_ROLE.steps.map((item, index) => (
            <button
              key={item.name}
              id={`${baseId}-role-${index}`}
              type="button"
              role="tab"
              aria-selected={index === active}
              className={styles.roleTab}
              onClick={() => startTransition(() => setActive(index))}
            >
              <span className={styles.roleTabIndex}>{index + 1}</span>
              {item.name}
            </button>
          ))}
        </div>

        <div key={step.name} className={styles.roleCard} aria-labelledby={`${baseId}-role-${active}`}>
          <div className={styles.roleCardCopy}>
            <h3 className={styles.roleCardTitle}>{step.name}</h3>
            <p className={styles.roleCardBody}>{step.body}</p>
            <ul className={styles.roleChecks}>
              {step.checks.map((check) => (
                <li key={check}>{check}</li>
              ))}
            </ul>
          </div>
          <StageVisual index={active} />
        </div>
      </div>
    </div>
  );
}
