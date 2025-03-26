import { useQuestionContext } from "./contex/question-provider";
import { Input } from "./ui/input";

export default function AnswersForm() {
    const { questionToAdd, setQuestionToAdd } = useQuestionContext();

    const changeValue = (valueType: string, value: string) => {
        if (valueType === "hint" && value === "") {
            setQuestionToAdd((prev) => ({ ...prev, hint: undefined }));
            return;
        }
        setQuestionToAdd((prev) => ({ ...prev, [valueType]: value }));
    };

    if (questionToAdd.type === "SINGLE_CHOICE") {
        return (
            <>
                {questionToAdd.answers.map((answer, index) => (
                    <Input
                        key={index}
                        type="text"
                        placeholder="Answer"
                        onChange={(e) => {
                            const newAnswers = [...questionToAdd.answers];
                            newAnswers[index].text = e.target.value;
                            setQuestionToAdd({ ...questionToAdd, answers: newAnswers });
                        }}
                        value={answer.text}
                    />
                ))}
                <div>Add a new answer</div>
            </>
        );
    }
}
