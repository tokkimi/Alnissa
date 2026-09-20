import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center px-4 py-16 text-center">
      <div className="max-w-md">
        <Image
          src="/logo.png"
          alt="Al Nissa"
          width={96}
          height={96}
          className="mx-auto h-24 w-24 rounded-full shadow-soft ring-4 ring-white/60"
        />
        <p className="mt-6 font-display text-7xl text-gradient">404</p>
        <h1 className="mt-2 font-display text-3xl text-plum">Page introuvable</h1>
        <p className="mt-3 text-plum/75">
          Oups, cette page n'existe pas ou a été déplacée.
        </p>
        <Link href="/" className="btn btn-primary mt-8">
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}
