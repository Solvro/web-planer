import * as React from "react";

import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMediaQuery } from "@/lib/useMediaQuery";

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
  registrations,
  selectedRegistrationId,
  setSelectedRegistrationId,
}: {
  registrations: Option[];
  selectedRegistrationId: string | null;
  setSelectedRegistrationId: (id: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const selectedRegistration =
    typeof selectedRegistrationId === "string"
      ? registrations.find((option) => option.value === selectedRegistrationId)
      : undefined;

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild={true}>
          <Button variant="outline" className="w-full justify-start truncate">
            {selectedRegistration ? selectedRegistration.label : "Rejestracja"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <RegistrationList
            allRegistrations={registrations}
            setSelectedRegistrationId={(id) => {
              setSelectedRegistrationId(id);
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
        <Button variant="outline" className="w-full justify-start truncate">
          {selectedRegistration ? selectedRegistration.label : "Rejestracja"}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <RegistrationList
            allRegistrations={registrations}
            setSelectedRegistrationId={(id) => {
              setSelectedRegistrationId(id);
              setOpen(false);
            }}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

const RegistrationList = ({
  allRegistrations,
  setSelectedRegistrationId,
}: {
  allRegistrations: Option[];
  setSelectedRegistrationId: (id: string) => void;
}) => {
  return (
    <Command>
      <CommandInput placeholder="Wybierz rejestrację..." />
      <CommandList>
        <CommandEmpty>Brak wyników</CommandEmpty>
        <CommandGroup>
          {allRegistrations.map((option) => (
            <CommandItem
              key={option.value}
              value={option.value}
              onSelect={(value) => {
                setSelectedRegistrationId(value);
              }}
            >
              {option.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
};
