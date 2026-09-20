import Header from "../components/Header";
import Footer from "../components/Footer";
import ContactBubble from "../components/ContactBubble";
import { getSiteContent } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const content = await getSiteContent();

  return (
    <>
      <Header brandName={content.brand.name} />
      <main className="min-h-screen pt-24">{children}</main>
      <Footer content={content} />
      <ContactBubble
        email={content.contact.email}
        phone={content.contact.phone}
        whatsapp={content.contact.whatsapp}
        instagram={content.socials.instagram}
        donateHref="/faire-un-don"
        brandName={content.brand.shortName || content.brand.name}
        labels={content.bubble}
      />
    </>
  );
}
