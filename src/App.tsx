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
import { MurexPage } from './pages/MurexPage'
import { CalypsoPage } from './pages/CalypsoPage'
import { TalentSearchPage } from './pages/TalentSearchPage'
import { ShortlistPage } from './pages/ShortlistPage'
import { SalesforceEcosystemPage } from './pages/SalesforceEcosystemPage'
import { NotFound } from './pages/NotFound'

function AppRoutes() {
  const element = useRoutes([
    { path: '/', element: <HomePage /> },
    { path: '/credit-risk', element: <CreditRiskPage /> },
    { path: '/salesforce', element: <SalesforcePage /> },
    { path: '/murex', element: <MurexPage /> },
    { path: '/calypso', element: <CalypsoPage /> },
    { path: '/talent-search', element: <TalentSearchPage /> },
    { path: '/map', element: <MapPage /> },
    { path: '/segments', element: <SegmentDirectory /> },
    { path: '/segments/:slug', element: <SegmentPage /> },
    { path: '/companies', element: <CompanyDirectory /> },
    { path: '/companies/:slug', element: <CompanyPage /> },
    { path: '/profiles', element: <ProfileDirectory /> },
    { path: '/profiles/:slug', element: <ProfilePage /> },
    { path: '/shortlist', element: <ShortlistPage /> },
    { path: '/markets/salesforce', element: <SalesforceEcosystemPage /> },
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
