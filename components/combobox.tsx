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

export function Combobox({
  title,
  items,
  value,
  onCreate,
}: {
  title: string;
  items: { name: string }[];
  value: string;
  onCreate: (item: { name: string }) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between"
        >
          {value
            ? value
            : title}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput
            placeholder={title}
            className="h-9"
            onSelect={(e) =>
              setSelectedValue((e.target as HTMLInputElement).value)
            }
            onSubmit={(e) =>
              onCreate({ name: (e.target as HTMLInputElement).value })
            }
          />
          <CommandList>
            <CommandGroup>
              {value &&
                !items.some(
                  (item) => item.name.toLowerCase() === value.toLowerCase()
                ) && (
                  <CommandItem
                    key={value}
                    value={value}
                    onSelect={(currentValue) => {
                      onCreate({
                        name:
                          currentValue === selectedValue ? "" : currentValue,
                      });
                      setSelectedValue(
                        currentValue === selectedValue ? "" : currentValue
                      );
                      setOpen(false);
                    }}
                  >
                    {value}
                  </CommandItem>
                )}
              {items.map((item) => (
                <CommandItem
                  key={item.name}
                  value={item.name}
                  onSelect={(currentValue) => {
                    onCreate({
                      name: currentValue === selectedValue ? "" : currentValue,
                    });
                    setSelectedValue(
                      currentValue === selectedValue ? "" : currentValue
                    );
                    setOpen(false);
                  }}
                >
                  {item.name}
                  <Check
                    className={cn(
                      "ml-auto",
                      selectedValue === item.name ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
