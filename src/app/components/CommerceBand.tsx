import Link from "next/link";
import Reveal from "./Reveal";
import { Icon } from "./Icons";

export default function CommerceBand() {
  return (
    <section className="container-x py-8">
      <Reveal>
        <div className="glass-card flex flex-col items-center gap-6 p-8 sm:flex-row sm:p-10">
          <div className="grid h-20 w-20 shrink-0 place-items-center rounded-3xl bg-gradient-to-br from-rose-400 to-rose-600 text-white shadow-lg shadow-rose-500/30">
            <Icon name="box" width={38} height={38} />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <p className="kicker">Commerçants & partenaires</p>
            <h2 className="mt-2 font-display text-3xl text-plum sm:text-4xl">
              Vos invendus peuvent nourrir
            </h2>
            <p className="mt-2 text-plum/75">
              Boulangeries, épiceries, restaurants… proposez vos denrées en quelques secondes,
              nous venons les collecter pour nos maraudes.
            </p>
          </div>
          <Link href="/commerces" className="btn btn-primary shrink-0">
            <Icon name="box" width={19} height={19} />
            Proposer un don
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
