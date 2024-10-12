"use client";
import Sidebar from "@/components/admincomponents/sidebar";
import MemberPosterDetails from "@/components/dashboard/memberPosterDetails";

interface PosterSlugPageProps {
  params: { posterId: any };
}
const PosterSlugPage: React.FC<PosterSlugPageProps> = ({
  params,
}): JSX.Element => {
  const id = params.posterId[0];
  return (
    <Sidebar>
      <MemberPosterDetails id={id as string} />
    </Sidebar>
  );
};
export default PosterSlugPage;
