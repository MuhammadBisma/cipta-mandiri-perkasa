/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: "https://kubahcmp.id", 
    generateRobotsTxt: true,  
    changefreq: "monthly",  
    priority: 0.7,  
    sitemapSize: 5000,  
    robotsTxtOptions: {
      additionalSitemaps: [
        "https://kubahcmp.id/sitemap.xml",  
      ],
    },
  }
  