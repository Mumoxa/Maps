import { useEffect, useId, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb } from '../components/ui/Breadcrumb'
import { downloadText, PrivateNotice } from '../components/intelligence/IntelBits'
import { useNoIndex } from '../hooks/useNoIndex'
import { useIntelligenceGraph } from '../data/intelligence/useIntelligence'
import { IMPORT_COLUMNS, previewImport, type ImportPreview } from '../data/workspace/importer'
import { commitImport, rollbackImport } from '../data/workspace/operations'
import { useWorkspace, workspaceStoreInfo } from '../data/workspace/useWorkspace'

const TEMPLATE = `${IMPORT_COLUMNS.join(',')}\nExample Company (replace),,cold-chain,primary,cold-storage,observed,probable,https://example.com/source,Company website,company-website,2026-01-01,What the source shows,Western Cape,Cape Town,,\n`

export function IntelligenceImportPage() {
  useNoIndex()
  const graph = useIntelligenceGraph()
  const { workspace, update } = useWorkspace()
  const baseId = useId()
  const [text, setText] = useState('')
  const [fileName, setFileName] = useState('pasted.csv')
  const [preview, setPreview] = useState<ImportPreview | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    document.title = 'SA Talent Map | Import research'
  }, [])

  const committedHashes = useMemo(() => new Set(workspace.imports.filter((row) => row.status === 'committed').map((row) => row.contentHash)), [workspace.imports])
  const canCommit = preview && !preview.fatal && !preview.alreadyImported && preview.summary.accepted + preview.summary.conflicts > 0

  return (
    <div className="page">
      <div className="container">
        <Breadcrumb crumbs={[{ label: 'Home', to: '/' }, { label: 'Organizations', to: '/organizations' }, { label: 'Import research' }]} />
        <div className="page-head">
          <div>
            <h1>Import company research</h1>
            <p>Load CSV or JSON research, review how each row matches existing organizations, then commit it as a private research batch. Nothing is sent to a server.</p>
          </div>
        </div>
        <PrivateNotice description={`${workspaceStoreInfo().description} Committed imports change what this browser shows; they are not published.`} />

        <section className="section-block" aria-labelledby={`${baseId}-load`}>
          <h2 id={`${baseId}-load`}>1. Load a file</h2>
          <p className="intel-muted">
            Columns: {IMPORT_COLUMNS.join(', ')}. Industries and capabilities can be ids, names or synonyms from the taxonomy. A row that claims a capability, industry or
            relationship must cite evidence_url or supports.
          </p>
          <div className="ca-inspector-actions">
            <label htmlFor={`${baseId}-file`} className="btn btn-secondary btn-sm">
              Choose CSV or JSON file
            </label>
            <input
              id={`${baseId}-file`}
              type="file"
              accept=".csv,.json,text/csv,application/json"
              className="sr-only"
              onChange={async (event) => {
                const file = event.target.files?.[0]
                if (!file) return
                setFileName(file.name)
                setText(await file.text())
                setPreview(null)
              }}
            />
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => downloadText('company-research-template.csv', TEMPLATE, 'text/csv')}>
              Download CSV template
            </button>
          </div>
          <label htmlFor={`${baseId}-text`}>Or paste the content</label>
          <textarea id={`${baseId}-text`} className="ca-textarea ca-textarea-tall" value={text} onChange={(event) => setText(event.target.value)} rows={8} />
          <button type="button" className="btn btn-primary btn-sm" disabled={!text.trim()} onClick={() => setPreview(previewImport(graph, text, fileName, new Date().toISOString().slice(0, 10), committedHashes))}>
            Preview import
          </button>
        </section>

        {preview && (
          <section className="section-block" aria-labelledby={`${baseId}-review`}>
            <h2 id={`${baseId}-review`}>2. Review</h2>
            {preview.fatal && <p className="ca-status" role="alert">{preview.fatal}</p>}
            {preview.alreadyImported && <p className="ca-status" role="status">This exact file has already been imported. Nothing new would be added.</p>}
            {!preview.fatal && (
              <>
                <p>
                  {preview.summary.rows} rows: {preview.summary.accepted} new, {preview.summary.conflicts} conflicting with existing evidence, {preview.summary.duplicates} already known,{' '}
                  {preview.summary.rejected} rejected. {preview.summary.newOrganizations} new organizations would be created as unverified.
                </p>
                <div className="data-table-wrap">
                  <table className="data-table">
                    <caption className="sr-only">Import preview by row</caption>
                    <thead>
                      <tr>
                        <th scope="col">Line</th>
                        <th scope="col">Company</th>
                        <th scope="col">Match</th>
                        <th scope="col">Result</th>
                        <th scope="col">Statements</th>
                        <th scope="col">Issues</th>
                      </tr>
                    </thead>
                    <tbody>
                      {preview.rows.map((row) => (
                        <tr key={row.line}>
                          <td className="ca-num">{row.line}</td>
                          <td>{row.organizationId && row.match === 'existing' ? <Link to={`/organizations/${row.organizationId}`}>{row.company}</Link> : row.company}</td>
                          <td>{row.match.replace('-', ' ')}</td>
                          <td className={`intel-import-${row.status}`}>{row.status}</td>
                          <td>{row.statements.join('; ')}</td>
                          <td>{row.issues.join('; ')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  disabled={!canCommit}
                  onClick={() => {
                    const error = update((ws, ctx) =>
                      commitImport(
                        ws,
                        ctx,
                        {
                          id: ctx.newId('import'),
                          fileName: preview.fileName,
                          importedAt: ctx.now,
                          contentHash: preview.contentHash,
                          format: preview.format,
                          rowCount: preview.summary.rows,
                          accepted: preview.summary.accepted,
                          duplicates: preview.summary.duplicates,
                          conflicts: preview.summary.conflicts,
                          rejected: preview.summary.rejected,
                          newOrganizations: preview.summary.newOrganizations,
                          researchBatchId: preview.batch.batchId,
                          status: 'committed',
                        },
                        preview.batch,
                      ),
                    )
                    setMessage(error ?? 'Committed to this browser. The explorer now includes these facts, marked as private.')
                    if (!error) setPreview(null)
                  }}
                >
                  Commit to private workspace
                </button>
              </>
            )}
          </section>
        )}
        {message && (
          <p className="ca-status" role="status">
            {message}
          </p>
        )}

        <section className="section-block" aria-labelledby={`${baseId}-history`}>
          <h2 id={`${baseId}-history`}>Import history ({workspace.imports.length})</h2>
          {workspace.imports.length === 0 ? (
            <p className="intel-muted">No imports in this browser.</p>
          ) : (
            <ul className="intel-target-list">
              {workspace.imports.map((row) => (
                <li key={row.id} className="intel-target">
                  <div className="intel-target-head">
                    <b>{row.fileName}</b>
                    <span className="intel-muted">
                      {row.importedAt.slice(0, 10)} · {row.accepted} new, {row.conflicts} conflicts, {row.duplicates} duplicates, {row.rejected} rejected · {row.status}
                    </span>
                    {row.status === 'committed' && (
                      <button type="button" className="btn btn-ghost btn-sm" onClick={() => update((ws, ctx) => rollbackImport(ws, ctx, row.id))}>
                        Roll back
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}
