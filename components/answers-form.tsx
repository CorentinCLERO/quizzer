import { SingleChoiceAnswers, MultipleChoiceAnswers, TrueFalseAnswers, TextAnswers, MatchingAnswers, OrderingAnswers } from "@/types";
import { useQuestionContext } from "./providers/question-provider";
import { Input } from "./ui/input";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";
import { Trash2, ArrowUp, ArrowDown } from "lucide-react"; // Import ArrowUp and ArrowDown

export default function AnswersForm() {
  const { questionToAdd, setQuestionToAdd } = useQuestionContext();

  if (questionToAdd.type === "SINGLE_CHOICE") {
    const singleChoiceAnswers = questionToAdd.answers as SingleChoiceAnswers[];

    const changeSingleChoiceValue = (
      valueType: string,
      value: string | boolean,
      index: number
    ) => {
      if (valueType === "text" && typeof value === "string")
        setQuestionToAdd((prev) => ({
          ...prev,
          answers: (prev.answers as SingleChoiceAnswers[]).map(
            (answer: SingleChoiceAnswers, answerIndex: number) =>
              answerIndex === index ? { ...answer, text: value } : answer
          ),
        }));
      else if (valueType === "isCorrect" && value === true)
        setQuestionToAdd((prev) => ({
          ...prev,
          answers: (prev.answers as SingleChoiceAnswers[]).map(
            (answer: SingleChoiceAnswers, answerIndex: number) =>
              answerIndex === index
                ? { ...answer, isCorrect: true }
                : { ...answer, isCorrect: false }
          ),
        }));
    };

    const addAnswer = () => {
      setQuestionToAdd((prev) => ({
        ...prev,
        answers: [
          ...(prev.answers as SingleChoiceAnswers[]),
          { text: "", isCorrect: false },
        ],
      }));
    };

    const removeAnswer = (index: number) => {
      setQuestionToAdd((prev) => {
        const answers = prev.answers as SingleChoiceAnswers[];
        if (answers.length > 2 && !answers[index].isCorrect) {
          return {
            ...prev,
            answers: answers.filter((_, answerIndex) => answerIndex !== index),
          };
        }
        return prev;
      });
    };

    return (
      <div className="flex flex-col gap-2">
        {singleChoiceAnswers.map(
          (answer: SingleChoiceAnswers, index: number) => (
            <div
              key={index}
              className="flex items-center justify-between gap-2"
            >
              <Button onClick={() => removeAnswer(index)} variant="outline">
                <Trash2 />
              </Button>
              <Input
                type="text"
                placeholder={`Answer ${index + 1}`}
                onChange={(e) => {
                  changeSingleChoiceValue("text", e.target.value, index);
                }}
                value={answer.text}
              />
              <Switch
                id={`answer${index}`}
                checked={answer.isCorrect}
                onCheckedChange={(e) =>
                  changeSingleChoiceValue("isCorrect", e.valueOf(), index)
                }
              />
            </div>
          )
        )}
        <Button onClick={addAnswer} variant="outline">
          Add answer
        </Button>
      </div>
    );
  } else if (questionToAdd.type === "MULTIPLE_CHOICE") {
    const multipleChoiceAnswers = questionToAdd.answers as MultipleChoiceAnswers[];

    const changeMultipleChoiceValue = (
      valueType: string,
      value: string | boolean,
      index: number
    ) => {
      setQuestionToAdd((prev) => ({
        ...prev,
        answers: (prev.answers as MultipleChoiceAnswers[]).map(
          (answer: MultipleChoiceAnswers, answerIndex: number) =>
            answerIndex === index
              ? { ...answer, [valueType]: value }
              : answer
        ),
      }));
    };

    const addAnswer = () => {
      setQuestionToAdd((prev) => ({
        ...prev,
        answers: [
          ...(prev.answers as MultipleChoiceAnswers[]),
          { text: "", isCorrect: false },
        ],
      }));
    };

    const removeAnswer = (index: number) => {
      setQuestionToAdd((prev) => {
        const answers = prev.answers as MultipleChoiceAnswers[];
        if (answers.length > 2) {
          return {
            ...prev,
            answers: answers.filter((_, answerIndex) => answerIndex !== index),
          };
        }
        return prev;
      });
    };

    return (
      <div className="flex flex-col gap-2">
        {multipleChoiceAnswers.map(
          (answer: MultipleChoiceAnswers, index: number) => (
            <div
              key={index}
              className="flex items-center justify-between gap-2"
            >
              <Button onClick={() => removeAnswer(index)} variant="outline">
                <Trash2 />
              </Button>
              <Input
                type="text"
                placeholder={`Answer ${index + 1}`}
                onChange={(e) => {
                  changeMultipleChoiceValue("text", e.target.value, index);
                }}
                value={answer.text}
              />
              <Switch
                id={`answer${index}`}
                checked={answer.isCorrect}
                onCheckedChange={(e) =>
                  changeMultipleChoiceValue("isCorrect", e.valueOf(), index)
                }
              />
            </div>
          )
        )}
        <Button onClick={addAnswer} variant="outline">
          Add answer
        </Button>
      </div>
    );
  } else if (questionToAdd.type === "TRUE_FALSE") {
    const trueFalseAnswer = questionToAdd.answers as TrueFalseAnswers;

    const changeTrueFalseValue = (value: boolean) => {
      setQuestionToAdd((prev) => ({
        ...prev,
        answers: { isTrue: value },
      }));
    };

    return (
      <div className="flex items-center gap-2">
        <Switch
          id="trueFalseAnswer"
          checked={trueFalseAnswer.isTrue}
          onCheckedChange={(e) => changeTrueFalseValue(e.valueOf())}
        />
        <label htmlFor="trueFalseAnswer">
          {trueFalseAnswer.isTrue ? "True" : "False"}
        </label>
      </div>
    );
  } else if (questionToAdd.type === "TEXT") {
    const textAnswer = questionToAdd.answers as TextAnswers;

    const changeTextValue = (field: keyof TextAnswers, value: string | boolean) => {
      setQuestionToAdd((prev) => ({
        ...prev,
        answers: {
          ...textAnswer,
          [field]: value,
        },
      }));
    };

    return (
      <div className="flex flex-col gap-2">
        <Input
          type="text"
          placeholder="Correct Answer"
          value={textAnswer.correctAnswer}
          onChange={(e) => changeTextValue("correctAnswer", e.target.value)}
        />
        <div className="flex items-center gap-2">
          <Switch
            id="caseSensitive"
            checked={textAnswer.caseSensitive || false}
            onCheckedChange={(e) => changeTextValue("caseSensitive", e.valueOf())}
          />
          <label htmlFor="caseSensitive">Case Sensitive</label>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            id="allowPartial"
            checked={textAnswer.allowPartial || false}
            onCheckedChange={(e) => changeTextValue("allowPartial", e.valueOf())}
          />
          <label htmlFor="allowPartial">Allow Partial Match</label>
        </div>
      </div>
    );
  } else if (questionToAdd.type === "MATCHING") {
    const matchingAnswers = questionToAdd.answers as MatchingAnswers[];

    const changeMatchingValue = (
      side: "left" | "right",
      value: string,
      index: number
    ) => {
      setQuestionToAdd((prev) => ({
        ...prev,
        answers: (prev.answers as MatchingAnswers[]).map(
          (answer: MatchingAnswers, answerIndex: number) =>
            answerIndex === index ? { ...answer, [side]: value } : answer
        ),
      }));
    };

    const addMatchingPair = () => {
      setQuestionToAdd((prev) => ({
        ...prev,
        answers: [
          ...(prev.answers as MatchingAnswers[]),
          { left: "", right: "" },
        ],
      }));
    };

    const removeMatchingPair = (index: number) => {
      setQuestionToAdd((prev) => {
        const answers = prev.answers as MatchingAnswers[];
        if (answers.length > 2) {
          return {
            ...prev,
            answers: answers.filter((_, answerIndex) => answerIndex !== index),
          };
        }
        return prev;
      });
    };

    return (
      <>
        {matchingAnswers.map((answer: MatchingAnswers, index: number) => (
          <div
            key={index}
            className="flex items-center justify-between gap-2"
          >
            <Button onClick={() => removeMatchingPair(index)} variant="outline">
              <Trash2 />
            </Button>
            <Input
              type="text"
              placeholder={`Left ${index + 1}`}
              onChange={(e) => {
                changeMatchingValue("left", e.target.value, index);
              }}
              value={answer.left}
            />
            <Input
              type="text"
              placeholder={`Right ${index + 1}`}
              onChange={(e) => {
                changeMatchingValue("right", e.target.value, index);
              }}
              value={answer.right}
            />
          </div>
        ))}
        <Button onClick={addMatchingPair} variant="outline">
          Add Pair
        </Button>
      </>
    );
  } else if (questionToAdd.type === "ORDERING") {
    const orderingAnswers = questionToAdd.answers as OrderingAnswers[];

    const changeOrderingValue = (value: string, index: number) => {
      setQuestionToAdd((prev) => ({
        ...prev,
        answers: (prev.answers as OrderingAnswers[]).map(
          (answer: OrderingAnswers, answerIndex: number) =>
            answerIndex === index ? { ...answer, text: value } : answer
        ),
      }));
    };

    const reorderAnswers = (startIndex: number, endIndex: number) => {
      setQuestionToAdd((prev) => {
        const answers = [...(prev.answers as OrderingAnswers[])];
        const [removed] = answers.splice(startIndex, 1);
        answers.splice(endIndex, 0, removed);

        return {
          ...prev,
          answers: answers.map((answer, index) => ({
            ...answer,
            correctIndex: index,
          })),
        };
      });
    };

    const addOrderingAnswer = () => {
      setQuestionToAdd((prev) => ({
        ...prev,
        answers: [
          ...(prev.answers as OrderingAnswers[]),
          { text: "", correctIndex: (prev.answers as OrderingAnswers[]).length },
        ],
      }));
    };

    const removeOrderingAnswer = (index: number) => {
      setQuestionToAdd((prev) => ({
        ...prev,
        answers: (prev.answers as OrderingAnswers[]).filter(
          (_, answerIndex) => answerIndex !== index
        ).map((answer, newIndex) => ({
          ...answer,
          correctIndex: newIndex,
        })),
      }));
    };

    return (
      <>
        {orderingAnswers.map((answer: OrderingAnswers, index: number) => (
          <div
            key={index}
            className="flex items-center justify-between gap-2"
          >
            <Button onClick={() => removeOrderingAnswer(index)} variant="outline">
              <Trash2 />
            </Button>
            <Input
              type="text"
              placeholder={`Step ${index + 1}`}
              onChange={(e) => {
                changeOrderingValue(e.target.value, index);
              }}
              value={answer.text}
            />
            <div className="flex gap-1">
              <Button
                onClick={() => reorderAnswers(index, index - 1)}
                variant="outline"
                disabled={index === 0}
              >
                <ArrowUp />
              </Button>
              <Button
                onClick={() => reorderAnswers(index, index + 1)}
                variant="outline"
                disabled={index === orderingAnswers.length - 1}
              >
                <ArrowDown />
              </Button>
            </div>
          </div>
        ))}
        <Button onClick={addOrderingAnswer} variant="outline">
          Add Step
        </Button>
      </>
    );
  }
}
