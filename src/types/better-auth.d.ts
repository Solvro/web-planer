import "better-auth/client";

declare module "better-auth/client" {
  interface User {
    firstName?: string;
    lastName?: string;
    studentNumber?: number;
    usosId?: string;
    allowNotifications?: boolean;
    onboardingCompleted?: boolean;
  }
}
