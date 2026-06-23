import { platformConfig, liveMarketArea } from '../../config/marketConfig'

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <p>{platformConfig.platformName} — Talent market intelligence platform</p>
        <p>Current live speciality map: {liveMarketArea.name}</p>
        <p>Designed for repeatable public-source research, XLS/XLSX imports and company skill-pocket mapping</p>
      </div>
    </footer>
  )
}
