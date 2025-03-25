import React from "react";
import { Header } from "../components/Header";
import { DebugPage } from "../components/DebugPage";

const page = () => {
  return (
    <div>
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
        <div className="absolute right-0 top-0 h-[500px] w-[500px] bg-blue-500/10 blur-[100px]" />
        <div className="absolute bottom-0 left-0 h-[500px] w-[500px] bg-purple-500/10 blur-[100px]" />
      </div>
      <Header />
      <DebugPage />
    </div>
  );
};

export default page;
