import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomeComponent,
})

function HomeComponent() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>LearnWith Platform v3.0</h1>
      <p>TanStack Start Full-Stack Tooling Foundation Active (Port 3173).</p>
    </main>
  )
}
