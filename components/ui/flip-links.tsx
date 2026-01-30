import React from "react";
import { cn } from "@/lib/utils";

export const FlipLink = ({ 
  children, 
  href,
  className 
}: { 
  children: string; 
  href: string;
  className?: string;
}) => {
  return (
    <a
      href={href}
      className={cn(
        "group relative block overflow-hidden whitespace-nowrap font-black uppercase",
        className
      )}
      style={{
        lineHeight: 0.75,
      }}
    >
      <div className="flex">
        {children.split("").map((letter, i) => (
          <span
            key={i}
            className="inline-block transition-transform duration-300 ease-in-out group-hover:-translate-y-[110%]"
            style={{
              transitionDelay: `${i * 25}ms`,
            }}
          >
            {letter === " " ? "\u00A0" : letter}
          </span>
        ))}
      </div>
      <div className="absolute inset-0 flex">
        {children.split("").map((letter, i) => (
          <span
            key={i}
            className="inline-block translate-y-[110%] transition-transform duration-300 ease-in-out group-hover:translate-y-0"
            style={{
              transitionDelay: `${i * 25}ms`,
            }}
          >
             {letter === " " ? "\u00A0" : letter}
          </span>
        ))}
      </div>
    </a>
  );
};
