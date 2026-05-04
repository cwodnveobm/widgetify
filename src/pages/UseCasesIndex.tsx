import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { LANDING_PAGES } from "@/data/landingPages";

export default function UseCasesIndex() {
  return (
    <>
      <SEOHead
        title="Widgetify Use Cases — Chat & Lead Widgets by Industry"
        description="Tailored chat, popup and lead-capture widgets for SaaS, e-commerce, agencies, restaurants, real estate, healthcare, education and creators."
        keywords="widget use cases, chat widget by industry, lead capture widgets"
      />
      <Navigation />
      <main className="min-h-screen container mx-auto px-4 py-16 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Widgets for every industry</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Pick your use case and ship a tailored widget in minutes.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {LANDING_PAGES.map((p) => (
            <Link key={p.slug} to={`/use-cases/${p.slug}`}>
              <Card className="h-full hover:shadow-lg transition-shadow hover:border-primary/50">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-2">{p.industry}</h2>
                  <p className="text-sm text-muted-foreground mb-4">{p.hero.subheadline}</p>
                  <Button variant="ghost" size="sm" className="px-0">
                    Explore <ArrowRight className="ml-1 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
