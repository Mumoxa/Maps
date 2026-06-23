import { useData } from '../../context/DataContext'

export function Footer() {
  const { data } = useData()

  return (
    <footer className="footer">
      <div className="footer-inner">
        <p>SA Credit Risk Market Map — Recruitment Market Intelligence</p>
        <p>Data compiled from public LinkedIn profiles and web search</p>
        {data && (
          <p>{data.profiles.length} Profiles · {data.companies.length} Companies · {data.segments.length} Segments</p>
        )}
      </div>
    </footer>
  )
}
