export default function Footer() {
  return (
    <footer className="flex h-25 w-full items-center justify-between px-4">
      <span>&copy; {new Date().getFullYear()}</span>
      <span>Breizh Cola</span>
    </footer>
  );
}
