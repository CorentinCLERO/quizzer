import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "./ui/button";
import { Explanation } from "@/types";
import { BookOpenText, Loader2 } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

function ExplanationDrawer({
  explanation,
  setShowExplanation,
  loading,
}: {
  explanation: Explanation | undefined;
  setShowExplanation: Dispatch<SetStateAction<boolean>>;
  loading: boolean;
}) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <div className="flex justify-end">
          <Button onClick={() => setShowExplanation(true)} variant="secondary">
            <BookOpenText /> Learn More
          </Button>
        </div>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full p-4 max-w-lg">
          <DrawerHeader>
            <DrawerTitle>Explanation :</DrawerTitle>
          </DrawerHeader>
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="animate-spin h-10 w-10" />
            </div>
          ) : (
            <div className="max-h-[60dvh] space-y-6 overflow-y-auto overflow-x-hidden">
              {explanation?.short ? (
                <div>
                  <h1 className="text-lg font-bold">Short explanation :</h1>
                  <div>{explanation.short}</div>
                </div>
              ) : (
                <div>No short explanation.</div>
              )}
              {explanation?.long ? (
                <div>
                  <h1 className="text-lg font-bold">Long explanation :</h1>
                  <div>{explanation.long}</div>
                </div>
              ) : (
                <div>No long explanation.</div>
              )}
              {explanation?.resources && explanation?.resources?.length > 0 ? (
                <div className="flex flex-col space-y-2">
                  {explanation.resources.map((resource, index) => (
                    <a
                      className="block truncate hover:text-blue-200 underline"
                      key={index}
                      href={resource}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {resource}
                    </a>
                  ))}
                </div>
              ) : (
                <div>No resources.</div>
              )}
            </div>
          )}
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default ExplanationDrawer;
