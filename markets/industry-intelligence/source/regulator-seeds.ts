import type { DirectorySeedGroup } from './directory-seeds'

export const regulatorSeedGroups: DirectorySeedGroup[] = [
  {
    bodyId: 'body-prudential-authority',
    evidenceUrl: 'https://www.resbank.co.za/content/dam/sarb/what-we-do/statistics/guides/institutional-sector-classification-guide-for-sa/2026/Deposit-taking%20corporations%20(Banks)%20-%20South%20African%20registered%20banks%20-%20Locally%20controlled.pdf',
    sourcePublicationDate: '2026',
    status: 'Confirmed',
    notes: 'Twelve rows from the official 2026 South African registered banks: Locally controlled PDF. These are regulatory-register relationships, not association membership. The PDF prints FIRSTHAND BANK LIMITED; that source spelling is preserved and quarantined rather than silently changed to FirstRand.',
    rows: `
ABSA BANK LTD|Locally controlled registered bank|financial-product-provider|Commercial banking|https://www.absa.co.za/||South Africa|
AFRICAN BANK LIMITED|Locally controlled registered bank|financial-product-provider|Commercial banking|https://www.africanbank.co.za/||South Africa|
BIDVEST BANK LIMITED|Locally controlled registered bank|financial-product-provider|Commercial banking|https://www.bidvestbank.co.za/||South Africa|
CAPITEC BANK|Locally controlled registered bank|financial-product-provider|Commercial banking|https://www.capitecbank.co.za/||South Africa|org-capitec
DISCOVERY BANK LIMITED|Locally controlled registered bank|financial-product-provider|Commercial banking|https://www.discovery.co.za/||South Africa|
FIRSTHAND BANK LIMITED|Locally controlled registered bank|financial-product-provider|Commercial banking; source-name discrepancy|https://www.firstrand.co.za/||South Africa|
INVESTEC BANK LTD|Locally controlled registered bank|financial-product-provider|Commercial banking|https://www.investec.com/||South Africa|
NEDBANK LTD|Locally controlled registered bank|financial-product-provider|Commercial banking|https://www.nedbank.co.za/||South Africa|
OM BANK LIMITED|Locally controlled registered bank|financial-product-provider|Commercial banking|https://www.oldmutual.co.za/||South Africa|
SASFIN BANK LTD|Locally controlled registered bank|financial-product-provider|Commercial banking|https://www.sasfin.com/||South Africa|
THE STANDARD BANK OF S A LTD|Locally controlled registered bank|financial-product-provider|Commercial banking|https://www.standardbank.co.za/||South Africa|
TYME BANK LIMITED|Locally controlled registered bank|financial-product-provider|Commercial banking|https://www.tymebank.co.za/||South Africa|
`
  }
]
