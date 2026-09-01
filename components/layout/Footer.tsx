import { Copyright } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <div
      className="bg-secondary text-primary relative z-30 h-25"
      style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
    >
      <div className="fixed bottom-0 flex h-25 w-full items-center justify-between px-4">
        <div className="flex items-center">
          <Copyright strokeWidth={1.5} />
          <span className="text-md pl-1 font-semibold capitalize xl:text-xl">
            copyright {currentYear}
          </span>
        </div>

        <span className="font-cream-cake text-right text-3xl capitalize sm:text-4xl 2xl:text-5xl">
          breizh cola
        </span>
      </div>
    </div>
  );
}
