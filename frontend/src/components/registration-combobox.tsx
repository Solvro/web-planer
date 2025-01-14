import * as React from "react";

import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMediaQuery } from "@/lib/use-media-query";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";

interface Option {
  value: string;
  label: string;
}

export function RegistrationCombobox({
  name,
  registrations,
  selectedRegistrations,
  onSelect,
}: {
  name: string;
  registrations: Option[];
  selectedRegistrations: string[] | null;
  onSelect: (id: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild={true}>
          <Button
            name={name}
            variant="outline"
            className="w-full justify-start truncate font-normal"
          >
            {selectedRegistrations === null
              ? "Rejestracja"
              : `${selectedRegistrations.length.toString()} wybranych`}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <RegistrationList
            allRegistrations={registrations}
            setSelectedRegistrationId={(id) => {
              onSelect(id);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild={true}>
        <Button
          name={name}
          variant="outline"
          className="w-full justify-start truncate font-normal"
        >
          {selectedRegistrations === null
            ? "Wybierz rejestracje"
            : `${selectedRegistrations.length.toString()} wybranych`}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <RegistrationList
            allRegistrations={registrations}
            setSelectedRegistrationId={(id) => {
              onSelect(id);
              setOpen(false);
            }}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function RegistrationList({
  allRegistrations,
  setSelectedRegistrationId,
}: {
  allRegistrations: Option[];
  setSelectedRegistrationId: (id: string) => void;
}) {
  return (
    <Command>
      <CommandInput placeholder="Wybierz rejestrację..." />
      <CommandList>
        <CommandEmpty>Brak wyników</CommandEmpty>
        <CommandGroup>
          {allRegistrations
            .sort((a, b) => a.label.localeCompare(b.label))
            .map((option) => (
              <CommandItem
                key={option.value}
                value={option.label}
                onSelect={(value) => {
                  const id = allRegistrations.find(
                    (r) => r.label === value,
                  )?.value;
                  setSelectedRegistrationId(id ?? "");
                }}
              >
                {option.label}
              </CommandItem>
            ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
