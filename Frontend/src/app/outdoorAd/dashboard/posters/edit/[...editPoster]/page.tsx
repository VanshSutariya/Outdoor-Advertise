"use client";

import PosterForm from "@/components/CreatePoster/posterForm";
import Sidebar from "@/components/admincomponents/sidebar";

const EditPosterId: React.FC<{ params: { editPoster: any } }> = ({
  params,
}): { params: { editPoster: any } } => {
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
