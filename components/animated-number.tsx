"use client";

import React from "react";
import AnimatedNumbers from "react-animated-numbers";

interface AnimatedMoneyProps {
  value: string | number;
  suffix?: string;
  className?: string;
  fontSize?: number;
  color?: string;
}

export function AnimatedMoney({
  value,
  suffix = " MON",
  className = "",
  fontSize = 20,
  color = "#2C1810",
}: AnimatedMoneyProps) {
  // Parse the value to a number
  const numValue = typeof value === "string" ? parseFloat(value) || 0 : value;

  return (
    <span 
      className={`inline-flex items-baseline gap-1 ${className}`} 
      style={{ fontSize, color, fontWeight: 'inherit', fontFamily: 'inherit' }}
    >
      <AnimatedNumbers
        animateToNumber={numValue}
        fontStyle={{
          fontSize,
          color,
        }}
      />
      {suffix && <span>{suffix}</span>}
    </span>
  );
}
