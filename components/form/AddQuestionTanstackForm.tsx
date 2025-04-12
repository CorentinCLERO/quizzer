import * as React from "react";
import { useForm } from "@tanstack/react-form";
import type { AnyFieldApi } from "@tanstack/react-form";
import { answersInitialisation } from "./functions";
import MultiSelect from "../multiselect";
import { difficultyLevels, questionTypes } from "./constants";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import {
  Difficulty,
  MatchingAnswers,
  MultipleChoiceAnswers,
  // QuestionAnswers,
  QuestionFormValues,
  QuestionType,
  SingleChoiceAnswers,
} from "@/types";
import { Combobox } from "../combobox";
import { z } from "zod";
import { AnswersSchema } from "./zodSchema";
import { Trash2 } from "lucide-react";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { MultiCombobox } from "../multiCombobox";
import { Labels } from "@/app/addQuestion/page";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

function FieldInfo({ field }: { field: AnyFieldApi }) {
  // Helper pour extraire les messages d'erreur
  const getErrorMessages = (errors: unknown[]): string[] => {
    return errors.map((error) => {
      if (typeof error === "string") return error;
      if (typeof error === "object" && error !== null && "message" in error) {
        return (error as { message: string }).message;
      }
      return "Invalid value";
    });
  };

  return (
    <>
      {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
        <em className="text-red-500 text-sm">
          {getErrorMessages(field.state.meta.errors).join(", ")}
        </em>
      )}
      {field.state.meta.isValidating && (
        <em className="text-blue-500 text-sm">Validating...</em>
      )}
    </>
  );
}

async function postQuestion(data: QuestionFormValues) {
  const response = await fetch("/api/questions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    toast.warning("Failed to create question");
    throw new Error("Failed to create question");
  }

  toast.success("Question created");
  return response.json();
}

function AddQuestionTanstackForm({ labelsData }: { labelsData: Labels }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: QuestionFormValues) => postQuestion(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["labels"] });
    },
  });

  const form = useForm({
    defaultValues: {
      text: "",
      explanation: {
        short: "",
        long: "",
        resources: [] as string[],
      },
      answers: answersInitialisation("SINGLE_CHOICE"),
      difficulty: "MEDIUM" as Difficulty,
      type: "SINGLE_CHOICE" as QuestionType,
      hint: "",
      category: {
        name: "",
      } as { id?: string; name: string },
      tags: [] as { id?: string; name: string }[],
    },
    // defaultValues: {
    //   text: "test question",
    //   explanation: {
    //     short: "test short exp",
    //     long: "test long exp",
    //     resources: ["test resource"] as string[],
    //   },
    //   answers: [
    //     {
    //       text: "good answer",
    //       isCorrect: true,
    //     },
    //     {
    //       text: "bad answer",
    //       isCorrect: false,
    //     },
    //   ] as QuestionAnswers,
    //   difficulty: "MEDIUM" as Difficulty,
    //   type: "SINGLE_CHOICE" as QuestionType,
    //   hint: "test hint",
    //   category: {
    //     name: "a categorie",
    //   } as { id?: string; name: string },
    //   tags: [{ name: "first tag" }, { name: "second tag" }] as {
    //     id?: string;
    //     name: string;
    //   }[],
    // },
    validators: {
      onChange: z.object({
        text: z
          .string()
          .min(10, { message: "Must be 10 or more characters long" })
          .max(500, { message: "Must be 500 or fewer characters long" }),
        explanation: z.object({
          short: z
            .string()
            .max(100, { message: "Must be 100 or fewer characters long" }),
          long: z.string(),
          resources: z.array(
            z
              .string()
              .min(10, { message: "Must be 10 or more characters long" })
              .max(200, { message: "Must be 200 or fewer characters long" })
          ),
        }),
        answers: AnswersSchema,
        difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
        type: z.enum([
          "MULTIPLE_CHOICE",
          "SINGLE_CHOICE",
          "TRUE_FALSE",
          "TEXT",
          "MATCHING",
          "ORDERING",
        ]),
        hint: z.string(),
        category: z
          .object({
            name: z
              .string()
              .min(2, { message: "Must be 2 or more characters long" })
              .max(30, { message: "Must be 30 or fewer characters long" }),
          })
          .refine((value) => value.name.trim().length > 0, {
            message: "Category must not be empty",
          }),
        tags: z
          .array(z.object({ name: z.string() }))
          .min(1, { message: "Must have at leat 1 tag" })
          .max(5, { message: "Must have 5 tags max" }),
      }),
    },
    onSubmit: async ({ value }) => {
      // Do something with form data
      await mutation.mutateAsync(value);
      console.log("Question created successfully:", value);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="flex flex-col gap-5"
    >
      <form.Subscribe
        selector={(state) => ({
          values: state.values,
          canSubmit: state.canSubmit,
          isSubmitting: state.isSubmitting,
        })}
      >
        {(state) => (
          <>
            <div>
              <form.Field name="type">
                {(field) => (
                  <div>
                    Type :
                    <MultiSelect
                      defaultValue={field.state.value}
                      name="Select the type of question"
                      values={questionTypes}
                      onChange={(e) => {
                        field.handleChange(e as QuestionType);
                        answersInitialisation(e as QuestionType);
                      }}
                    />
                    <FieldInfo field={field} />
                  </div>
                )}
              </form.Field>
            </div>
            <div>
              <form.Field name="category">
                {(field) => (
                  <div className="flex flex-col">
                    Category :
                    <Combobox
                      title="Search a category..."
                      value={field.state.value.name}
                      items={[
                        ...labelsData?.categories,
                        field.state.value,
                      ].filter(
                        (value, index, array) =>
                          value.name.length > 0 &&
                          array.findIndex((v) => v.name === value.name) ===
                            index
                      )}
                      onCreate={(e) => field.handleChange(e)}
                    />
                    <FieldInfo field={field} />
                  </div>
                )}
              </form.Field>
            </div>
            <div>
              <form.Field name="tags">
                {(field) => {
                  return (
                    <div className="flex flex-col">
                      Tags :
                      <MultiCombobox
                        title="Search a tags..."
                        values={field.state.value}
                        items={[
                          ...labelsData?.tags,
                          ...field.state.value,
                        ].filter(
                          (value, index, array) =>
                            array.findIndex((v) => v.name === value.name) ===
                            index
                        )}
                        onCreate={(e) => field.handleChange(e)}
                      />
                      <FieldInfo field={field} />
                    </div>
                  );
                }}
              </form.Field>
            </div>
            <div>
              <form.Field name="text">
                {(field) => {
                  return (
                    <div>
                      Question :
                      <Textarea
                        placeholder="Add the question..."
                        onChange={(e) => field.handleChange(e.target.value)}
                        value={field.state.value}
                      />
                      <FieldInfo field={field} />
                    </div>
                  );
                }}
              </form.Field>
            </div>
            <div>
              <form.Field name="difficulty">
                {(field) => {
                  return (
                    <div>
                      Difficulty :
                      <MultiSelect
                        defaultValue={field.state.value}
                        name="Select the difficulty of question"
                        values={difficultyLevels}
                        onChange={(e) => {
                          field.handleChange(e as Difficulty);
                        }}
                      />
                      <FieldInfo field={field} />
                    </div>
                  );
                }}
              </form.Field>
            </div>
            <div className="flex flex-col gap-2">
              <form.Field name="answers">
                {(field) => {
                  if (field.form.getFieldValue("type") === "SINGLE_CHOICE")
                    return (
                      <>
                        {(field.state.value as SingleChoiceAnswers[]).map(
                          (_, i) => {
                            return (
                              <div
                                className="flex items-center justify-between gap-2"
                                key={i}
                              >
                                <Button
                                  onClick={() => {
                                    if (
                                      (
                                        field.state
                                          .value as SingleChoiceAnswers[]
                                      ).length > 2 &&
                                      !(
                                        field.state
                                          .value as SingleChoiceAnswers[]
                                      )[i].isCorrect
                                    )
                                      field.removeValue(i);
                                  }}
                                  variant="outline"
                                >
                                  <Trash2 />
                                </Button>
                                <form.Field name={`answers[${i}].text`}>
                                  {(subField) => {
                                    return (
                                      <div className="flex flex-col">
                                        <Input
                                          type="text"
                                          placeholder={`Answer ${i + 1}`}
                                          onChange={(e) => {
                                            subField.handleChange(
                                              e.target.value
                                            );
                                          }}
                                          value={subField.state.value}
                                        />
                                        <FieldInfo field={subField} />
                                      </div>
                                    );
                                  }}
                                </form.Field>
                                <form.Field name={`answers[${i}].isCorrect`}>
                                  {(subField) => {
                                    return (
                                      <Switch
                                        id={`answer${i}la`}
                                        checked={subField.state.value}
                                        onCheckedChange={() => {
                                          if (subField.state.value) {
                                            return;
                                          }
                                          const updatedAnswers = (
                                            field.state
                                              .value as SingleChoiceAnswers[]
                                          ).map((answer, index) => ({
                                            ...answer,
                                            isCorrect: index === i,
                                          }));
                                          field.handleChange(
                                            updatedAnswers as SingleChoiceAnswers[]
                                          );
                                        }}
                                      />
                                    );
                                  }}
                                </form.Field>
                              </div>
                            );
                          }
                        )}
                        <Button
                          onClick={() =>
                            field.pushValue({
                              text: "",
                              isCorrect: false,
                            })
                          }
                          variant="outline"
                        >
                          Add answer
                        </Button>
                      </>
                    );
                  else if (
                    field.form.getFieldValue("type") === "MULTIPLE_CHOICE"
                  )
                    return (
                      <>
                        {(field.state.value as MultipleChoiceAnswers[]).map(
                          (_, i) => {
                            return (
                              <div
                                className="flex items-center justify-between gap-2"
                                key={i}
                              >
                                <Button
                                  onClick={() => {
                                    if (
                                      (
                                        field.state
                                          .value as MultipleChoiceAnswers[]
                                      ).length > 2
                                    )
                                      field.removeValue(i);
                                  }}
                                  variant="outline"
                                >
                                  <Trash2 />
                                </Button>
                                <form.Field name={`answers[${i}].text`}>
                                  {(subField) => {
                                    return (
                                      <div className="flex flex-col">
                                        <Input
                                          type="text"
                                          placeholder={`Answer ${i + 1}`}
                                          onChange={(e) => {
                                            subField.handleChange(
                                              e.target.value
                                            );
                                          }}
                                          value={subField.state.value}
                                        />
                                        <FieldInfo field={subField} />
                                      </div>
                                    );
                                  }}
                                </form.Field>
                                <form.Field name={`answers[${i}].isCorrect`}>
                                  {(subField) => {
                                    return (
                                      <Switch
                                        id={`answer${i}la`}
                                        checked={subField.state.value}
                                        onCheckedChange={(e) =>
                                          subField.handleChange(e)
                                        }
                                      />
                                    );
                                  }}
                                </form.Field>
                              </div>
                            );
                          }
                        )}
                        <Button
                          onClick={() =>
                            field.pushValue({
                              text: "",
                              isCorrect: false,
                            })
                          }
                          variant="outline"
                        >
                          Add answer
                        </Button>
                      </>
                    );
                  else if (field.form.getFieldValue("type") === "TRUE_FALSE")
                    return (
                      <form.Field name="answers.isTrue">
                        {(subField) => (
                          <div className="flex items-center gap-2">
                            <Switch
                              id="trueFalseAnswer"
                              checked={subField.state.value as boolean}
                              onCheckedChange={(e) => subField.handleChange(e)}
                            />
                            <label htmlFor="trueFalseAnswer">
                              {subField.state.value ? "True" : "False"}
                            </label>
                          </div>
                        )}
                      </form.Field>
                    );
                  else if (field.form.getFieldValue("type") === "TEXT")
                    return (
                      <div className="flex flex-col gap-2">
                        <form.Field name="answers.correctAnswer">
                          {(subField) => (
                            <div className="flex flex-col">
                              <Input
                                type="text"
                                placeholder="Correct Answer"
                                value={subField.state.value as string}
                                onChange={(e) =>
                                  subField.handleChange(e.target.value)
                                }
                              />
                              <FieldInfo field={subField} />
                            </div>
                          )}
                        </form.Field>
                      </div>
                    );
                  else if (field.form.getFieldValue("type") === "MATCHING")
                    return (
                      <>
                        {(field.state.value as MatchingAnswers[]).map(
                          (_, i) => {
                            return (
                              <div
                                className="flex items-center justify-between gap-2"
                                key={i}
                              >
                                <Button
                                  onClick={() => {
                                    if (
                                      (field.state.value as MatchingAnswers[])
                                        .length > 2
                                    )
                                      field.removeValue(i);
                                  }}
                                  variant="outline"
                                >
                                  <Trash2 />
                                </Button>
                                <div className="flex items-center justify-between gap-2">
                                  <form.Field name={`answers[${i}].left`}>
                                    {(subField) => (
                                      <>
                                        <Input
                                          type="text"
                                          placeholder={`Left ${i + 1}`}
                                          onChange={(e) => {
                                            subField.handleChange(
                                              e.target.value
                                            );
                                          }}
                                          value={
                                            (subField.state.value as string) ??
                                            ""
                                          }
                                        />
                                        <FieldInfo field={subField} />
                                      </>
                                    )}
                                  </form.Field>
                                  <form.Field name={`answers[${i}].right`}>
                                    {(subField) => (
                                      <div className="flex flex-col">
                                        <Input
                                          type="text"
                                          placeholder={`Right ${i + 1}`}
                                          onChange={(e) => {
                                            subField.handleChange(
                                              e.target.value
                                            );
                                          }}
                                          value={
                                            (subField.state.value as string) ??
                                            ""
                                          }
                                        />
                                        <FieldInfo field={subField} />
                                      </div>
                                    )}
                                  </form.Field>
                                </div>
                              </div>
                            );
                          }
                        )}
                        <Button
                          onClick={() =>
                            field.pushValue({ left: "", right: "" })
                          }
                          variant="outline"
                        >
                          Add Pair
                        </Button>
                      </>
                    );
                  else if (field.form.getFieldValue("type") === "ORDERING")
                    return (
                      <>
                        {(field.state.value as MatchingAnswers[]).map(
                          (_, i) => {
                            return (
                              <div
                                key={i}
                                className="flex items-center justify-between gap-2"
                              >
                                <Button
                                  onClick={() => {
                                    if (
                                      (field.state.value as MatchingAnswers[])
                                        .length > 2
                                    ) {
                                      const updatedAnswers = (
                                        field.state.value as MatchingAnswers[]
                                      )
                                        .filter((_, index) => index !== i)
                                        .map((answer, newIndex) => ({
                                          ...answer,
                                          correctIndex: newIndex,
                                        }));
                                      field.handleChange(updatedAnswers);
                                    }
                                  }}
                                  variant="outline"
                                >
                                  <Trash2 />
                                </Button>
                                <form.Field name={`answers[${i}].text`}>
                                  {(subField) => (
                                    <div className="flex flex-col">
                                      <Input
                                        type="text"
                                        placeholder={`Step ${i + 1}`}
                                        onChange={(e) =>
                                          subField.handleChange(e.target.value)
                                        }
                                        value={subField.state.value as string}
                                      />
                                      <FieldInfo field={subField} />
                                    </div>
                                  )}
                                </form.Field>
                                <div className="flex gap-1">
                                  <Button
                                    onClick={() => {
                                      const updatedAnswers = [
                                        ...(field.state
                                          .value as MatchingAnswers[]),
                                      ];
                                      if (i > 0) {
                                        const [removed] = updatedAnswers.splice(
                                          i,
                                          1
                                        );
                                        updatedAnswers.splice(
                                          i - 1,
                                          0,
                                          removed
                                        );
                                        field.handleChange(
                                          updatedAnswers.map(
                                            (answer, index) => ({
                                              ...answer,
                                              correctIndex: index,
                                            })
                                          )
                                        );
                                      }
                                    }}
                                    variant="outline"
                                    disabled={i === 0}
                                  >
                                    ↑
                                  </Button>
                                  <Button
                                    onClick={() => {
                                      const updatedAnswers = [
                                        ...(field.state
                                          .value as MatchingAnswers[]),
                                      ];
                                      if (i < updatedAnswers.length - 1) {
                                        const [removed] = updatedAnswers.splice(
                                          i,
                                          1
                                        );
                                        updatedAnswers.splice(
                                          i + 1,
                                          0,
                                          removed
                                        );
                                        field.handleChange(
                                          updatedAnswers.map(
                                            (answer, index) => ({
                                              ...answer,
                                              correctIndex: index,
                                            })
                                          )
                                        );
                                      }
                                    }}
                                    variant="outline"
                                    disabled={
                                      i ===
                                      (field.state.value as MatchingAnswers[])
                                        .length -
                                        1
                                    }
                                  >
                                    ↓
                                  </Button>
                                </div>
                              </div>
                            );
                          }
                        )}
                        <Button
                          onClick={() => {
                            const updatedAnswers = [
                              ...(field.state.value as MatchingAnswers[]),
                              {
                                text: "",
                                correctIndex: (
                                  field.state.value as MatchingAnswers[]
                                ).length,
                              },
                            ];
                            field.handleChange(
                              updatedAnswers as MatchingAnswers[]
                            );
                          }}
                          variant="outline"
                        >
                          Add Step
                        </Button>
                      </>
                    );
                }}
              </form.Field>
            </div>
            <div>
              <form.Field name="hint">
                {(field) => {
                  return (
                    <div>
                      <Input
                        type="text"
                        placeholder="Add a hint..."
                        value={field.state.value}
                        onChange={(e) => {
                          field.handleChange(e.target.value);
                        }}
                      />
                    </div>
                  );
                }}
              </form.Field>
            </div>
            <div>
              <form.Field name="explanation">
                {(field) => {
                  return (
                    <div className="flex flex-col gap-2">
                      <form.Field name="explanation.short">
                        {(subField) => {
                          return (
                            <>
                              <Input
                                type="text"
                                placeholder="Add a short explanation..."
                                value={subField.state.value}
                                onChange={(e) => {
                                  subField.handleChange(e.target.value);
                                }}
                              />
                              <FieldInfo field={subField} />
                            </>
                          );
                        }}
                      </form.Field>
                      <form.Field name="explanation.long">
                        {(subField) => {
                          return (
                            <>
                              <Textarea
                                placeholder="Add a long axplanation..."
                                value={subField.state.value}
                                onChange={(e) => {
                                  subField.handleChange(e.target.value);
                                }}
                              />
                            </>
                          );
                        }}
                      </form.Field>
                      {(field.state.value.resources as string[]).map((_, i) => (
                        <form.Field
                          key={i}
                          name={`explanation.resources[${i}]`}
                        >
                          {(subField) => {
                            return (
                              <div className="flex gap-2">
                                <Button
                                  onClick={() => field.removeValue(i)}
                                  variant="outline"
                                >
                                  <Trash2 />
                                </Button>
                                <Input
                                  type="text"
                                  placeholder="URL"
                                  onChange={(e) =>
                                    subField.handleChange(e.target.value)
                                  }
                                  value={subField.state.value}
                                />
                                <FieldInfo field={subField} />
                              </div>
                            );
                          }}
                        </form.Field>
                      ))}
                      <Button
                        onClick={() =>
                          field.handleChange({
                            ...field.state.value,
                            resources: [
                              ...(field.state.value.resources as string[]),
                              "",
                            ],
                          })
                        }
                        variant="outline"
                      >
                        Add resource
                      </Button>
                    </div>
                  );
                }}
              </form.Field>
            </div>
            <Button type="submit" disabled={!state.canSubmit}>
              {state.isSubmitting ? "..." : "Create a question"}
            </Button>
          </>
        )}
      </form.Subscribe>
    </form>
  );
}

export default AddQuestionTanstackForm;
