import { SITE_DESCRIPTION, SITE_ORIGIN, SITE_TITLE } from "@/lib/site";

const ORGANIZATION_ID = `${SITE_ORIGIN}/#organization`;
const APPLICATION_ID = `${SITE_ORIGIN}/#webapp`;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": ORGANIZATION_ID,
      name: "Koło Naukowe Solvro",
      url: "https://solvro.pwr.edu.pl/",
      logo: `${SITE_ORIGIN}/android-chrome-512x512.png`,
      sameAs: [
        "https://github.com/Solvro",
        "https://www.facebook.com/knsolvro",
        "https://solvro.pl",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_ORIGIN}/#website`,
      url: SITE_ORIGIN,
      name: SITE_TITLE,
      description: SITE_DESCRIPTION,
      inLanguage: "pl-PL",
      publisher: { "@id": ORGANIZATION_ID },
    },
    {
      "@type": "WebApplication",
      "@id": APPLICATION_ID,
      name: "Planer Solvro",
      url: SITE_ORIGIN,
      description: SITE_DESCRIPTION,
      applicationCategory: "EducationalApplication",
      operatingSystem: "Web",
      inLanguage: "pl-PL",
      browserRequirements: "Wymaga JavaScript.",
      screenshot: `${SITE_ORIGIN}/og_image.png`,
      publisher: { "@id": ORGANIZATION_ID },
      isAccessibleForFree: true,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "PLN",
      },
      featureList: [
        "Układanie planu zajęć na Politechnice Wrocławskiej",
        "Wykrywanie kolizji między grupami zajęciowymi",
        "Aktualne dane o kursach i grupach z USOS",
        "Udostępnianie gotowego planu zajęć",
      ],
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE_ORIGIN}/#faq`,
      mainEntity: [
        {
          "@type": "Question",
          name: "Czy Planer zapisuje mnie na zajęcia?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Nie. Planer służy wyłącznie do ułożenia i sprawdzenia planu zajęć przed zapisami. Samych zapisów dokonujesz samodzielnie w systemie USOS.",
          },
        },
        {
          "@type": "Question",
          name: "Czy korzystanie z Planera jest darmowe?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Tak. Planer jest w pełni darmowy i rozwijany jako projekt open source przez Koło Naukowe Solvro z Politechniki Wrocławskiej.",
          },
        },
        {
          "@type": "Question",
          name: "Skąd Planer bierze dane o kursach i grupach?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Dane o zajęciach pochodzą z systemu USOS Politechniki Wrocławskiej, która pozostaje ich prawnym właścicielem.",
          },
        },
        {
          "@type": "Question",
          name: "Czy muszę mieć konto, żeby ułożyć plan?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Nie. Plan możesz ułożyć bez logowania. Zalogowanie się pozwala zapisać plany na koncie i mieć do nich dostęp z innych urządzeń.",
          },
        },
      ],
    },
  ],
};

export function StructuredData() {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData).replaceAll(
          "<",
          String.raw`\u003c`,
        ),
      }}
    />
  );
}
