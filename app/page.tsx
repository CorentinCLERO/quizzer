import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col">
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
