import { useRouter } from 'next/router';
import Sidebar from '../../../components/admincomponents/sidebar';
import MemberPosterDetails from '../../../components/dashboard/memberPosterDetails';

const PosterSlugPage = () => {
  const router = useRouter();
  const id: string | string[] | undefined = router.query.posterId;

  return (
    <Sidebar>
      <MemberPosterDetails id={id as string} />
    </Sidebar>
  );
};
export default PosterSlugPage;
