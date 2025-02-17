// eslint-disable-next-line import/no-default-export
export default {
  siteUrl: "https://planer.solvro.pl",
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        userAgent: "*",
        disallow: ["/plans", "/api"],
      },
    ],
  },
};
