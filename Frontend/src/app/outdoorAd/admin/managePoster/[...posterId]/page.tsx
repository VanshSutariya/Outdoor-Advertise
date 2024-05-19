"use client";
import ManagePosterDetails from "@/components/admincomponents/managePoster/managePosterDetails";
import Sidebar from "@/components/admincomponents/sidebar";
import MemberPosterDetails from "@/components/dashboard/memberPosterDetails";

interface PosterSlugPageProps {
  params: { posterId: any };
}
const ManagePosterSlugPage: React.FC<PosterSlugPageProps> = ({
  params,
}): JSX.Element => {
  const id = params.posterId[0];
  return (
    <Sidebar>
      <ManagePosterDetails id={id as string} />
    </Sidebar>
  );
};
export default ManagePosterSlugPage;
