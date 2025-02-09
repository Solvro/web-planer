import { Footer } from "@/components/footer";

import { Navbar } from "./_components/navbar";

export default function LayoutHomePage({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
