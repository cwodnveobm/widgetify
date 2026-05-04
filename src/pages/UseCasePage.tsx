import { useParams, Link, Navigate } from "react-router-dom";
import * as Icons from "lucide-react";
import { Navigation } from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { findLandingPage, LANDING_PAGES } from "@/data/landingPages";
import { ArrowRight, CheckCircle2, Quote } from "lucide-react";

export default function UseCasePage() {
  const { slug } = useParams<{ slug: string }>();
  const data = slug ? findLandingPage(slug) : undefined;
  if (!data) return <Navigate to="/use-cases" replace />;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: data.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <SEOHead title={data.title} description={data.description} keywords={data.keywords} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navigation />

      <main className="min-h-screen">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10">
          <div className="container mx-auto px-4 py-20 max-w-5xl text-center">
            <Badge variant="outline" className="mb-4">{data.hero.eyebrow}</Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-6">
              {data.hero.headline}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              {data.hero.subheadline}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Button size="lg" asChild>
                <Link to="/embed-widgets">{data.hero.cta} <ArrowRight className="ml-2 w-4 h-4" /></Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/#generator">See live demo</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Problems */}
        <section className="container mx-auto px-4 py-16 max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
            Built for {data.industry.toLowerCase()} teams that face…
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {data.problems.map((p, i) => (
              <Card key={i} className="border-destructive/20">
                <CardContent className="p-6">
                  <p className="text-base">{p}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="bg-muted/30 py-16">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
              What you get out of the box
            </h2>
            <div className="grid md:grid-cols-3 gap-5">
              {data.features.map((f, i) => {
                const Icon = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[f.icon] ?? Icons.Sparkles;
                return (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="font-semibold mb-2">{f.title}</h3>
                      <p className="text-sm text-muted-foreground">{f.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Use cases */}
        <section className="container mx-auto px-4 py-16 max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Common use cases</h2>
          <div className="grid sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
            {data.useCases.map((u, i) => (
              <div key={i} className="flex items-start gap-2 p-3 rounded-lg border bg-card">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">{u}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonial */}
        <section className="bg-primary/5 py-16">
          <div className="container mx-auto px-4 max-w-3xl text-center">
            <Quote className="w-10 h-10 text-primary mx-auto mb-4" />
            <blockquote className="text-xl md:text-2xl font-medium mb-4 italic">
              "{data.testimonial.quote}"
            </blockquote>
            <p className="text-sm text-muted-foreground">
              — {data.testimonial.author}, {data.testimonial.role}
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="container mx-auto px-4 py-16 max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">FAQ</h2>
          <div className="space-y-4">
            {data.faq.map((f, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">{f.q}</h3>
                  <p className="text-sm text-muted-foreground">{f.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-4 py-20 max-w-4xl">
          <Card className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground border-0">
            <CardContent className="p-10 text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Launch your {data.industry.toLowerCase()} widget today
              </h2>
              <p className="mb-6 opacity-90">No code. One async script. Live in under 5 minutes.</p>
              <Button size="lg" variant="secondary" asChild>
                <Link to="/embed-widgets">{data.hero.cta} <ArrowRight className="ml-2 w-4 h-4" /></Link>
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* Cross-links */}
        <section className="container mx-auto px-4 pb-16 max-w-5xl">
          <h2 className="text-lg font-semibold text-center mb-6">Other use cases</h2>
          <div className="flex flex-wrap justify-center gap-2">
            {LANDING_PAGES.filter((p) => p.slug !== data.slug).map((p) => (
              <Button key={p.slug} variant="outline" size="sm" asChild>
                <Link to={`/use-cases/${p.slug}`}>{p.industry}</Link>
              </Button>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
