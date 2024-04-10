import Image from "next/image";

const BgImage: React.FC = () => {
  return (
    <main className=" bg-black flex ">
      <div className="w-full py-[135px]  pl-20 ">
        <div className="text-white text-3xl font-serif tracking-widest ">
          <p> Outdoor Advertisement </p>
        </div>
        <p className="text-white text-xl tracking-wide">
          Do your First advertise with us
        </p>
      </div>
      <div className="flex items-center  pr-20 ">
        <Image
          className="bg-black "
          src="/newBg.png"
          alt="newBg"
          width={300}
          height={50}
        />
      </div>
    </main>
  );
};
export default BgImage;
