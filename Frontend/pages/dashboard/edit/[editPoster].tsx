import { useRouter } from 'next/router';
import PosterForm from '../../../components/CreatePoster/posterForm';
import Sidebar from '../../../components/admincomponents/sidebar';

export default function EditPosterId() {
  const router = useRouter();
  const id: string | string[] | undefined = router.query.editPoster;

  return (
    <>
      <Sidebar>
        <PosterForm id={id as string} />
      </Sidebar>
    </>
  );
}
