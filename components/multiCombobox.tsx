"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Tag {
  name: string;
}

export function MultiCombobox({
  title,
  items,
  values,
  onCreate,
}: {
  title: string;
  items: Tag[];
  values: Tag[];
  onCreate: (item: Tag[]) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState("");
  const valuesToString = values.map((v) => v.name).join(", ");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between"
        >
          {valuesToString ? valuesToString : title}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput
            placeholder={title}
            className="h-9"
            onSubmit={(e) =>
              onCreate([
                ...values,
                { name: (e.target as HTMLInputElement).value },
              ])
            }
            onSelect={(e) =>
              setSelectedValue((e.target as HTMLInputElement).value)
            }
          />
          <CommandList>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item.name}
                  value={item.name}
                  onSelect={(currentValue) => {
                    if (!values.map((v) => v.name).includes(currentValue)) {
                      onCreate([...values, { name: currentValue }]);
                    } else {
                      onCreate(
                        values.filter((item) => item.name !== currentValue)
                      );
                    }
                    setOpen(false);
                    setSelectedValue("")
                  }}
                >
                  {item.name}
                  <Check
                    className={cn(
                      "ml-auto",
                      values.map((v) => v.name).includes(item.name)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
              {selectedValue && (
                <CommandItem
                  key={selectedValue}
                  value={selectedValue}
                  onSelect={(currentValue) => {
                    if (!values.map((v) => v.name).includes(currentValue)) {
                      onCreate([...values, { name: currentValue }]);
                    } else {
                      onCreate(
                        values.filter((item) => item.name !== currentValue)
                      );
                    }
                    setOpen(false);
                    setSelectedValue("")
                  }}
                >
                  {selectedValue}
                </CommandItem>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
