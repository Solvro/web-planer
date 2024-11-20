import React from 'react'
import { SolvroLogo } from "@/components/SolvroLogo";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { createUsosService } from '@/lib/usos';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const PlansTopbar = () => {
  return (
    <div className="flex w-full items-center justify-between bg-mainbutton7 py-4 shadow-sm">
      <div className="container mx-auto flex items-center justify-between">
        <div className="ml-4 flex items-center gap-4 text-2xl font-bold text-white md:w-1/4">
          <SolvroLogo />
          <h1 className="hidden md:block text-2xl font-semibold">Kreator</h1>
        </div>
        <div className="mr-4 flex w-1/4 items-center justify-end">
          <Link
            href="/plans"
            data-umami-event="Back to plans"
            className={cn(buttonVariants({ variant: "link" }), "text-white")}
          >
            <span className="text-nowrap">Moje plany</span>
          </Link>
          <Link
            href="https://web.usos.pwr.edu.pl/kontroler.php?_action=news/default&panel=DOMYSLNY&file=zapisyPL.html"
            target='_blank'
            data-umami-event="Go to USOS"
            className={cn(buttonVariants({ variant: "link" }), "text-white")}
          >
            <span className="text-nowrap">Terminarz USOS</span>
          </Link>

          <UserProfile />
        </div>
      </div>
    </div>
  )
}

const UserProfile = async () => {
  try {
    const usos = await createUsosService();
    const profile = await usos.getProfile();

    return (
      <div className='flex items-center gap-2'>
        {/* <div className='text-right text-nowrap'>
          <h1 className='text-lg font-semibold text-white leading-none'>{profile.first_name + " " + profile.last_name}</h1>
          <h2 className='text-xs text-muted leading-none'>Nr. indeksu: <span className='font-medium'>{profile.student_number}</span></h2>
        </div> */}
        <Avatar>
          <AvatarImage src={profile.photo_urls["50x50"]} />
          <AvatarFallback>{profile.first_name.slice(0,1) + profile.last_name.slice(0,1)}</AvatarFallback>
        </Avatar>
      </div>
    )
  } catch (error) {
    return (
      <Button variant="default" size="sm">Zaloguj się</Button>
    )
  }
}