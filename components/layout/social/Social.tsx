import SocialLinks from "./SocialLinks";

export default function Social() {
  return (
    <div className="relative z-10 my-12 flex w-full flex-col items-center gap-10 lg:my-24 lg:gap-16">
      <p className="font-poppins text-secondary text-3xl uppercase sm:text-5xl lg:text-7xl">
        restez connectés
      </p>

      <SocialLinks />
    </div>
  );
}
