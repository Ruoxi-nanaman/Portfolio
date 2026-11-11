/**
 * Static project data for the Projects section.
 */

import firstImage from "../assets/first.png";
import secondImage from "../assets/second.png";

export const projects = [
  {
    id: "gamevault",
    number: "01",
    tag: "Full-Stack Web Application",
    title: "GameVault",
    description:
      "A full-stack gaming dashboard that integrates with Steam to help users manage their game libraries, track achievements and playtime, and monitor their gaming progress.",
    image: firstImage,
    tech: {
      frontend: "React",
      backend: "Express.js",
      database: "Supabase",
    },
    links: {
      view: "#",
      github: "#",
    },
    featured: true,
  },
  {
    id: "eduquest",
    number: "02",
    tag: "Assessment System",
    title: "Eduquest",
    description:
      "A CTT-based assessment system that helps instructors analyze multiple-choice questions, evaluate item performance, and manage a centralized question bank through automated item analysis and reporting.",
    image: secondImage,
    tech: {
      frontend: "React",
      backend: "Supabase",
      database: "PostgreSQL",
    },
    links: {
      view: "#",
      github: "#",
    },
    featured: true,
  },
];
