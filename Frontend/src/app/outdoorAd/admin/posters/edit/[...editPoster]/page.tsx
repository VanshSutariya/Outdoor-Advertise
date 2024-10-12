"use client";

import PosterForm from "@/components/CreatePoster/posterForm";
import Sidebar from "@/components/admincomponents/sidebar";

interface EditPosterId {
  params: { editPoster: any };
}
const EditPosterId: React.FC<EditPosterId> = ({ params }): JSX.Element => {
  const id = params.editPoster[0];
  return (
    <>
      <Sidebar>
        <PosterForm id={id as string} />
      </Sidebar>
    </>
  );
};
export default EditPosterId;
