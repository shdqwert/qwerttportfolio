import { projects } from './content/portfolio.js'
import CaseStudy from './components/CaseStudy.jsx'
import CompareSlider from './components/CompareSlider.jsx'
import ConnectDrawer from './components/ConnectDrawer.jsx'
import { ConnectProvider } from './components/ConnectContext.jsx'
import Hero from './components/Hero.jsx'
import InkSection from './components/InkSection.jsx'
import ProofConsole from './components/ProofConsole.jsx'
import { About, Contact, Faq, Footer, KinoAside, QcHelps, Services, ValueColumns } from './components/Sections.jsx'
import SiteHeader from './components/SiteHeader.jsx'

export default function App() {
  const [qc, kino] = projects
  return (
    <ConnectProvider>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main">
        <Hero />
        <ValueColumns />
        <section id="work" className="wrap section case" aria-label="Case 01: qwerttclients">
          <CaseStudy
            project={qc}
            aside={<QcHelps />}
            after={
              <>
                <CompareSlider />
                <ProofConsole />
              </>
            }
          />
        </section>
        <InkSection id="case-02" className="case-ink" label="Case 02: kinoqwertt">
          <div className="wrap case case--dark">
            <CaseStudy project={kino} aside={<KinoAside />} />
          </div>
        </InkSection>
        <Services />
        <About />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <ConnectDrawer />
    </ConnectProvider>
  )
}
