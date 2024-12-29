"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { getCurrentUser, updateUser } from "@/actions/user";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import type { User, UserSettingsPayload } from "@/types";

const notificationsFormSchema = z.object({
  allow_notifications: z.boolean(),
  security_emails: z.boolean(),
});

type NotificationsFormValues = z.infer<typeof notificationsFormSchema>;

export function NotificationsForm({ defaultUser }: { defaultUser: User }) {
  const { data: user, refetch } = useQuery({
    queryKey: ["user", defaultUser.id],
    queryFn: async () => {
      const response = await getCurrentUser();
      return response;
    },
    initialData: defaultUser,
  });

  const { mutateAsync: updateUserFunction, isPending: isUpdating } =
    useMutation({
      mutationKey: ["updateUser"],
      mutationFn: async (payload: UserSettingsPayload) => {
        await updateUser(payload);
      },
    });
  const form = useForm<NotificationsFormValues>({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues: {
      allow_notifications: user.allowNotifications,
      security_emails: true,
    },
  });

  function onSubmit(data: NotificationsFormValues) {
    // eslint-disable-next-line no-async-promise-executor
    const updateUserPromise = new Promise(async (resolve, reject) => {
      try {
        await updateUserFunction({
          allowNotifications: data.allow_notifications,
        });
        await refetch();
        resolve({ success: true });
      } catch {
        reject(new Error("Failed to update user settings"));
      }
    });

    toast.promise(updateUserPromise, {
      loading: "Aktualizowanie...",
      success: () => {
        return `Zaktualizowano pomyślnie!`;
      },
      error: "Wystąpił błąd podczas aktualizacji.",
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <h3 className="mb-4 text-lg font-medium">Powiadomienia mailowe</h3>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="allow_notifications"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Zmiany w Twoim planie
                    </FormLabel>
                    <FormDescription>
                      Receive emails for friend requests, follows, and more.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="security_emails"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Powiadomienia o bezpieczeństwie
                    </FormLabel>
                    <FormDescription>
                      Receive emails about your account activity and security.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled
                      aria-readonly
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button type="submit" disabled={isUpdating}>
          {isUpdating ? <Loader2Icon className="size-4 animate-spin" /> : null}
          Zaktualizuj dane
        </Button>
      </form>
    </Form>
  );
}
