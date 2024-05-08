"use client";
import Sidebar from "@/components/admincomponents/sidebar";
import MemberPosterDetails from "@/components/dashboard/memberPosterDetails";

const PosterSlugPage: React.FC<{ params: { posterId: any } }> = ({
  params,
}): { params: { posterId: any } } => {
  const id = params.posterId[0];
  return (
    <Sidebar>
      <MemberPosterDetails id={id as string} />
    </Sidebar>
  );
};
export default PosterSlugPage;
