import Head from "next/head";
import React from "react";

export const Seo = ({
  pageTitle,
  pageDescription,
  pageImage,
  pageUrl,
}: {
  pageTitle?: string;
  pageDescription?: string;
  pageImage?: string;
  pageUrl?: string;
}) => (
  <Head>
    <title>
      {typeof pageTitle === "string"
        ? `${pageTitle}`
        : `Planer - utwórz swój plan zajęć na PWR!`}
    </title>
    <meta httpEquiv="x-ua-compatible" content="ie=edge" />
    <meta
      name="description"
      content={
        pageDescription ??
        "Planer to strona stworzona z myślą o studentach PWR, którzy pragną w prosty i intuicyjny sposób zarządzać swoimi zapisami na kursy (za darmo!). Dzięki integracji z API USOS, Planer pozwala na dynamiczne tworzenie planów zajęć, bez zbędnych kliknięć i błądzenia w USOSie."
      }
    />
    <meta name="robots" content="index, follow" />
    <meta
      name="keywords"
      content="planer, zapisy, zapisynapwr, zapisownik, usos, nauka, Solvro, pwr, wrocław, politechnika"
    />

    <meta
      property="og:title"
      content={pageTitle ?? "Planer - utwórz swój plan zajęć na PWR!"}
    />
    <meta
      property="og:description"
      content={
        pageDescription ??
        "Planer to strona stworzona z myślą o studentach PWR, którzy pragną w prosty i intuicyjny sposób zarządzać swoimi zapisami na kursy (za darmo!). Dzięki integracji z API USOS, Planer pozwala na dynamiczne tworzenie planów zajęć, bez zbędnych kliknięć i błądzenia w USOSie."
      }
    />
    <meta property="og:image" content={pageImage ?? "/og_image.png"} />
    <meta property="og:url" content={pageUrl ?? "https://planer.solvro.pl/"} />
    <meta property="og:type" content="website" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta
      name="twitter:title"
      content="Planer - utwórz swój plan zajęć na PWR!"
    />
    <meta name="twitter:description" content="https://planer.solvro.pl/" />
    <meta name="twitter:image" content="/og_image.png" />

    <meta name="msapplication-TileColor" content="#da532c" />
    <meta name="theme-color" content="#ffffff" />

    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
    <link rel="manifest" href="/site.webmanifest" />
    <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
    <link rel="canonical" href="https://planer.solvro.pl/" />
  </Head>
);
