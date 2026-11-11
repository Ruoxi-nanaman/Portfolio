import BackgroundLayer from "./components/layout/BackgroundLayer.jsx";
import Navbar from "./components/layout/Navbar.jsx";
import Footer from "./components/layout/Footer.jsx";
import LoadingScreen from "./components/ui/LoadingScreen.jsx";
import Home from "./sections/Home.jsx";
import About from "./sections/About.jsx";
import Projects from "./sections/Projects.jsx";
import Contact from "./sections/Contact.jsx";
import { useActiveSection } from "./hooks/useActiveSection.js";

const SECTION_IDS = ["home", "about", "projects", "contact"];

export default function App() {
  const activeId = useActiveSection(SECTION_IDS);

  return (
    <>
      <BackgroundLayer />
      <Navbar activeId={activeId} />
      <main>
        <Home />
        <About />
        <Projects />
        <Contact />
      </main>
      <Footer />
      <LoadingScreen />
    </>
  );
}
