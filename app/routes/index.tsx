import { createFileRoute } from '@tanstack/react-router'
import { homeSearchSchema } from '@/schemas/searchParams'
import { getCoursesList } from '@/data/courses'
import { HeroSection } from '@/components/home/HeroSection'
import { StandardsStrip } from '@/components/home/StandardsStrip'
import { BentoValuePillars } from '@/components/home/BentoValuePillars'
import { WorkshopCatalog } from '@/components/home/WorkshopCatalog'
import { HowItWorksSection } from '@/components/home/HowItWorksSection'
import { PlatformCapabilities } from '@/components/home/PlatformCapabilities'
import { FaqSection } from '@/components/home/FaqSection'
import { ClosingCtaBanner } from '@/components/home/ClosingCtaBanner'

export const Route = createFileRoute('/')({
  validateSearch: (search) => homeSearchSchema.parse(search),
  loader: async () => {
    const courses = await getCoursesList()
    return { courses }
  },
  head: () => ({
    meta: [
      { title: 'learnwith — Pusat Workshop & Ruang Belajar Terpadu' },
      {
        name: 'description',
        content: 'Platform Pembelajaran Praktik Komputer & AI Interaktif untuk ASN & Profesional',
      },
      { property: 'og:title', content: 'learnwith — Pusat Workshop & Ruang Belajar Terpadu' },
      {
        property: 'og:description',
        content: 'Platform Pembelajaran Praktik Komputer & AI Interaktif untuk ASN & Profesional',
      },
      { property: 'og:type', content: 'website' },
      { property: 'og:image', content: '/learnwith-banner.png' },
    ],
  }),
  component: HomeComponent,
})

function HomeComponent() {
  const { filter } = Route.useSearch()
  const { courses } = Route.useLoaderData()

  return (
    <main className="app-main home-main" id="container-home">
      <HeroSection />
      <StandardsStrip />
      <BentoValuePillars />
      <WorkshopCatalog courses={courses} activeFilter={filter} />
      <HowItWorksSection />
      <PlatformCapabilities />
      <FaqSection />
      <ClosingCtaBanner />
    </main>
  )
}
