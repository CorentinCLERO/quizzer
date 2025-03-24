import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="flex gap-4 items-center flex-col sm:flex-row">
        <Link href="/quiz">
          <Button variant="outline" className="w-full sm:w-auto">
            Start Quiz
          </Button>
        </Link>
        <Link href="/addQuestion">
          <Button className="w-full sm:w-auto">Add Question</Button>
        </Link>
      </div>
    </div>
  );
}
