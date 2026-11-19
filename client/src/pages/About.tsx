import Reveal from "@/components/Reveal"
import {
  ShoppingBag,
  ShieldCheck,
  Users,
  ShoppingCart,
  MonitorSmartphone,
  ArrowRight,
} from "lucide-react"
import { Link } from "react-router"

const FEATURES = [
  {
    icon: ShoppingBag,
    title: "Fashion & Accessories",
    description:
      "Explore a variety of fashion products and accessories to match your personal style.",
  },
  {
    icon: ShoppingCart,
    title: "Easy Shopping",
    description:
      "Browse products, add your favorite items to the cart, and manage your shopping easily.",
  },
  {
    icon: ShieldCheck,
    title: "Simple Ordering",
    description:
      "Enjoy a straightforward ordering process designed to make shopping convenient.",
  },
  {
    icon: MonitorSmartphone,
    title: "Responsive Design",
    description:
      "Access our online shop comfortably from desktops, tablets, and smartphones.",
  },
]

const TEAM_MEMBERS = [
  { name: "Member 1", role: "Team Member" },
  { name: "Member 2", role: "Team Member" },
  { name: "Member 3", role: "Team Member" },
  { name: "Member 4", role: "Team Member" },
  { name: "Member 5", role: "Team Member" },
  { name: "Member 6", role: "Team Member" },
]

const About = () => {
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <Reveal>
        <section className="relative overflow-hidden bg-muted">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-20">
            <div className="space-y-5">
              <span className="text-sm font-semibold tracking-[0.2em] text-purple-600 uppercase">
                Get to know us
              </span>

              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                About <span className="text-purple-600">Team Hex</span>
              </h1>

              <p className="max-w-lg text-base leading-8 text-muted-foreground">
                Style made simple, shopping made easy. Discover our story, our
                passion, and the team behind your online shopping experience.
              </p>

              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-lg bg-black px-6 py-3 font-medium text-white transition hover:bg-zinc-600"
              >
                Explore Products
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div>
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1000"
                alt="Fashion clothing store"
                className="h-72 w-full rounded-2xl object-cover shadow-lg sm:h-80"
              />
            </div>
          </div>
        </section>
      </Reveal>

      {/* Our Story */}
      <Reveal>
        <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2">
          <div className="space-y-5">
            <span className="text-sm font-semibold tracking-widest text-purple-600 uppercase">
              Our Story
            </span>

            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              A Project Built with Passion and Teamwork
            </h2>

            <p className="leading-8 text-muted-foreground">
              Team Hex Shop is an online fashion shopping platform developed by
              a team of six students as part of our school project.
            </p>

            <p className="leading-8 text-muted-foreground">
              We combine our creativity and technical knowledge to build a
              practical e-commerce website. Our goal is to make online shopping
              simple, convenient, and enjoyable for everyone. Through this
              project, we apply our web development skills and grow together as
              developers.
            </p>
          </div>

          <div>
            <img
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1000"
              alt="Fashion shopping"
              className="h-72 w-full rounded-2xl object-cover sm:h-80"
            />
          </div>
        </section>
      </Reveal>

      {/* What We Offer */}
      <Reveal>
        <section className="bg-muted py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-10 text-center">
              <span className="text-sm font-semibold tracking-widest text-purple-600 uppercase">
                What We Offer
              </span>

              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                Shopping Made Simple
              </h2>

              <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
                We focus on providing a convenient and enjoyable shopping
                experience through our platform.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((feature) => {
                const Icon = feature.icon

                return (
                  <div
                    key={feature.title}
                    className="rounded-xl border bg-card p-6 transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                      <Icon className="h-6 w-6" />
                    </div>

                    <h3 className="mb-3 font-semibold">{feature.title}</h3>

                    <p className="text-sm leading-7 text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      </Reveal>

      {/* Team Section */}
      <Reveal>
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="mb-10 text-center">
            <span className="text-sm font-semibold tracking-widest text-purple-600 uppercase">
              Meet Our Team
            </span>

            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Six Members, One Vision
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Six students working together, sharing ideas, and building Team
              Hex Shop.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
            {TEAM_MEMBERS.map((member) => (
              <div
                key={member.name}
                className="rounded-xl border bg-card p-5 text-center transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                  <Users className="h-8 w-8" />
                </div>

                <h3 className="font-semibold">{member.name}</h3>

                <p className="mt-1 text-xs text-muted-foreground">
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </section>
      </Reveal>
    </div>
  )
}

export default About
