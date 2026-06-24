import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { MarketTrackPage } from './TrackPage'

export function SalesforcePage() {
  return (
    <MarketTrackPage
      trackSlug="salesforce"
      extraContent={(
        <section className="card mt-3">
          <div className="track-page-heading">
            <h2>Detailed Salesforce ecosystem map</h2>
            <Link to="/markets/salesforce" className="btn btn-primary">
              Open ecosystem page <ArrowRight size={18} />
            </Link>
          </div>
          <p className="text-secondary">
            The merged Salesforce branch now includes a dedicated ecosystem map route with market metrics,
            partner coverage, customer footprint, practitioner clustering, and manual correction tracking.
          </p>
        </section>
      )}
    />
  )
}
