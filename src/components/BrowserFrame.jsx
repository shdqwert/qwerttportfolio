// Browser chrome (three dots + URL) around a screenshot viewport.
export default function BrowserFrame({ url, className = '', dark = false, children, viewportRef, viewportClass = '' }) {
  return (
    <div className={`browser${dark ? ' browser--dark' : ''} ${className}`}>
      <div className="browser__bar">
        <span className="browser__dot" />
        <span className="browser__dot" />
        <span className="browser__dot" />
        <span className="mono browser__url">{url}</span>
      </div>
      <div className={`browser__view ${viewportClass}`} ref={viewportRef}>
        {children}
      </div>
    </div>
  )
}
