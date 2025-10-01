"use client";

export default function HeroSection() {
  return (
    <section className="bg-brand relative flex min-h-[50vh] w-full flex-col items-center justify-center px-4 pt-5 pb-12 md:pt-15 lg:min-h-[60vh]">
      <div className="pointer-events-none absolute inset-0 flex justify-center">
        <div className="relative mx-auto hidden h-full w-full max-w-7xl md:block">
          <div className="absolute top-0 left-0 h-full w-px bg-[#F4F3EB]" aria-hidden="true"></div>
          <div className="absolute top-0 right-0 h-full w-px bg-[#F4F3EB]" aria-hidden="true"></div>
        </div>
      </div>
      <div className="relative mx-auto flex w-full max-w-7xl flex-col items-center text-center">
        <div className="mx-auto flex w-full max-w-2xl flex-col items-center text-center">
          <h1 className="mb-6 text-3xl font-bold text-gray-900 sm:text-4xl md:text-5xl">
            AI That Speaks to Your Customers Naturally
          </h1>
          <p className="mb-8 text-lg font-normal text-gray-600">
            Deploy AI voice agents to answer calls, book appointments, and support your customers 24/7—no code or call
            center required.
          </p>
          <div className="flex w-full max-w-md">
            <button className="w-full rounded-lg bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
