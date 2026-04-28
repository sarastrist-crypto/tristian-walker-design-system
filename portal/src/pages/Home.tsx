import { useEffect, useState } from "react";
import {
  Hero,
  TrailerSection,
  ChapterReader,
  BookFunnelHandoff,
  ResponseForm,
  Footer,
} from "@/components";

const UNLOCKED_KEY = "tql.bookfunnel-unlocked.v1";

export function Home() {
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.localStorage.getItem(UNLOCKED_KEY) === "1") {
      setUnlocked(true);
    }
  }, []);

  function handleSubmitted() {
    setUnlocked(true);
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(UNLOCKED_KEY, "1");
      } catch {
        /* fine */
      }
    }
    requestAnimationFrame(() => {
      document
        .getElementById("get-the-book")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  return (
    <main>
      <Hero />
      <TrailerSection />
      <ChapterReader />
      <ResponseForm onSubmitted={handleSubmitted} />
      <BookFunnelHandoff locked={!unlocked} />
      <Footer />
    </main>
  );
}
