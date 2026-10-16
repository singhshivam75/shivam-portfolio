import { portfolio } from "@/content/portfolio";

export interface CodePanelSpec {
  title: string;
  lines: readonly string[];
}

const { profile } = portfolio;
const githubHandle = profile.links.github.split("/").filter(Boolean).pop() ?? "";
const topSkills = profile.featuredStack.slice(0, 7);

export const monitorCode: CodePanelSpec = {
  title: "developer.ts",
  lines: [
    "export const developer = {",
    `  name: "${profile.name}",`,
    `  role: "${profile.role}",`,
    `  github: "${githubHandle}",`,
    `  email: "${profile.email}",`,
    "};",
    "",
    "export function build(idea: Idea) {",
    "  return ship(design(idea));",
    "}",
  ],
};

export const sidePanels: readonly CodePanelSpec[] = [
  topSkills.length > 0
    ? {
        title: "stack.ts",
        lines: [
          "const stack = [",
          ...topSkills.map((skill) => `  "${skill}",`),
          "];",
        ],
      }
    : {
        title: "app.tsx",
        lines: [
          "export default function App() {",
          "  return (",
          "    <Portfolio",
          `      owner="${profile.name}"`,
          "    />",
          "  );",
          "}",
        ],
      },
  {
    title: "terminal",
    lines: ["$ npm run build", "", "  Compiling...", "  Type check passed", "  Build complete", "", "$ _"],
  },
];
