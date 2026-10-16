import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { About } from "@/components/sections/about";
import { AiLab } from "@/components/sections/ai-lab";
import { Achievements } from "@/components/sections/achievements";
import { Contact } from "@/components/sections/contact";
import { Education } from "@/components/sections/education";
import { Experience } from "@/components/sections/experience";
import { Hero } from "@/components/sections/hero";
import { Projects } from "@/components/sections/projects";
import { Skills } from "@/components/sections/skills";
import { Testimonials } from "@/components/sections/testimonials";
import { Marquee } from "@/components/ui/marquee";
import { portfolio } from "@/content/portfolio";
import { getResumeLink } from "@/lib/resume";
import { getAiSkills, getVisibleSections, type SectionId } from "@/lib/sections";

export default function Home() {
  const sections = getVisibleSections(portfolio);
  const order = new Map<SectionId, number>(sections.map((section, i) => [section.id, i + 1]));
  const indexOf = (id: SectionId) => order.get(id) ?? 0;
  const { profile } = portfolio;
  const currentCompany = portfolio.experience.find((item) => /present/i.test(item.period))?.company ?? null;
  const marqueeItems = Array.from(new Set(portfolio.skills.flatMap((group) => group.skills)));
  const resume = getResumeLink(profile);

  return (
    <>
      <Navbar items={sections} name={profile.name} resume={resume} />
      <main id="main">
        <Hero
          profile={profile}
          showProjectsCta={order.has("projects")}
          nextSectionId={sections[0]?.id ?? "contact"}
          currentCompany={currentCompany}
          resume={resume}
        />
        <Marquee items={marqueeItems} label="Technologies I work with" />
        {order.has("about") ? (
          <About
            index={indexOf("about")}
            profile={profile}
            currentCompany={currentCompany}
            education={portfolio.education[0] ?? null}
          />
        ) : null}
        {order.has("skills") ? (
          <Skills
            index={indexOf("skills")}
            groups={portfolio.skills}
            featuredStack={profile.featuredStack}
            role={profile.role}
          />
        ) : null}
        {order.has("ai-lab") ? (
          <AiLab index={indexOf("ai-lab")} aiSkills={getAiSkills(portfolio)} />
        ) : null}
        {order.has("experience") ? <Experience index={indexOf("experience")} items={portfolio.experience} /> : null}
        {order.has("projects") ? <Projects index={indexOf("projects")} projects={portfolio.projects} /> : null}
        {order.has("achievements") ? (
          <Achievements index={indexOf("achievements")} items={portfolio.achievements} />
        ) : null}
        {order.has("education") ? <Education index={indexOf("education")} items={portfolio.education} /> : null}
        {order.has("testimonials") ? (
          <Testimonials index={indexOf("testimonials")} items={portfolio.testimonials} />
        ) : null}
        <Contact index={indexOf("contact")} profile={profile} />
      </main>
      <Footer profile={profile} items={sections} resume={resume} />
    </>
  );
}
