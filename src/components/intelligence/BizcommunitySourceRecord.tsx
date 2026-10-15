import { ArrowSquareOut } from '@phosphor-icons/react'
import type { BizcommunitySourceRecord as BizcommunitySourceRecordType, BizcommunitySourceRow } from '../../data/organizations/types'

interface BizcommunitySourceRecordProps {
  record: BizcommunitySourceRecordType
}

function SourceValue({ value }: { value: string }) {
  if (!value) return <span className="text-secondary">Not supplied</span>
  if (/^https?:\/\//i.test(value)) {
    return (
      <a href={value} target="_blank" rel="noreferrer">
        {value} <ArrowSquareOut size={11} aria-hidden />
      </a>
    )
  }
  return <span>{value}</span>
}

function SourceRow({ row }: { row: BizcommunitySourceRow }) {
  const fields: [string, string][] = [
    ['Company name', row.companyName],
    ['Industry', row.industries],
    ['Location', row.location],
    ['Business description', row.businessDescription],
    ['Bizcommunity listing type', row.listingType],
    ['Company size / staff tier', row.companySizeStaffTier],
    ['Size tier evidence', row.sizeTierEvidence],
    ['Profile URL', row.profileUrl],
    ['Directory source URL', row.directorySourceUrl],
    ['Coverage status', row.coverageStatus],
    ['Checked date', row.checkedDate],
    ['Has website or LinkedIn (verified)', row.hasWebsiteOrLinkedInVerified],
    ['Website status', row.websiteStatus],
    ['Website URL', row.websiteUrl],
    ['LinkedIn status', row.linkedinStatus],
    ['LinkedIn company URL', row.linkedinCompanyUrl],
    ['Online presence evidence', row.onlinePresenceEvidence],
  ]

  return (
    <article className="bizcommunity-source-row">
      <h3>Source row {row.sourceRowNumber}</h3>
      <dl className="detail-facts">
        {fields.map(([label, value]) => (
          <div className="detail-fact" key={label}>
            <dt>{label}</dt>
            <dd><SourceValue value={value} /></dd>
          </div>
        ))}
      </dl>
    </article>
  )
}

/** Render the supplied directory record without replacing it with inferred facts. */
export function BizcommunitySourceRecord({ record }: BizcommunitySourceRecordProps) {
  const rows = record.sourceRows ?? []
  return (
    <section className="section-block" aria-labelledby="bizcommunity-source-heading">
      <h2 id="bizcommunity-source-heading">Bizcommunity source record</h2>
      <p className="assoc-section-note">
        This section is the supplied CSV record, retained as source truth and not independently
        re-verified by Maps. Its source category is linked to the national taxonomy above at the
        broadest level supported by the label. The directory itself states: “{rows[0]?.coverageStatus ?? 'coverage status not supplied'}”.
      </p>
      <div className="detail-facts">
        <div className="detail-fact">
          <dt>Source file</dt>
          <dd className="detail-mono">{record.sourceFile}</dd>
        </div>
        <div className="detail-fact">
          <dt>Source rows</dt>
          <dd>{record.sourceRowNumbers.join(', ')}</dd>
        </div>
        <div className="detail-fact">
          <dt>Source industry labels</dt>
          <dd>{record.sourceIndustryLabels.join('; ')}</dd>
        </div>
        <div className="detail-fact">
          <dt>Atlas category mappings</dt>
          <dd className="detail-mono">{record.taxonomyIndustryIds.join(', ')}</dd>
        </div>
      </div>
      {rows.length > 0 ? (
        <div className="bizcommunity-source-rows">
          {rows.map((row) => <SourceRow key={row.sourceRowNumber} row={row} />)}
        </div>
      ) : (
        <p className="assoc-section-note">The normalized record is present; source-row details are not loaded.</p>
      )}
    </section>
  )
}
