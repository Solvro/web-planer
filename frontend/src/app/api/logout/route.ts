import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const GET = () => {
  cookies().delete({
    name: "access_token",
    path: "/",
  });
  cookies().delete({
    name: "access_token_secret",
    path: "/",
  });

  return redirect("/login");
};
