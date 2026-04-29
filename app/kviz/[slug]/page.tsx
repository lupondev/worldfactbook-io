import Link from "next/link";
import { notFound } from "next/navigation";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

export const revalidate = 300;

type QuizDetail = {
  slug?: string;
  id?: string;
  title?: string;
  titleBs?: string;
  summary?: string;
  summaryBs?: string;
  category?: string;
  questions?: Array<{ question?: string; questionBs?: string }>;
};

function getDiurnaBase() {
  return process.env.NEXT_PUBLIC_DIURNA_URL || "https://diurna.vercel.app";
}

export default async function QuizDetailPage({ params }: { params: { slug: string } }) {
  let quiz: QuizDetail | null = null;
  try {
    const res = await fetch(`${getDiurnaBase()}/api/public/quizzes/${params.slug}`, {
      next: { revalidate: 300 },
    });
    if (res.ok) quiz = (await res.json()) as QuizDetail;
  } catch {}
  if (!quiz) notFound();

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-10 md:px-6">
        <p className="font-mono text-xs uppercase tracking-wider text-muted">
          <Link href="/kvizovi/" className="text-gold hover:underline">
            Kvizovi
          </Link>
        </p>
        <h1 className="mt-3 font-display text-4xl text-cream">{quiz.titleBs || quiz.title || "Kviz"}</h1>
        <p className="mt-3 text-sm text-muted">{quiz.summaryBs || quiz.summary || ""}</p>
        <p className="mt-4 rounded border border-bg4 bg-bg2/70 px-3 py-2 font-mono text-xs text-muted">
          Kategorija: {quiz.category || "Opšte"}
        </p>
        {Array.isArray(quiz.questions) && quiz.questions.length > 0 ? (
          <ol className="mt-6 list-decimal space-y-2 pl-5 text-sm text-cream/90">
            {quiz.questions.slice(0, 10).map((q, i) => (
              <li key={`${params.slug}-${i}`}>{q.questionBs || q.question || "Pitanje"}</li>
            ))}
          </ol>
        ) : null}
      </main>
      <Footer />
    </>
  );
}
