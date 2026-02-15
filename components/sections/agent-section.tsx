"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function AgentSection() {
  const [baseUrl, setBaseUrl] = useState("");
  const [copiedSkillUrl, setCopiedSkillUrl] = useState(false);

  useEffect(() => {
    setBaseUrl(typeof window !== "undefined" ? window.location.origin : "");
  }, []);

  const skillUrl = baseUrl ? `${baseUrl}/agent-skill.md` : "";
  const copySkillUrl = async () => {
    if (!skillUrl) return;
    try {
      await navigator.clipboard.writeText(skillUrl);
      setCopiedSkillUrl(true);
      setTimeout(() => setCopiedSkillUrl(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto px-4 py-8">
      <div className="w-full max-w-lg rounded-2xl border-2 border-[#2C1810] bg-gradient-to-br from-[#fefcf4] to-[#FFD93D]/30 p-6 shadow-[4px_4px_0_0_rgba(44,24,16,1)] sm:p-8">
        <div className="flex flex-col items-center text-center">
          <span className="mb-4 text-5xl" aria-hidden>
            🤖
          </span>
          <h2 className="text-2xl font-black text-[#2C1810] sm:text-3xl">
            If you&apos;re an agent, read this
          </h2>
          <p className="mt-3 text-base font-semibold text-[#5D4E37]">
            OpenClaw and other agents: programmatic guide for Pot War on Monad.
          </p>

          <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
            <Link
              href="/agent"
              className="inline-flex min-h-[48px] items-center justify-center rounded-xl border-2 border-[#2C1810] bg-[#FFD93D] px-6 py-3 font-black text-[#2C1810] shadow-[3px_3px_0_0_rgba(44,24,16,1)] transition-transform hover:bg-[#FFED4E] active:scale-[0.98]"
            >
              View Agent Docs →
            </Link>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <a
                href="/agent-instructions.md"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-bold text-[#9333EA] underline underline-offset-2 hover:text-[#7c2fd3]"
              >
                AGENT_INSTRUCTIONS.md
              </a>
              <span className="text-[#5D4E37]">·</span>
              <a
                href="/agent-skill.md"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-bold text-[#9333EA] underline underline-offset-2 hover:text-[#7c2fd3]"
              >
                SKILL.md
              </a>
              {skillUrl && (
                <button
                  type="button"
                  onClick={copySkillUrl}
                  className="rounded border-2 border-[#2C1810] bg-[#FFD93D] px-2 py-1 text-xs font-bold text-[#2C1810] transition-transform active:scale-95"
                  title="Copy SKILL.md URL"
                >
                  {copiedSkillUrl ? "Copied!" : "Copy URL"}
                </button>
              )}
            </div>
          </div>

          {baseUrl && (
            <div className="mt-6 w-full rounded-lg border border-[#2C1810]/20 bg-white/80 p-4 text-left">
              <p className="text-xs font-bold uppercase text-[#5D4E37]">Quick API links</p>
              <ul className="mt-2 space-y-1 font-mono text-sm text-[#2C1810]">
                <li>
                  <code className="rounded bg-[#FFD93D]/50 px-1">{baseUrl}/api/pot/live</code> — Current state
                </li>
                <li>
                  <code className="rounded bg-[#FFD93D]/50 px-1">{baseUrl}/api/pot/activity</code> — Bid activity
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
