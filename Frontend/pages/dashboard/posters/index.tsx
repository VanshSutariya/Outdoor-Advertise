import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import Sidebar from '../../../components/admincomponents/sidebar';
import { useEffect, useState } from 'react';
import { fetchAllPosters } from '../../../utils/http';
import PosterGrid from '../../../components/Poster/poster-grid';
import ProfileDropDown from '../../../components/admincomponents/profileDropDown';

export default function PosterDetails() {
  const {
    userId,
    userName,
    userRole,
  }: {
    userName: string | null;
    userId: string | null;
    userRole: string | null;
  } = useSelector((state: RootState) => state.auth);

  const [totalPosters, setTotalPosters] = useState(0);
  useEffect(() => {
    const totaldata = async () => {
      const id = userId;
      const response = await fetchAllPosters(id);
      console.log('././././././././././.', response.length);

      setTotalPosters(response.length);
    };
    totaldata();
  }, []);

  return (
    <>
      <Sidebar>
        <div className="flex items-center">
          <div className="w-full text-4xl md:ml-6 mt-3 font-medium font-poppins">
            Your Owned Posters{' '}
          </div>
          <div className="flex  justify-end  w-full mr-6 items-center">
            <ProfileDropDown />
          </div>
        </div>
        <PosterGrid totalLength={totalPosters} id={userId} />
      </Sidebar>
    </>
  );
}
