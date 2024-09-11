import './normalise.css'
import './accessibility.css'
import './global.css'
import { LocationProvider, Router } from 'preact-iso'
import { Search } from './components/search'
import { Country } from './components/country'
import { Layout } from './components/layout'

export function App() {

  return (
    <LocationProvider>
      <Layout>
        <Router >
          <Search path="/" /> 
          <Country path="/country/:name" /> 
        </Router>
      </Layout>
    </LocationProvider>
  )
}
