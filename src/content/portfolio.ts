import type { PortfolioContent } from "@/types/content";

/**
 * Single source of truth for every piece of personal content on the site.
 * Only add facts that appear in the resume or were provided directly.
 * Any list left empty hides its section and nav link automatically.
 */
export const portfolio: PortfolioContent = {
  profile: {
    name: "Shivam Singh",
    role: "Full Stack Developer",
    tagline:
      "Full Stack Developer with 2+ years of experience building scalable SaaS, web, mobile, and AI-powered applications.",
    location: null,
    email: "singh8375shivam@gmail.com",
    links: {
      github: "https://github.com/singhshivam75",
      linkedin: "https://www.linkedin.com/in/shivam-singh-915b96352/",
    },
    resumeUrl: "/resume.pdf",
    summary: [
      "I'm a Full Stack Developer with 2+ years of experience building scalable SaaS, web, mobile, and AI-powered applications.",
      "I work across React.js, Next.js, React Native, Node.js, MongoDB, PostgreSQL, Redis, and AWS, and ship production features across authentication, payments, caching, and asynchronous processing.",
      "I use LLMs, RAG, and AI-assisted development to deliver reliable products faster.",
    ],
    stats: [
      { value: "2+", label: "Years of experience" },
      { value: "3", label: "Companies" },
      { value: "4", label: "Featured projects" },
      { value: "30–40%", label: "Faster APIs via caching & indexing" },
    ],
    featuredStack: ["Next.js", "React Native", "Node.js", "NestJS", "PostgreSQL", "Redis", "AWS"],
    focusAreas: [
      {
        title: "Web Platforms",
        icon: "web",
        description: "Production SaaS and web platforms with React.js, Next.js, Material UI and Tailwind CSS.",
      },
      {
        title: "Mobile Apps",
        icon: "mobile",
        description: "React Native apps, from real-time inventory tracking to a multi-role EdTech marketplace.",
      },
      {
        title: "Backend & APIs",
        icon: "server",
        description: "Node.js, Express.js and NestJS services with JWT, RBAC, Redis caching and BullMQ processing.",
      },
      {
        title: "AI-Powered Products",
        icon: "ai",
        description: "LLMs, RAG, embeddings and agentic workflows to deliver reliable products faster.",
      },
    ],
  },
  skills: [
    { title: "Languages", skills: ["JavaScript", "TypeScript", "HTML", "CSS"] },
    {
      title: "Frontend",
      skills: ["React.js", "Next.js", "React Native", "Redux Toolkit", "Material UI", "Tailwind CSS"],
    },
    { title: "Backend", skills: ["Node.js", "Express.js", "NestJS"] },
    { title: "Databases", skills: ["MongoDB", "PostgreSQL", "MySQL", "Redis"] },
    {
      title: "AI / GenAI",
      skills: [
        "LLMs",
        "Generative AI",
        "AI Agents",
        "RAG",
        "Embeddings",
        "Vector Search",
        "Prompt Engineering",
        "Agentic Workflows",
        "AI Automation",
      ],
    },
    { title: "AI Tools", skills: ["Claude", "GitHub Copilot", "Cursor", "Antigravity"] },
    {
      title: "Cloud / DevOps",
      skills: ["AWS", "S3", "EC2", "Bedrock", "Docker", "Nginx", "GitHub Actions", "CI/CD"],
    },
    { title: "Integrations", skills: ["Razorpay", "Firebase"] },
    { title: "Security", skills: ["JWT", "RBAC"] },
  ],
  experience: [
    {
      company: "Ritz Media World",
      role: "Full Stack Developer",
      period: "July 2026 – Present",
      summary:
        "Develop and maintain mypropertyfact.in, a production real estate platform, with a Next.js and Material UI frontend.",
      highlights: [
        "Built Property Create and Project Create modules with Material UI forms, validation, media uploads, and structured data handling.",
        "Improved listing and admin performance through pagination, faster API responses, and corrected filtering logic.",
        "Automated project creation by parsing Word documents with Mammoth.js, reducing manual data entry.",
        "Collaborated on REST API design, database schema updates, and role-based access for admin workflows.",
      ],
      tech: ["Next.js", "Material UI", "Mammoth.js", "REST APIs"],
    },
    {
      company: "Uproi Digital",
      role: "Full Stack Developer",
      period: "Sept 2025 – June 2026",
      highlights: [
        "Developed scalable web modules with React.js, Node.js, and Express.js, improving modularity and maintainability.",
        "Built reusable UI components and integrated REST APIs for consistent frontend–backend data flow.",
        "Designed MongoDB and MySQL schemas and CRUD operations that improved data consistency across modules.",
        "Shipped a React Native inventory app for real-time stock tracking, duplicate detection, and operational reporting.",
        "Worked in Agile sprints, managed code with Git, and contributed to peer code reviews.",
      ],
      tech: ["React.js", "Node.js", "Express.js", "MongoDB", "MySQL", "React Native"],
    },
    {
      company: "Sourcery IT",
      role: "Full Stack Developer",
      period: "Aug 2024 – Sept 2025",
      highlights: [
        "Built a college-listing platform with a Next.js frontend and NestJS admin APIs.",
        "Developed modular backend services, documented them with Swagger, and secured them with JWT authentication and RBAC.",
        "Integrated AWS S3 for file storage and structured logging with Winston.",
        "Optimized database schemas and indexed queries, improving API response efficiency across modules.",
        "Mentored interns and junior developers through code reviews, API integration, and debugging.",
      ],
      tech: ["Next.js", "NestJS", "Swagger", "JWT", "RBAC", "AWS S3", "Winston"],
    },
  ],
  projects: [
    {
      title: "Stelo",
      category: "EdTech Marketplace",
      visual: "mobile",
      accent: ["#8b5cf6", "#22d3ee"],
      description: "A multi-role marketplace for students, toppers, and administrators.",
      highlights: [
        "Developed notes upload, verification, purchase, learning, and monetization workflows.",
        "Implemented RBAC, admin modules, Razorpay payments, Redis caching, and BullMQ processing.",
        "Improved API performance by 30–40% through caching and asynchronous processing.",
      ],
      tech: ["React Native", "Node.js", "MongoDB", "Redis", "BullMQ", "Razorpay"],
      links: {},
    },
    {
      title: "My Property Fact",
      category: "Real Estate Platform",
      visual: "listing",
      accent: ["#22d3ee", "#6366f1"],
      description:
        "A production platform for property listings, project showcases, and admin management.",
      highlights: [
        "Developed admin and listing interfaces with Material UI and Tailwind CSS, including create flows, filters, and dashboards.",
        "Tuned API responses and pagination, and added document-based auto-fill for project creation using Mammoth.js.",
      ],
      tech: ["Next.js", "Material UI", "Tailwind CSS", "Java", "Spring Boot", "MySQL", "Mammoth.js"],
      links: { live: "https://mypropertyfact.in/" },
      preview: {
        desktop: "/projects/my-property-fact-desktop.webp",
        mobile: "/projects/my-property-fact-mobile.webp",
      },
    },
    {
      title: "Admission DIY",
      category: "College Management Platform",
      visual: "dashboard",
      accent: ["#a855f7", "#ec4899"],
      description: "A full-stack college platform with SEO-optimized pages and a multi-role admin panel.",
      highlights: [
        "Implemented JWT/OTP authentication and RBAC for 5+ user roles, with Swagger-documented NestJS services.",
        "Optimized PostgreSQL schemas and indexed queries, reducing API response time by about 30–40%.",
        "Used SSR and ISR to improve page load.",
      ],
      tech: ["Next.js", "NestJS", "Redis", "PostgreSQL"],
      links: { live: "https://admissiondiy.com/" },
      preview: {
        desktop: "/projects/admission-diy-desktop.webp",
        mobile: "/projects/admission-diy-mobile.webp",
      },
    },
    {
      title: "AxelATS",
      category: "Hiring Platform",
      visual: "kanban",
      accent: ["#06b6d4", "#8b5cf6"],
      description:
        "Role-based dashboards for super admin, company admin, team admin, and employees, with data isolation across organizations.",
      highlights: [
        "Implemented JWT authentication and modular REST APIs.",
        "Optimized MongoDB schemas for hiring workflows.",
      ],
      tech: ["React.js", "Node.js", "Express.js", "MongoDB", "MySQL", "Material UI", "Tailwind CSS"],
      links: {},
    },
  ],
  achievements: [],
  education: [
    {
      institution: "Chandigarh University",
      degree: "Master of Computer Applications (MCA)",
      period: "Aug 2024 – July 2026",
      details: [],
    },
  ],
  testimonials: [],
};
