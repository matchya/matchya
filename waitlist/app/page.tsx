"use client";

import { OnboardingPageTemplate } from "@/template";

export default function Home() {
  return (
    <OnboardingPageTemplate
      email={"hello"}
      setEmail={() => alert("yo")}
      onSubmit={() => alert("onSubmit")}
      scrollDown={() => alert("yo")}
    />
  );
}
