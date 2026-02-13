"use client";

import Image from "next/image";
import AnimatedNumbers from "react-animated-numbers";

interface SavingStreakSectionProps {
  address: string | null;
  userStats: {
    streak: number;
    weekActivity: boolean[];
    currentAPY: number;
  };
  poolData?: {
    round: number;
  };
}

const fireIconSmall = <Image src="/images/assets/lottyFire.png" alt="Fire" width={64} height={64} />;
const snowflakeIconSmall = <Image src="/images/assets/lottyCopo.png" alt="Snowflake" width={64} height={64} />;

export function SavingStreakSection({ address, userStats, poolData }: SavingStreakSectionProps) {
  const activeCount = userStats.weekActivity.filter(Boolean).length;
  const totalPools = poolData?.round ?? 0;

  return (
    <div className="flex min-h-0 flex-1 flex-col space-y-4 overflow-y-auto py-2 sm:space-y-6">
      <div className="shrink-0">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-bold text-[#2C1810] sm:text-xl md:text-2xl">
            <span className="text-primary">{">"}</span> Total Pools
          </h2>
          <AnimatedNumbers
            animateToNumber={totalPools}
            fontStyle={{ fontSize: 32, fontWeight: 900, color: "#2C1810" }}
            transitions={(index: number) => ({ type: "spring", duration: index + 0.3 })}
          />
        </div>
      </div>

      <div className="shrink-0 rounded-xl border-2 border-[#2C1810] bg-[#fefcf4] p-4 shadow-[3px_3px_0_0_rgba(0,0,0,0.8)] sm:rounded-2xl sm:border-4 sm:p-6 sm:shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 sm:mb-4">
          <h3 className="text-base font-bold text-[#2C1810] sm:text-lg">your weekly summary</h3>
          <p className="text-sm font-bold text-[#5D4E37] sm:text-base">{activeCount}/7 tickets purchased</p>
        </div>
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => (
            <div
              key={day}
              className={`flex flex-col items-center justify-center rounded-lg border-2 border-[#2C1810] p-1.5 transition-all sm:rounded-2xl sm:border-[3px] sm:p-3 ${
                userStats.weekActivity[index] ? "bg-[#ffd93d] text-[#5D4E37]" : "bg-[#E8E8E8] text-[#5D4E37]"
              }`}
            >
              <span className="mb-0.5 text-[10px] font-bold sm:mb-2 sm:text-xs">{day}</span>
              <div className="text-lg sm:text-2xl [&>img]:h-6 [&>img]:w-6 sm:[&>img]:h-8 sm:[&>img]:w-8">{userStats.weekActivity[index] ? fireIconSmall : snowflakeIconSmall}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1">
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          {Array.from({ length: 9 }, (_, index) => {
            const poolNumber = totalPools - (8 - index);
            return (
              <div
                key={index}
                className="rounded-xl border-2 border-[#2C1810] bg-[#fefcf4] p-2 shadow-[3px_3px_0_0_rgba(0,0,0,0.8)] transition-all active:scale-[0.98] sm:rounded-2xl sm:border-4 sm:p-4 sm:shadow-[4px_4px_0_0_rgba(0,0,0,1)]"
              >
                <div className="text-center">
                  <p className="mb-0.5 text-[10px] font-bold text-[#5D4E37] uppercase sm:mb-2 sm:text-xs">Pool #{poolNumber}</p>
                  <div className="mb-0.5 sm:mb-2">
                    <p className="text-sm font-black text-[#2C1810] sm:text-xl md:text-2xl">${(Math.random() * 10 + 5).toFixed(1)}K</p>
                  </div>
                  <p className="text-[10px] font-bold text-[#5D4E37] sm:text-xs">{Math.floor(Math.random() * 200 + 100)} deposits</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
