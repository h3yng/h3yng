export type ProjectItem = {
  name: string;
  summary: string;
  stack: string;
  image: string;
  githubUrl: string;
  liveUrl?: string;
  showOnHome?: boolean;
};

export const projects: ProjectItem[] = [
  {
    name: "sweet-commit",
    summary: "Write clean conventional commits faster.",
    stack: "JavaScript",
    image: "https://camo.githubusercontent.com/b829fc1900934c2dfbf557085273d5ac39c85b1d1f5c5d99cfbde628bed1e359/68747470733a2f2f7668732e636861726d2e73682f7668732d79455432484e694a4e4562797161566659754c6e592e676966",
    githubUrl: "https://github.com/bashnko/sweet-commit",
    liveUrl: "x.om",
    showOnHome: true,
  },
  {
    name: "tabby",
    summary: "Terminal API stress testing with random data.",
    stack: "TypeScript",
    image:
      "https://camo.githubusercontent.com/b829fc1900934c2dfbf557085273d5ac39c85b1d1f5c5d99cfbde628bed1e359/68747470733a2f2f7668732e636861726d2e73682f7668732d79455432484e694a4e4562797161566659754c6e592e676966",
    githubUrl: "https://github.com/bashnko/tabby",
    showOnHome: true,
  },
  {
    name: "manhunt",
    summary: "Global fuzzy finder and navigator.",
    stack: "Go",
    image: "https://opengraph.githubassets.com/1/bashnko/manhunt",
    githubUrl: "https://github.com/bashnko/manhunt",
    showOnHome: true,
  },
  {
    name: "nvim",
    summary: "Personal Neovim config for daily work.",
    stack: "Lua",
    image: "https://opengraph.githubassets.com/1/bashnko/nvim",
    githubUrl: "https://github.com/bashnko/nvim",
  },
];
