import BackgroundCanvas from "@/components/experience/bg/BackgroundCanvas";
import BubblesView from "@/components/experience/bubbles/BubblesView";
import ViewCanvas from "@/components/experience/cans/ViewCanvas";
import SideMenu from "@/components/experience/sideMenu/SideMenu";
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
      <SideMenu />
      <BubblesView />
      <BackgroundCanvas />
      {children}
      <Footer />
    </>
  );
}
