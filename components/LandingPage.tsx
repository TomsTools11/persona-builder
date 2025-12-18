"use client";

interface LandingPageProps {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {

  return (
    <div className="min-h-screen bg-primary-dark">
      {/* Hero Section */}
      <section className="px-6 pt-16 pb-20">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-surface-light bg-surface px-4 py-2">
            <svg
              className="h-4 w-4 text-accent"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <span className="text-body-sm text-text-secondary">
              AI-Powered Persona Generation
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-display text-white">
            Generate Professional
            <br />
            <span className="text-accent">User Personas</span>
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mt-6 max-w-2xl text-lg text-text-secondary">
            Enter any website URL and receive comprehensive, beautifully
            formatted user personas documenting behaviors, goals, pain points,
            and more.
          </p>

          {/* CTA Button */}
          <button
            onClick={() => onGetStarted()}
            className="mt-10 inline-flex items-center gap-2 rounded-lg bg-accent px-8 py-4 font-medium text-white transition-colors hover:bg-accent-hover"
          >
            Generate Personas
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </button>
        </div>
      </section>

      {/* Preview Section */}
      <section className="px-6 pb-20">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-xl border border-surface-light bg-surface p-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {/* Preview Card 1 */}
              <PreviewCard
                title="YourSite.com"
                subtitle="Brand & Design Style Guide"
                content={
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-accent/20" />
                      <div>
                        <div className="font-medium text-white">Tech-Savvy Taylor</div>
                        <div className="text-body-sm text-text-secondary">Early Adopter</div>
                      </div>
                    </div>
                    <div className="space-y-2 text-body-sm">
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Age Range</span>
                        <span className="text-white">25-34</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Tech Comfort</span>
                        <span className="text-white">Expert</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Role</span>
                        <span className="text-white">Product Manager</span>
                      </div>
                    </div>
                  </div>
                }
              />

              {/* Preview Card 2 */}
              <PreviewCard
                title="2.3 Goals & Motivations"
                content={
                  <div className="space-y-3">
                    <div>
                      <div className="mb-1 text-body-sm font-medium text-white">Primary Goals</div>
                      <ul className="space-y-1 text-body-sm text-text-secondary">
                        <li className="flex items-start gap-2">
                          <span className="text-accent">•</span>
                          Streamline team workflows
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-accent">•</span>
                          Reduce manual data entry
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-accent">•</span>
                          Improve cross-team visibility
                        </li>
                      </ul>
                    </div>
                    <div>
                      <div className="mb-1 text-body-sm font-medium text-white">Success Definition</div>
                      <p className="text-body-sm text-text-secondary">
                        Measurable productivity gains within 30 days
                      </p>
                    </div>
                  </div>
                }
              />

              {/* Preview Card 3 */}
              <PreviewCard
                title="2.4 Pain Points"
                content={
                  <div className="space-y-3">
                    <div>
                      <div className="mb-1 text-body-sm font-medium text-white">Challenges</div>
                      <ul className="space-y-1 text-body-sm text-text-secondary">
                        <li className="flex items-start gap-2">
                          <span className="text-error">•</span>
                          Too many disconnected tools
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-error">•</span>
                          Difficulty tracking progress
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-error">•</span>
                          Manual reporting is tedious
                        </li>
                      </ul>
                    </div>
                    <div>
                      <div className="mb-1 text-body-sm font-medium text-white">Concerns</div>
                      <p className="text-body-sm text-text-secondary">
                        Learning curve for new tools
                      </p>
                    </div>
                  </div>
                }
              />
            </div>

            {/* Page Indicator */}
            <div className="mt-6 flex items-center justify-center gap-2">
              <div className="h-2 w-2 rounded-full bg-accent" />
              <div className="h-2 w-2 rounded-full bg-surface-light" />
              <div className="h-2 w-2 rounded-full bg-surface-light" />
              <span className="ml-2 text-body-sm text-text-secondary">15 pages total</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="border-t border-surface-light px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-h1 text-white">How It Works</h2>
          <p className="mt-3 text-text-secondary">
            Three simple steps to create comprehensive user personas for any website
          </p>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            <StepCard
              number="01"
              title="Enter URL"
              description="Paste any website URL you want to analyze for persona generation"
            />
            <StepCard
              number="02"
              title="AI Analysis"
              description="Our engine extracts content and generates detailed personas automatically"
              hasConnector
            />
            <StepCard
              number="03"
              title="Download PDF"
              description="Get a professional persona document ready to share with your team"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-surface-light px-6 py-20">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-h1 text-white">Everything You Need</h2>
          <p className="mt-3 text-text-secondary">
            Our AI analyzes every aspect of your target audience and documents it professionally
          </p>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
              title="Behavior Patterns"
              description="Understand user habits, routines, and decision-making processes"
            />
            <FeatureCard
              icon={
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              }
              title="Pain Point Analysis"
              description="Identify user frustrations, challenges, and barriers to success"
            />
            <FeatureCard
              icon={
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              }
              title="Goal Mapping"
              description="Define user objectives, motivations, and success criteria"
            />
            <FeatureCard
              icon={
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
              title="Demographics"
              description="Age ranges, locations, roles, and technology proficiency levels"
            />
            <FeatureCard
              icon={
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              }
              title="Interview Guide"
              description="Ready-to-use research questions for user interviews"
            />
            <FeatureCard
              icon={
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              }
              title="Export to PDF"
              description="Download professionally formatted persona documents"
            />
          </div>
        </div>
      </section>

      {/* PDF Output Section */}
      <section className="border-t border-surface-light px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            {/* Left: Feature List */}
            <div>
              <h2 className="text-h1 text-white">Professional PDF Output</h2>
              <p className="mt-3 text-text-secondary">
                Every persona includes comprehensive documentation following
                industry-standard structure, ready to share with your team or clients.
              </p>

              <ul className="mt-8 space-y-4">
                {[
                  "Cover page with brand colors",
                  "Detailed persona profiles",
                  "Behavior patterns and goals",
                  "Pain points and frustrations",
                  "Technology preferences",
                  "Interview guide with questions",
                  "Design implications and insights",
                  "Research recommendations",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/20">
                      <svg
                        className="h-3 w-3 text-accent"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <span className="text-text-secondary">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: PDF Preview */}
            <div className="relative">
              <div className="rounded-xl border border-surface-light bg-white p-6 shadow-2xl">
                <div className="mb-4 text-center">
                  <div className="text-h2 text-primary">User Persona Guide</div>
                  <div className="mt-1 text-body-sm text-text-secondary">Generated by Persona Builder</div>
                </div>
                <div className="mb-4 flex justify-center gap-2">
                  {["#2383E2", "#1F1F1F", "#27C93F", "#FFBD2E"].map((color) => (
                    <div
                      key={color}
                      className="h-6 w-6 rounded"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-3/4 rounded bg-gray-200" />
                  <div className="h-3 w-full rounded bg-gray-200" />
                  <div className="h-3 w-5/6 rounded bg-gray-200" />
                  <div className="h-3 w-2/3 rounded bg-gray-200" />
                </div>
              </div>
              {/* Decorative shadow */}
              <div className="absolute -bottom-4 -right-4 -z-10 h-full w-full rounded-xl bg-accent/10" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-surface-light px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-h1 text-white">Ready to Create Your Personas?</h2>
          <p className="mt-3 text-text-secondary">
            Join designers and product teams who use our tool to understand their users
            quickly and professionally.
          </p>
          <button
            onClick={() => onGetStarted()}
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-accent px-8 py-4 font-medium text-white transition-colors hover:bg-accent-hover"
          >
            Get Started Free
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-surface-light px-6 py-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-2">
            <svg
              className="h-6 w-6 text-accent"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span className="font-medium text-white">Persona Builder</span>
          </div>
          <div className="text-body-sm text-text-secondary">
            Made with <span className="text-error">♥</span> by Tom in Milwaukee, WI
          </div>
        </div>
      </footer>
    </div>
  );
}

// Sub-components

function PreviewCard({
  title,
  subtitle,
  content,
}: {
  title: string;
  subtitle?: string;
  content: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-surface-light bg-primary p-4">
      <div className="mb-3 border-b border-surface-light pb-3">
        <div className="text-body-sm font-medium text-white">{title}</div>
        {subtitle && (
          <div className="text-body-sm text-text-secondary">{subtitle}</div>
        )}
      </div>
      {content}
    </div>
  );
}

function StepCard({
  number,
  title,
  description,
  hasConnector,
}: {
  number: string;
  title: string;
  description: string;
  hasConnector?: boolean;
}) {
  return (
    <div className="relative text-center">
      {/* Connector line */}
      {hasConnector && (
        <div className="absolute left-1/2 top-8 hidden h-px w-full -translate-x-1/2 bg-surface-light md:block" />
      )}

      {/* Number circle */}
      <div className="relative mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-surface-light bg-surface">
        <span className="text-h2 text-accent">{number}</span>
      </div>

      <h3 className="text-h2 text-white">{title}</h3>
      <p className="mt-2 text-body-sm text-text-secondary">{description}</p>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-surface-light bg-surface p-6 text-left transition-colors hover:border-accent/50">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent">
        {icon}
      </div>
      <h3 className="text-h3 text-white">{title}</h3>
      <p className="mt-2 text-body-sm text-text-secondary">{description}</p>
    </div>
  );
}
