import Image from "next/image";
import React from "react";

import { Separator } from "@/components/ui/separator";

export default function FAQCalendarPage() {
  return (
    <div className="w-full space-y-6">
      <div>
        <h3 className="text-lg font-medium">Jak dodać do kalendarza</h3>
        <p className="text-sm text-muted-foreground">
          Tutaj znajdziesz krótki tutorial, jak dodać swój plan zajęć do swojego
          kalendarza Google
        </p>
      </div>
      <Separator />
      <div className="space-y-3">
        <Title title={"Pobierz plik .ics"} step={1} />
        <p className="">
          Kliknij przycisk &quot;Dodaj do kalendarza (.ics)&quot;
        </p>
        <Image
          src={"/assets/tutorial/tutorial-1.jpg"}
          alt="Strona z planami, przycisk dodaj do kalendarza"
          unoptimized
          className="w-full"
        />
      </div>
      <div className="space-y-3">
        <Title
          title={"Przejdź do kalendarza google i kliknij importuj"}
          step={2}
        />
        <p className="">
          Przejdź na stronę kalendarza Google i kliknij plus w dolnym lewym rogu
          &gt; importuj
        </p>
        <Image
          src={"/assets/tutorial/tutorial-2.jpg"}
          alt="Strona główna kalendarza google z zaznaczonym na czerwono przyciskiem dodaj"
          unoptimized
          className="w-full"
        />
        <Image
          src={"/assets/tutorial/tutorial-3.jpg"}
          alt="Strona kalendarza google z zaznaczonym na czerwono przyciskiem importuj"
          unoptimized
          className="w-full"
        />
      </div>
      <div className="space-y-3">
        <Title title={"Wybierz pobrany plik"} step={3} />
        <p className="">
          Wybierz plik .ics, który pobrałeś wcześniej z naszej strony i kliknij
          importuj
        </p>
        <Image
          src={"/assets/tutorial/tutorial-4.jpg"}
          alt="Strona importu pliku do kalendarza google"
          unoptimized
          className="w-full"
        />
      </div>
      <div className="space-y-3">
        <Title title={"Ciesz się zaimportowanymi wydarzeniami"} step={4} />
      </div>
    </div>
  );
}

function Title({ title, step }: { title: string; step: number }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-10 items-center justify-center rounded-md bg-primary text-lg font-semibold text-white">
        {step}.
      </div>
      <h1 className="text-lg font-semibold">{title}</h1>
    </div>
  );
}
