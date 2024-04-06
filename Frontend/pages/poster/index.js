import DatePicker from "@/components/Poster-Details/date-range-picker";
import Footer from "@/components/Footer";
import PosterDetails from "@/components/Poster-Details/poster-details";
import NavBar from "@/components/Header";

function PosterHomePage({ props }) {
  return (
    <main>
      <NavBar />
      <PosterDetails />
      <div className="justify-center flex">
        <DatePicker />
      </div>
      <Footer />
    </main>
  );
}
export default PosterHomePage;
