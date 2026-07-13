import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  PawPrint,
  Calendar,
  Bell,
  FileHeart,
  Shield,
  Smartphone,
} from "lucide-react";

export default function HomePage() {
  const features = [
    {
      icon: PawPrint,
      title: "Pet Profiles",
      description: "Keep all your pets' info organized in one place",
    },
    {
      icon: Calendar,
      title: "Appointments",
      description: "Schedule and track vet visits with Google Calendar sync",
    },
    {
      icon: Bell,
      title: "Smart Reminders",
      description: "Never miss a medication, feeding, or appointment",
    },
    {
      icon: FileHeart,
      title: "Health Records",
      description: "Store vaccinations, lab results, and medical history",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your data is protected with enterprise-grade security",
    },
    {
      icon: Smartphone,
      title: "Access Anywhere",
      description: "Fully responsive - works on desktop, tablet, and phone",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">&#x1F43E;</span>
            <span className="text-xl font-bold text-primary">PawCare</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 px-4 bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="container mx-auto text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Everything your pet needs,
            <span className="text-primary"> all in one place</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            PawCare helps you manage your pet&apos;s health, appointments,
            medications, and daily care routines. Be the best pet parent you
            can be.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/signup">Start Free</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything you need to care for your pets
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="text-center p-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mb-4">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-primary text-white">
        <div className="container mx-auto text-center max-w-2xl">
          <h2 className="text-3xl font-bold mb-4">
            Ready to simplify pet care?
          </h2>
          <p className="text-lg opacity-90 mb-8">
            Join thousands of pet parents who use PawCare to keep their
            furry friends healthy and happy.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/signup">Get Started for Free</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">&#x1F43E;</span>
            <span className="font-semibold text-primary">PawCare</span>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} PawCare. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
