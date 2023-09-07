import * as React from "react";
import bgImage from "../../../assets/wave-haikei.svg";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="font-sans h-screen w-screen flex flex-col items-center justify-center gap-4 bg-cover"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {children}
    </div>
  );
}
