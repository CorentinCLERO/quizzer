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
import useMediaQuery from "./hooks/use-media-query";
import { Explanation } from "@/types";
import { BookOpenText } from "lucide-react";

function ExplanationDrawer({ explanation }: { explanation: Explanation }) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Drawer>
        <DrawerTrigger asChild>
          <div className="flex justify-end">
            <Button>
              <BookOpenText /> Learn More
            </Button>
          </div>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mx-auto w-full max-w-lg">
            <DrawerHeader>
              <DrawerTitle>Explanation :</DrawerTitle>
            </DrawerHeader>
            <div className="h-92 space-y-4 overflow-y-auto overflow-x-hidden">
              {explanation.short && (
                <div>
                  <h1 className="text-lg font-bold">Short explanation :</h1>
                  <div>{explanation.short}</div>
                </div>
              )}
              {explanation.long && (
                <div>
                  <h1 className="text-lg font-bold">Long explanation :</h1>
                  <div>{explanation.long}</div>
                </div>
              )}
              {explanation?.resources && explanation?.resources?.length > 0 && (
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
              )}
            </div>
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

  return (
    <Drawer>
      <DrawerTrigger>Open</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Explanation :</DrawerTitle>
        </DrawerHeader>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default ExplanationDrawer;
