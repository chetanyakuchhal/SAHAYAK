import Link from "next/link";

export const metadata = {
  title: "Sahayak",
  description: "Learn how Sahayak makes crowdfunding easy, secure, and impactful.",
};

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-white selection:bg-[#1B6B45]/20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#1B6B45]/5 via-white to-white px-4 pb-20 pt-32 sm:px-6 lg:pt-40">
        {/* Abstract shapes for premium feel */}
        <div className="absolute left-1/2 top-0 -z-10 -translate-x-1/2 blur-3xl xl:-top-6">
          <div className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#1B6B45] to-[#B5E85C] opacity-10" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
        </div>

        <div className="mx-auto max-w-4xl text-center">
          <span className="mb-6 inline-block rounded-full border border-[#1B6B45]/20 bg-[#1B6B45]/5 px-4 py-1.5 text-sm font-semibold tracking-wide text-[#1B6B45]">
            About Sahayak
          </span>
          <h1 className="text-5xl font-extrabold tracking-tight text-[#1A1A1A] sm:text-6xl lg:text-7xl">
            Empowering generosity through <span className="text-[#1B6B45]">crowdfunding.</span>
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-gray-500 sm:text-xl">
            We are on a mission to make fundraising accessible, secure, and impactful. Turn compassion into action with just a few clicks.
          </p>
        </div>
      </section>

      {/* Who We Are & Our Impact (Combined elegant layout) */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:py-32">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          <div className="flex flex-col justify-center">
            <h2 className="mb-6 text-3xl font-bold tracking-tight text-[#1A1A1A] sm:text-4xl">
              Who We Are
            </h2>
            <p className="text-lg leading-relaxed text-gray-600">
              Sahayak is a community-driven crowdfunding platform dedicated to helping individuals, NGOs, and organizations raise funds for meaningful causes. We believe that everyone deserves a chance to overcome financial hurdles, and together, we can make that happen.
            </p>
          </div>
          <div className="flex flex-col justify-center rounded-[32px] bg-[#F9FAFB] p-10 sm:p-14">
            <h2 className="mb-6 text-3xl font-bold tracking-tight text-[#1A1A1A] sm:text-4xl">
              Our Impact
            </h2>
            <p className="text-lg leading-relaxed text-gray-600">
              With thousands of donors and countless campaigns funded, Sahayak has transformed lives by providing vital financial assistance to those in need. Join our mission to spread kindness and be a beacon of hope.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works (Premium Cards) */}
      <section id="how-it-works-section" className="bg-[#1A1A1A] px-4 py-32 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-20 text-center">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#B5E85C]">
              The Process
            </h2>
            <p className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              How It Works
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 lg:gap-12">
            {[
              {
                step: "01",
                title: "Start a Campaign",
                desc: "Create a campaign in minutes and share your story with the world.",
                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              },
              {
                step: "02",
                title: "Receive Donations",
                desc: "Accept secure donations from people all over who care about your cause.",
                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              },
              {
                step: "03",
                title: "Make an Impact",
                desc: "Use the collected funds to create real, lasting change in your community.",
                icon: <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              }
            ].map((item, i) => (
              <div key={i} className="group relative overflow-hidden rounded-[32px] bg-white/5 p-10 ring-1 ring-white/10 transition-all hover:bg-white/10">
                <div className="absolute -right-6 -top-10 text-[120px] font-black text-white/5 transition-all group-hover:text-white/10">
                  {item.step}
                </div>
                <div className="relative z-10">
                  <div className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#B5E85C] text-[#1A1A1A] shadow-lg">
                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      {item.icon}
                    </svg>
                  </div>
                  <h3 className="mb-4 text-2xl font-bold text-white">{item.title}</h3>
                  <p className="text-lg leading-relaxed text-gray-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Get Involved / CTA */}
      <section className="relative overflow-hidden px-4 py-32 text-center sm:px-6">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1B6B45]/10 via-white to-white"></div>
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 text-4xl font-extrabold tracking-tight text-[#1A1A1A] sm:text-5xl">
            Get Involved
          </h2>
          <p className="mb-12 text-xl leading-relaxed text-gray-600">
            Whether you&apos;re looking to start a campaign, donate to a cause, or spread the word, you can make a monumental difference today.
          </p>
          <Link 
            href="/fundraiser-form" 
            className="group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full bg-[#1B6B45] px-10 py-5 text-lg font-bold text-white shadow-[0_8px_30px_rgb(27,107,69,0.3)] transition-all hover:-translate-y-1 hover:shadow-[0_12px_40px_rgb(27,107,69,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B6B45]/50"
          >
            <span className="relative z-10">Start Fundraising</span>
            <svg className="relative z-10 h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            <div className="absolute inset-0 -z-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] transition-transform duration-500 group-hover:translate-x-[100%]"></div>
          </Link>
        </div>
      </section>
    </div>
  );
}
