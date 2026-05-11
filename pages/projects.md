---
title: Projects - heyng
display: Projects
description: List of projects that I am proud of
wrapperClass: 'text-center'
art: dots
projects:
  Magestic:
  - name: 'magestic'
    link: 'https:github.com/bashnko/magestic'
    desc: 'A magestic version of git'
    icon: 'i-carbon-search-locate-mirror'
---

<!-- @layout-full-width -->
<ListProjects :projects="frontmatter.projects" />
