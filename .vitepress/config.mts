import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "AnimeTV Docs",
  ignoreDeadLinks: true,
  description: "Developer Documentation for AnimeTV",
  themeConfig: {
    logo: '/logo.png',
    siteTitle: 'AnimeTV DevDocs',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'GitHub', link: 'https://github.com/AnimeTV-Fork/docs' }
    ],
    sidebar: [
      {
        text: 'Getting Started',
        items: [
          { text: 'Introduction', link: '/guide/getting-started' },
          { text: 'Build & Release Guide', link: '/guide/build-guide' }
        ]
      },
      {
        text: 'Architecture',
        items: [
          { text: 'Clean Architecture', link: '/guide/architecture' },
          { text: 'Naming Refactor Plan', link: '/guide/naming-refactor' }
        ]
      },
      {
        text: 'Community & Governance',
        items: [
          { text: 'Contributing Guidelines', link: '/guide/contributing' },
          { text: 'Project Governance', link: '/guide/governance' },
          { text: 'Roadmap & Next Steps', link: '/guide/roadmap' }
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/AnimeTV-Fork/docs' }
    ],
    footer: {
      message: 'Released under the Apache-2.0 License.',
      copyright: 'Copyright © 2026 AnimeTV'
    }
  }
})