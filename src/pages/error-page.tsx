import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const ErrorPage = () => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (router.query.message) {
      setErrorMessage(decodeURIComponent(router.query.message as string));
    }
  }, [router.query]);

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Wystąpił błąd</h1>
      {errorMessage !== null ? (
        <p>{errorMessage}</p>
      ) : (
        <p>Nie udało się załadować szczegółów błędu.</p>
      )}
      <button
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onClick={() => router.push("/")}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
          marginTop: "20px",
        }}
      >
        Powrót na stronę główną
      </button>
    </div>
  );
};

export default ErrorPage;
