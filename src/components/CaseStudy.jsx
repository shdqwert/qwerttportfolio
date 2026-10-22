import { useReveal } from '../lib/motion.js'
import PixelMark from './PixelMark.jsx'
import ScreenGallery from './ScreenGallery.jsx'
import ScrollStage from './ScrollStage.jsx'

export function NumberedList({ title, items }) {
  const [ref, cls] = useReveal({ threshold: 0.2 })
  return (
    <div>
      <h3 className="h3">{title}</h3>
      <ol className={`numlist ${cls}`} ref={ref}>
        {items.map(([t, d], i) => (
          <li className="numlist__row" key={t} style={{ '--i': i }}>
            <span className="mono muted numlist__no">{String(i + 1).padStart(2, '0')}</span>
            <div>
              <div className="numlist__title">{t}</div>
              <div className="numlist__text">{d}</div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

// Case template shared by both projects (light and dark).
export default function CaseStudy({ project, aside, after }) {
  const dark = project.theme === 'dark'
  const [titleRef, titleCls] = useReveal({ threshold: 0.5 })
  const [factsRef, factsCls] = useReveal({ threshold: 0.3 })
  const [cardsRef, cardsCls] = useReveal({ threshold: 0.2 })

  return (
    <>
      <div className="mono case__meta">
        <span>{project.index}</span>
        <span>{project.meta}</span>
      </div>
      <div className={`case__head ${titleCls}`} ref={titleRef}>
        <PixelMark shape={project.mark} from={project.markFrom} cell={14} />
        <h2 className="case__title">{project.title}</h2>
      </div>
      <p className="lead case__lead">{project.lead}</p>
      <dl className={`facts ${factsCls}`} ref={factsRef}>
        {project.facts.map(([k, v, href], i) => (
          <div key={k} style={{ '--i': i }}>
            <dt className="mono muted">{k}</dt>
            <dd>
              {href ? (
                <a href={href} target="_blank" rel="noopener noreferrer">
                  {v}
                </a>
              ) : (
                v
              )}
            </dd>
          </div>
        ))}
      </dl>
      <div className={`cards3 ${cardsCls}`} ref={cardsRef}>
        {project.cards.map(([k, v], i) => (
          <div className={`card${i === 2 ? ' card--invert' : ''}`} key={k} style={{ '--i': i }}>
            <span className="mono card__label">{k}</span>
            <p className="card__text">{v}</p>
          </div>
        ))}
      </div>
      <ScrollStage stage={project.stage} dark={dark} />
      <ScreenGallery screens={project.screens} caption={project.screensCaption} dark={dark} />
      <div className="case__cols">
        <NumberedList title={project.listTitle} items={project.list} />
        <div className="case__aside">{aside}</div>
      </div>
      {after}
    </>
  )
}
