/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://thedrivehub.com",
  generateRobotsTxt: true,
  sitemapSize: 5000,
  changefreq: "daily",
  priority: 0.7,
  exclude: ["/admin/*", "/dashboard/*"],
  robotsTxtOptions: {
    policies: [
      { userAgent: "*", allow: "/" },
      { userAgent: "*", disallow: ["/admin", "/dashboard"] },
    ],
  },
};
