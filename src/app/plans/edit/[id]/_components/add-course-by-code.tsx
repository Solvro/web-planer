"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CatalogCourseNotFoundError,
  fetchCatalogCourse,
  lookupCatalogCourse,
  preferredCatalogTermId,
  sortCatalogTerms,
} from "@/lib/plan/catalog-courses";
import { planUpdates } from "@/lib/plan/plan-updates";
import { refreshGroupSpots } from "@/lib/plan/registration-courses";
import type { PlanHandle } from "@/lib/plan/use-plan";
import type { CatalogCourseLookup } from "@/lib/usos-catalog";
import { cn } from "@/lib/utils";

export function AddCourseByCode({ plan }: { plan: PlanHandle }) {
  const [code, setCode] = useState("");
  const [lookup, setLookup] = useState<CatalogCourseLookup | null>(null);
  const [termId, setTermId] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const terms = useMemo(
    () => (lookup === null ? [] : sortCatalogTerms(lookup.terms)),
    [lookup],
  );
  const selectedTerm = terms.find((term) => term.termId === termId) ?? null;

  const search = async () => {
    const query = code.trim();
    if (query === "") {
      toast.error("Wpisz kod przedmiotu.");
      return;
    }
    setIsSearching(true);
    setLookup(null);
    setTermId(null);
    try {
      const result = await lookupCatalogCourse(query);
      setLookup(result);
      setTermId(preferredCatalogTermId(result.terms));
      if (result.terms.length === 0) {
        toast.error("Ten przedmiot nie ma jeszcze zajęć w żadnym cyklu.");
      }
    } catch (error) {
      toast.error(
        error instanceof CatalogCourseNotFoundError
          ? error.message
          : "Nie udało się wyszukać przedmiotu w katalogu USOSweb.",
        { duration: 6000 },
      );
    } finally {
      setIsSearching(false);
    }
  };

  const addCourse = async () => {
    if (lookup === null || termId === null) {
      return;
    }
    setIsAdding(true);
    try {
      const { registration, course } = await fetchCatalogCourse(
        lookup.courseId,
        termId,
      );
      if (plan.registrations.some((item) => item.id === registration.id)) {
        toast.error("Ten przedmiot w tym semestrze jest już w planie.");
        return;
      }
      void window.umami?.track("Add course by code");
      plan.addRegistration(registration, [course]);
      void refreshGroupSpots(course.groups, (groupOnlineId, patch) => {
        plan.setPlan(
          planUpdates.refreshGroups(new Map([[groupOnlineId, patch]])),
        );
      });
      toast.success(`Dodano ${course.name}`);
      setLookup(null);
      setTermId(null);
      setCode("");
    } catch {
      toast.error(
        "Nie udało się pobrać grup z planu zajęć. Spróbuj ponownie.",
        { duration: 6000 },
      );
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div>
      <form
        className="flex gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          void search();
        }}
      >
        <Input
          id="course-code"
          name="course-code"
          value={code}
          onChange={(event) => {
            setCode(event.currentTarget.value);
            setLookup(null);
            setTermId(null);
          }}
          placeholder="np. 04ITE5-25S302O05823G"
          className="min-w-0 flex-1"
        />
        <Button
          type="submit"
          variant="outline"
          disabled={isSearching}
          className="shrink-0"
        >
          {isSearching ? (
            <Icons.Loader className="size-4 animate-spin" />
          ) : null}
          Szukaj
        </Button>
      </form>

      {lookup === null ? null : (
        <div className="mt-2 flex flex-col gap-2 rounded-md border p-2">
          <div className="min-w-0">
            <p className="text-sm font-medium">{lookup.name}</p>
            <p className="text-muted-foreground font-mono text-xs">
              {lookup.courseId}
            </p>
          </div>
          {terms.length === 0 ? (
            <p className="text-muted-foreground text-xs">
              Brak cykli zajęć w katalogu.
            </p>
          ) : (
            <>
              <Label htmlFor="catalog-term" className="text-xs">
                Semestr
              </Label>
              <Select<string>
                name="catalog-term"
                value={termId}
                onValueChange={setTermId}
              >
                <SelectTrigger
                  id="catalog-term"
                  className="h-auto min-h-10 py-2 whitespace-normal"
                >
                  <SelectValue placeholder="Wybierz semestr">
                    {(value: string | null) => {
                      const term = terms.find((item) => item.termId === value);
                      if (term === undefined) {
                        return "Wybierz semestr";
                      }
                      return (
                        <span className="flex min-w-0 flex-1 flex-col items-start text-left">
                          <span>{term.name}</span>
                          {term.status === null ? null : (
                            <span className="text-muted-foreground text-xs font-normal">
                              {term.status}
                            </span>
                          )}
                        </span>
                      );
                    }}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent alignItemWithTrigger={false} align="start">
                  {terms.map((term) => (
                    <SelectItem
                      key={term.termId}
                      value={term.termId}
                      className={cn(
                        "items-start py-2 whitespace-normal **:whitespace-normal",
                        term.status?.includes("zakończony") === true &&
                          "text-muted-foreground",
                      )}
                    >
                      <span className="flex min-w-0 flex-col">
                        <span>{term.name}</span>
                        {term.status === null ? null : (
                          <span className="text-muted-foreground text-xs">
                            {term.status}
                          </span>
                        )}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                disabled={isAdding || selectedTerm === null}
                onClick={() => {
                  void addCourse();
                }}
              >
                {isAdding ? (
                  <Icons.Loader className="size-4 animate-spin" />
                ) : (
                  <Icons.Plus className="size-4" />
                )}
                Dodaj do planu
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
