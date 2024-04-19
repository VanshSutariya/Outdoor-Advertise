import Footer from "../../components/Footer";
import PosterDetails from "../../components/Poster-Details/poster-details";
import NavBar from "../../components/Header";
import { useRouter } from "next/router";

const PosterSlugPage = () => {
  const router = useRouter();
  const id: string | string[] | undefined = router.query.posterSlug;

  return (
    <main className="overflow-auto">
      <NavBar />
      <PosterDetails id={id as string} />

      <Footer />
    </main>
  );
};
export default PosterSlugPage;
