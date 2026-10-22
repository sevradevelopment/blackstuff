import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page py-24 text-center md:py-32">
      <p className="text-sm uppercase tracking-[0.18em] text-clay">404</p>
      <h1 className="font-display mt-3 text-4xl text-forest md:text-5xl">
        Lehte ei leitud
      </h1>
      <p className="mx-auto mt-4 max-w-md text-charcoal/65">
        See aadress ei ole enam kehtiv või on vale. Mine tagasi avalehele või
        avasta e-pood.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn btn-primary">
          Avalehele
        </Link>
        <Link href="/e-pood" className="btn btn-secondary">
          E-pood
        </Link>
      </div>
    </div>
  );
}
