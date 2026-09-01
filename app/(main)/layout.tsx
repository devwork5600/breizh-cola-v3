import BackgroundCanvas from "@/components/experience/bg/BackgroundCanvas";
import BubblesView from "@/components/experience/bubbles/BubblesView";
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
      <BubblesView />
      <BackgroundCanvas />
      {children}
      <Footer />
    </>
  );
}
