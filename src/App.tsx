import { lazy, Suspense, type ReactNode } from 'react'
import { BrowserRouter, useRoutes } from 'react-router-dom'
import { DataProvider } from './context/DataContext'
import { Layout } from './components/layout/Layout'
import { ErrorBoundary } from './components/ui/ErrorBoundary'
import { HomePage } from './pages/HomePage'
import { CreditRiskPage } from './pages/CreditRiskPage'
import { MapPage } from './pages/MapPage'
import { SegmentDirectory } from './pages/SegmentDirectory'
import { SegmentPage } from './pages/SegmentPage'
import { CompanyDirectory } from './pages/CompanyDirectory'
import { CompanyPage } from './pages/CompanyPage'
import { ProfileDirectory } from './pages/ProfileDirectory'
import { ProfilePage } from './pages/ProfilePage'
import { SalesforcePage } from './pages/SalesforcePage'
import { SapErpPage } from './pages/SapErpPage'
import { MurexPage } from './pages/MurexPage'
import { CalypsoPage } from './pages/CalypsoPage'
import { TalentSearchPage } from './pages/TalentSearchPage'
import { SearchBankPage } from './pages/SearchBankPage'
import { ShortlistPage } from './pages/ShortlistPage'
import { SalesforceEcosystemPage } from './pages/SalesforceEcosystemPage'
import { HackathonTalentPage } from './pages/HackathonTalentPage'
import { AccountantsPage } from './pages/AccountantsPage'
import { NotFound } from './pages/NotFound'
import { LoadingSpinner } from './components/ui/LoadingSpinner'

const ContactDirectory = lazy(() =>
  import('./pages/ContactDirectory').then(module => ({ default: module.ContactDirectory })),
)

// Company intelligence pages carry the organization graph; load them on demand.
const CompanyAssociationsPage = lazy(() => import('./pages/CompanyAssociationsPage').then((m) => ({ default: m.CompanyAssociationsPage })))
const OrganizationDirectory = lazy(() => import('./pages/OrganizationDirectory').then((m) => ({ default: m.OrganizationDirectory })))
const OrganizationPage = lazy(() => import('./pages/OrganizationPage').then((m) => ({ default: m.OrganizationPage })))
const IndustriesPage = lazy(() => import('./pages/TaxonomyPages').then((m) => ({ default: m.IndustriesPage })))
const CapabilitiesPage = lazy(() => import('./pages/TaxonomyPages').then((m) => ({ default: m.CapabilitiesPage })))
const QualificationsPage = lazy(() => import('./pages/TaxonomyPages').then((m) => ({ default: m.QualificationsPage })))
const TargetPoolsPage = lazy(() => import('./pages/TargetPoolsPage').then((m) => ({ default: m.TargetPoolsPage })))
const AssignmentsPage = lazy(() => import('./pages/AssignmentsPage').then((m) => ({ default: m.AssignmentsPage })))
const IntelligenceImportPage = lazy(() => import('./pages/IntelligenceImportPage').then((m) => ({ default: m.IntelligenceImportPage })))

function Lazy({ children }: { children: ReactNode }) {
  return <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
}

function AppRoutes() {
  const element = useRoutes([
    { path: '/', element: <HomePage /> },
    { path: '/credit-risk', element: <CreditRiskPage /> },
    { path: '/salesforce', element: <SalesforcePage /> },
    { path: '/hackathons', element: <HackathonTalentPage /> },
    { path: '/accounting-finance', element: <AccountantsPage /> },
    { path: '/sap-erp', element: <SapErpPage /> },
    { path: '/murex', element: <MurexPage /> },
    { path: '/calypso', element: <CalypsoPage /> },
    { path: '/talent-search', element: <TalentSearchPage /> },
    { path: '/search-bank', element: <SearchBankPage /> },
    { path: '/map', element: <MapPage /> },
    { path: '/segments', element: <SegmentDirectory /> },
    { path: '/segments/:slug', element: <SegmentPage /> },
    { path: '/companies', element: <CompanyDirectory /> },
    { path: '/companies/:slug', element: <CompanyPage /> },
    { path: '/profiles', element: <ProfileDirectory /> },
    {
      path: '/contacts',
      element: <Suspense fallback={<LoadingSpinner size="lg" />}><ContactDirectory /></Suspense>,
    },
    { path: '/profiles/:slug', element: <ProfilePage /> },
    { path: '/shortlist', element: <ShortlistPage /> },
    { path: '/markets/salesforce', element: <SalesforceEcosystemPage /> },
    { path: '/company-associations', element: <Lazy><CompanyAssociationsPage /></Lazy> },
    { path: '/organizations', element: <Lazy><OrganizationDirectory /></Lazy> },
    { path: '/organizations/:id', element: <Lazy><OrganizationPage /></Lazy> },
    { path: '/industries', element: <Lazy><IndustriesPage /></Lazy> },
    { path: '/industries/:id', element: <Lazy><IndustriesPage /></Lazy> },
    { path: '/capabilities', element: <Lazy><CapabilitiesPage /></Lazy> },
    { path: '/capabilities/:id', element: <Lazy><CapabilitiesPage /></Lazy> },
    { path: '/qualifications', element: <Lazy><QualificationsPage /></Lazy> },
    { path: '/qualifications/:slug', element: <Lazy><QualificationsPage /></Lazy> },
    { path: '/target-pools', element: <Lazy><TargetPoolsPage /></Lazy> },
    { path: '/search-bank/assignments', element: <Lazy><AssignmentsPage /></Lazy> },
    { path: '/search-bank/assignments/:id', element: <Lazy><AssignmentsPage /></Lazy> },
    { path: '/intelligence/import', element: <Lazy><IntelligenceImportPage /></Lazy> },
    { path: '*', element: <NotFound /> },
  ])
  return element
}

export default function App() {
  return (
    <BrowserRouter>
      <DataProvider>
        <ErrorBoundary>
          <Layout>
            <AppRoutes />
          </Layout>
        </ErrorBoundary>
      </DataProvider>
    </BrowserRouter>
  )
}
