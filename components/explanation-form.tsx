import { Explanation } from "@/types";
import { useQuestionContext } from "./providers/question-provider";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";

export default function ExplanationForm() {
  const { questionToAdd, setQuestionToAdd } = useQuestionContext();

  const changeValue = (valueType: string, value: string) => {
    setQuestionToAdd((prev) => ({
      ...prev,
      explanation: { ...(prev.explanation as Explanation), [valueType]: value },
    }));
  };

  const changeResourceValue = (value: string, index: number) => {
    setQuestionToAdd((prev) => ({
      ...prev,
      explanation: {
        ...(prev.explanation as Explanation),
        resources: (prev.explanation?.resources as string[]).map(
          (resource, resourceIndex) => {
            if (resourceIndex === index) return value;
            else return resource;
          }
        ),
      },
    }));
  };

  const addResource = () => {
    setQuestionToAdd((prev) => ({
      ...prev,
      explanation: {
        ...(prev.explanation as Explanation),
        resources: [...(prev.explanation?.resources ? prev.explanation?.resources : []), ""],
      },
    }));
  };

  const removeResource = (index: number) => {
    setQuestionToAdd((prev) => ({
      ...prev,
      explanation: {
        ...(prev.explanation as Explanation),
        resources: (prev.explanation?.resources as string[]).filter(
          (_, resourceIndex) => index !== resourceIndex
        ),
      },
    }));
  };

  return (
    <>
      <Input
        type="text"
        placeholder="Short explanation"
        onChange={(e) => changeValue("short", e.target.value)}
        value={questionToAdd?.explanation?.short}
      />
      <Textarea
        placeholder="Long explanation"
        onChange={(e) => changeValue("long", e.target.value)}
        value={questionToAdd?.explanation?.long}
      />
      <div className="flex flex-col gap-2">
        {questionToAdd.explanation?.resources?.map((resource, index) => (
          <div key={index} className="flex gap-2">
            <Button onClick={() => removeResource(index)} variant="outline">
              <Trash2 />
            </Button>
            <Input
              type="text"
              placeholder="URL"
              onChange={(e) => changeResourceValue(e.target.value, index)}
              value={resource}
            />
          </div>
        ))}
        <Button onClick={addResource} variant="outline">Add resource</Button>
      </div>
    </>
  );
}
