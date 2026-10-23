import CaseStudy from './components/CaseStudy.jsx'
import CompareSlider from './components/CompareSlider.jsx'
import ConnectDrawer from './components/ConnectDrawer.jsx'
import { ConnectProvider } from './components/ConnectContext.jsx'
import Hero from './components/Hero.jsx'
import InkSection from './components/InkSection.jsx'
import Konami from './components/Konami.jsx'
import Playground from './components/Playground.jsx'
import ProofConsole from './components/ProofConsole.jsx'
import { About, Contact, Faq, Footer, KinoAside, QcHelps, Services, ValueColumns } from './components/Sections.jsx'
import SiteHeader from './components/SiteHeader.jsx'
import { LangProvider, useT } from './content/i18n.jsx'

function Page() {
  const { projects, ui } = useT()
  const [qc, kino] = projects
  return (
    <ConnectProvider>
      <a className="skip" href="#main">
        {ui.skip}
      </a>
      <SiteHeader />
      <main id="main">
        <Hero />
        <ValueColumns />
        <section id="work" className="wrap section case" aria-label={ui.case01}>
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
        <InkSection id="case-02" className="case-ink" label={ui.case02}>
          <div className="wrap case case--dark">
            <CaseStudy project={kino} aside={<KinoAside />} />
          </div>
        </InkSection>
        <Services />
        <About />
        <Faq />
        <Playground />
        <Contact />
      </main>
      <Footer />
      <ConnectDrawer />
      <Konami />
    </ConnectProvider>
  )
}

export default function App({ lang = 'en' }) {
  return (
    <LangProvider lang={lang}>
      <Page />
    </LangProvider>
  )
}
