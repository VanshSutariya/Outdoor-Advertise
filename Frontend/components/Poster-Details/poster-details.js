import Image from "next/image";
function PosterDetails() {
  let lat = 23.02436884189762;
  let lng = 72.53198504447938;
  const url = `https://maps.google.com/maps?q=${lat},${lng}&output=embed`;
  return (
    <>
      <div className=" md:flex justify-center">
        <div className="mt-5 md:mr-12 mb-9 ">
          <Image
            src="/poster/poster1.png"
            alt="poster1-image"
            width={350}
            height={400}
          ></Image>
        </div>
        <div className=" ">
          <h1 className=" mt-4 text-4xl tracking-wider font-serif">
            Shivranjani Ahmedabad{" "}
          </h1>
          <table className=" border-spacing-1  table-fixed text-2xl mt-5 mb-5  tracking-wide font-mono">
            <tbody className=" rounded-md">
              <tr className="bg-gray-100">
                <td>Price</td>
                <td>₹2,00,000 /per day</td>
              </tr>
              <tr className="bg-gray-200">
                <td>Size</td>
                <td> 30 X 10</td>
              </tr>
              <tr className="bg-gray-100">
                <td>SFT</td>
                <td>300</td>
              </tr>
              <tr className="bg-gray-200">
                <td>Type</td>
                <td>Back Lighting </td>
              </tr>
              <tr className="bg-gray-100">
                <td>Address</td>
                <td>Shivranjini cross road</td>
              </tr>
              <tr className="bg-gray-200">
                <td>Facing From</td>
                <td>DR Jewels</td>
              </tr>
              <tr className="bg-gray-100">
                <td>Minmun Booking Days</td>
                <td className="pl-5">5</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      {/* IFRAME for google maps  */}
      <div className="rounded-lg mb-10 w-full flex ">
        <iframe width="100%" height="400" src={url}></iframe>
      </div>
    </>
  );
}
export default PosterDetails;
