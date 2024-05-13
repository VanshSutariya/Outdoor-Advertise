"use client";
import Sidebar from "@/components/admincomponents/sidebar";
import MemberPosterDetails from "@/components/dashboard/memberPosterDetails";
interface PosterId {
  params: { posterId: any };
}
const PosterIdHomePage: React.FC<PosterId> = ({ params }): JSX.Element => {
  const id = params.posterId[0];
  return (
    <Sidebar>
      <MemberPosterDetails id={id as string} />
    </Sidebar>
  );
};
export default PosterIdHomePage;
