import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { IoMdArrowBack } from "react-icons/io";

import { Plan } from "@/components/plan";

const plansAtom = atomWithStorage<Array<{ id: number; name: string }>>(
  "plansIds",
  [],
);

const Plans = () => {
  const [plans, setPlans] = useAtom(plansAtom);
  const router = useRouter();

  const addNewPlan = () => {
    const newPlan = {
      id: plans.length + 1,
      name: `Nowy plan - ${plans.length + 1}`,
    };
    setPlans([...plans, newPlan]);
    void router.push(`/createplan/${plans.length + 1}`);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex h-14 items-center bg-mainbutton5">
        <a href="https://planer.solvro.pl/" className="ml-4 flex-shrink-0">
          <Image
            src="/assets/logo/solvro_white.png"
            alt="Logo Koła Naukowego Solvro"
            width={150}
            height={150}
            className="cursor-pointer"
          />
        </a>
        <h1 className="mx-auto text-center text-xl text-white sm:text-3xl">
          Twoje plany
        </h1>
        <div className="hidden flex-none pr-4 sm:block">
          <Image
            src="https://github.com/shadcn.png"
            width={40}
            height={40}
            className="rounded-full"
            alt="Picture of the author"
          />
        </div>
      </div>

      <main className="flex-grow">
        <div className="container mx-auto flex h-[calc(100vh-128px)] flex-col rounded bg-gray-200 p-4">
          <div className="flex flex-wrap gap-4 overflow-y-auto">
            <button
              onClick={addNewPlan}
              className="flex h-[200px] w-[200px] items-center justify-center rounded-lg border-2 border-dashed border-gray-400 p-4 shadow-xl"
            >
              <span>Dodaj nowy plan</span>
            </button>
            {plans.map((plan) => (
              <Plan key={plan.id} id={plan.id} name={plan.name} />
            ))}
          </div>
        </div>
      </main>
      <div>
        <div className="flex h-32 flex-row items-center justify-between bg-mainbutton3 text-sm text-white sm:h-14 sm:text-lg">
          <Link
            href="/"
            className="flex h-32 w-full min-w-32 flex-1 cursor-pointer items-center justify-center gap-4 text-center font-semibold transition-all hover:bg-solvroshadow hover:shadow-lg sm:h-14 sm:w-auto sm:flex-row"
          >
            <IoMdArrowBack size={20} className="block" />
            Powrót do głównej strony
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Plans;
