import type { Metadata } from "next";
import PageHeader from "../../components/PageHeader";
import { getSiteContent } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales de l'Association Al Nissa.",
};

export default async function MentionsLegalesPage() {
  const content = await getSiteContent();
  const { legal, contact } = content;

  const Block = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="glass-card p-6 sm:p-8">
      <h2 className="font-display text-2xl text-plum">{title}</h2>
      <div className="mt-3 space-y-1.5 text-[0.95rem] leading-relaxed text-plum/80">{children}</div>
    </div>
  );

  return (
    <>
      <PageHeader kicker="Informations" title="Mentions légales" />
      <section className="container-x py-8">
        <div className="mx-auto grid max-w-3xl gap-5">
          <Block title="Éditeur du site">
            <p><strong className="text-plum">{legal.associationName}</strong></p>
            {legal.address && <p>{legal.address}</p>}
            <p>E-mail : <a className="text-rose-600 hover:underline" href={`mailto:${contact.email}`}>{contact.email}</a></p>
            {contact.phone && <p>Téléphone : {contact.phone}</p>}
            {legal.rna && <p>N° RNA : {legal.rna}</p>}
            {legal.siret && <p>SIRET : {legal.siret}</p>}
          </Block>

          <Block title="Directeur de la publication">
            <p>{legal.publisher || legal.associationName}</p>
          </Block>

          <Block title="Hébergement">
            <p>{legal.host}</p>
          </Block>

          <Block title="Propriété intellectuelle">
            <p>
              L'ensemble des contenus de ce site (textes, logo, visuels) est la propriété de
              l'{legal.associationName} ou de ses partenaires. Toute reproduction sans
              autorisation est interdite.
            </p>
          </Block>

          <Block title="Données personnelles">
            <p>
              Les informations transmises via nos formulaires (contact, bénévolat, dons) sont
              utilisées uniquement dans le cadre des activités de l'association et ne sont jamais
              cédées à des tiers. Conformément au RGPD, vous disposez d'un droit d'accès, de
              rectification et de suppression de vos données en nous écrivant à{" "}
              <a className="text-rose-600 hover:underline" href={`mailto:${contact.email}`}>{contact.email}</a>.
            </p>
          </Block>
        </div>
      </section>
    </>
  );
}
