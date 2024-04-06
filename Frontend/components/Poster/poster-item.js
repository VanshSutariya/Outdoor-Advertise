import Link from "next/link";
import Image from "next/image";

import classNamees from "./poster-item.module.css";

export default function PosterItem({ title, image, price }) {
  // return (
  //   <div classNameName={classNamees.meal}>
  //     <header>
  //       <div classNameName={classNamees.image}>
  //         <Image src={image} alt={title} fill />
  //       </div>
  //       <div classNameName={classNamees.headerText}>
  //         <h2>{title}</h2>
  //         {/* <p>₹{price}</p> */}
  //       </div>
  //     </header>
  //     <div classNameName={classNamees.content}>
  //       <div classNameName={classNamees.price}>
  //         <p>₹{price}/per day</p>
  //       </div>
  //       <div classNameName={classNamees.actions}>
  //         <Link href="/poster">View Details</Link>
  //       </div>
  //     </div>
  //   </div>
  // );

  // return (
  //   <div classNameName=" justify-center">
  //     <header>
  //       <div classNameName=" justify-center rounded-xl w-[250px] overflow-hidden">
  //         <img
  //           classNameName="object-cover w-full h-[200px]"
  //           src={image}
  //           alt={title}
  //         />
  //       </div>
  //       <div>
  //         <h2>{title}</h2>
  //       </div>
  //     </header>
  //     <div>
  //       <div>
  //         <p>₹{price}/per day</p>
  //       </div>
  //       <div>
  //         <Link href="/poster">View Details</Link>
  //       </div>
  //     </div>
  //   </div>
  // );

  return (
    <div className=" bg-white rounded-md overflow-hidden drop-shadow-xl w-[310px]">
      <div className="relative">
        <img className="w-full h-[210px]" src={image} alt={title} />
        {/* <div className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 m-2 rounded-md text-sm font-medium">
          Popular
        </div> */}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-medium pb-7 ">{title}</h3>

        <div className="flex items-center justify-between relative">
          <span className="font-semibold text-lg">₹{price}/perDay</span>
          <Link
            href="/poster"
            className="bg-blue-500 hover:bg-blue-700 active:bg-indigo-800 text-white font-bold py-2 px-4 rounded"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
