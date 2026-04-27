import {
  Hero,
  TrailerSection,
  ChapterReader,
  BookFunnelHandoff,
  ResponseForm,
  Footer,
} from "@/components";

export function Home() {
  return (
    <main>
      <Hero />
      <TrailerSection />
      <ChapterReader />
      <BookFunnelHandoff />
      <ResponseForm />
      <Footer />
    </main>
  );
}
