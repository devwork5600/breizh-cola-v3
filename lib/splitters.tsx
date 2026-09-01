import type { RefObject } from "react";

export function splitWords(phrase: string, refs: RefObject<HTMLSpanElement[]>) {
  let letterIndex = 0;

  return phrase.split(" ").map((word, i) => (
    <p key={i} className="mr-[0.25em] inline-block">
      {word.split("").map((letter, j) => {
        const index = letterIndex++;

        return (
          <span
            key={j}
            ref={(el) => {
              if (el) refs.current[index] = el;
            }}
            className="opacity-0"
          >
            {letter}
          </span>
        );
      })}
    </p>
  ));
}
