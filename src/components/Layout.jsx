import Sidebar from './Sidebar'
import Header from './Header'

export default function Layout({ children, title, subtitle }) {
  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Header title={title} subtitle={subtitle} />
        <main style={{
          flex: 1,
          overflow: 'auto',
          padding: 20,
        }}>
          {children}
        </main>
      </div>
    </div>
  )
}
