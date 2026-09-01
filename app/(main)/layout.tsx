import BackgroundCanvas from "@/components/experience/bg/BackgroundCanvas";
import ViewCanvas from "@/components/experience/cans/ViewCanvas";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ViewCanvas />
      <Header />
      <BackgroundCanvas />
      {children}
      <Footer />
    </>
  );
}
