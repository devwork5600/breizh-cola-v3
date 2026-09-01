"use client";

import { useRouter } from "next/navigation";
import type { ButtonHTMLAttributes, MouseEvent, ReactNode } from "react";

import { useMenuStore } from "@/store/useMenuStore";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  href: string;
  children: ReactNode;
}

export default function SideMenuLink({
  href,
  children,
  className = "",
  onClick,
  ...rest
}: Props) {
  const router = useRouter();

  const closeMenu = useMenuStore((state) => state.closeMenu);
  const isAnimating = useMenuStore((state) => state.isAnimating);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (isAnimating) return;

    onClick?.(e);

    router.push(href);

    requestAnimationFrame(() => {
      closeMenu();
    });
  };

  return (
    <button
      onClick={handleClick}
      className={`-skew-1 cursor-pointer text-left font-semibold ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
