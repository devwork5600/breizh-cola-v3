export default function Footer() {
  return (
    <footer className="bg-secondary text-primary flex h-25 w-full items-center justify-between px-4">
      <span className="text-md font-semibold capitalize xl:text-xl">
        &copy; {new Date().getFullYear()}
      </span>
      <span className="font-cream-cake text-right text-3xl capitalize sm:text-4xl 2xl:text-5xl">
        Breizh Cola
      </span>
    </footer>
  );
}
