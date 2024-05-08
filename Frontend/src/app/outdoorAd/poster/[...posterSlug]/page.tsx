"use client";
import NavBar from "@/components/Header";
import Footer from "@/components/Footer";
import PosterDetails from "@/components/Poster-Details/poster-details";

const PosterSlugPage: React.FC<{ params: { posterSlug: any } }> = ({
  params,
}): { params: { posterSlug: any } } => {
  const resetToken = params.posterSlug[0];

  return (
    <main className="overflow-auto">
      <NavBar />
      <PosterDetails id={resetToken} />

      <Footer />
    </main>
  );
};
export default PosterSlugPage;
