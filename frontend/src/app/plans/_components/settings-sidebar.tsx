"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarSettingsProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    title: string;
    icon: React.JSX.Element;
  }[];
}

export function SidebarSettings({
  className,
  items,
  ...props
}: SidebarSettingsProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn("flex flex-col space-x-0 lg:space-y-1", className)}
      {...props}
    >
      {items.map((item) => (
        <Button
          asChild
          key={item.href}
          variant="ghost"
          className={cn(
            pathname === item.href
              ? "bg-muted hover:bg-muted"
              : "hover:bg-transparent hover:underline",
            "justify-start",
          )}
        >
          <Link key={item.href} href={item.href}>
            {item.icon}
            {item.title}
          </Link>
        </Button>
      ))}
    </nav>
  );
}
