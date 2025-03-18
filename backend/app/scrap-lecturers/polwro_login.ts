const getCookieHeader = (cookieArray: string[]): string => {
  return (
    cookieArray
      .map((cookie) => cookie.split(";")[0]) // Take only the name=value part
      // TODO: actual cookie uniqueness enforcement
      .filter((_, index) => index === 2 || index === 3) // Take only the 3rd and 4th cookies
      .join("; ")
  ); // Join with "; " for the Cookie header
};

export async function loginToPolwro(username: string, password: string) {
  const url = "https://polwro.com/login.php";
  const formData = new FormData();
  formData.append("username", username);
  formData.append("password", password);
  formData.append("login", "Zaloguj");

  const response = await fetch(url, {
    method: "POST",
    body: formData,
    redirect: "manual",
  });

  if (response.status !== 302) {
    throw new Error("Failed to log in to Polwro");
  }
  return getCookieHeader(response.headers.getSetCookie());
}
