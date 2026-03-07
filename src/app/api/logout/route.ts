import { cookies as cookiesPromise } from "next/headers";
import { redirect } from "next/navigation";

export const GET = async () => {
  const cookies = await cookiesPromise();
  cookies.delete({
    name: "access_token",
    path: "/",
  });
  cookies.delete({
    name: "access_token_secret",
    path: "/",
  });

  return redirect("/login");
};
