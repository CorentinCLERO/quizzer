import React from 'react';

function SingleChoiceAnswerForm({field}) {
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
}

export default SingleChoiceAnswerForm;