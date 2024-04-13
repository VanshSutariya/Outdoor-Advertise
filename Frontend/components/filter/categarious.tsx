"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { SiBillboard, SiHomeassistantcommunitystore } from "react-icons/si";
import { PiBusDuotone } from "react-icons/pi";
import { GiRialtoBridge, GiStreetLight, GiBus } from "react-icons/gi";
import { BsBuildingsFill } from "react-icons/bs";
import { MdTrain, MdLocalAirport, MdElectricRickshaw } from "react-icons/md";

import Container from "./container";
import CategoryBox from "./categaryBox";

export const categories = [
  {
    label: "Airports",
    icon: MdLocalAirport,
    description: "Advertisement on Airports.",
  },
  {
    label: "Billboard",
    icon: SiBillboard,
    description: "This property is has windmills!",
  },
  {
    label: "RailwayPlatforms",
    icon: MdTrain,
    description: "Advertisement on Railway Platforms.",
  },
  {
    label: "BusStands",
    icon: PiBusDuotone,
    description: "Advertisement on Government BusStands.",
  },
  {
    label: "FootOverBridges",
    icon: GiRialtoBridge,
    description: "Advertisement on FottOverBridges",
  },
  {
    label: "Poles",
    icon: GiStreetLight,
    description: "Advertisement on poles.",
  },
  {
    label: "Buses",
    icon: GiBus,
    description: "Advertisement on Buses.",
  },
  {
    label: "Rickshaws",
    icon: MdElectricRickshaw,
    description: "Advertisement on local Rickshaws.",
  },
  {
    label: "Shopping Malls",
    icon: SiHomeassistantcommunitystore,
    description: "Advertisement in shopping malls!",
  },
  {
    label: "Buildings",
    icon: BsBuildingsFill,
    description: "Advertisement on buildings.",
  },
];

const Categories = () => {
  const params = useSearchParams();
  const category = params?.get("category");
  const pathname = usePathname();
  const isMainPage = pathname === "/";

  if (!isMainPage) {
    return null;
  }

  return (
    <Container>
      <div
        className="
            flex 
            flex-row 
            items-center 
            justify-between
            overflow-x-auto
          "
      >
        {categories.map((item) => (
          <CategoryBox
            key={item.label}
            label={item.label}
            icon={item.icon}
            selected={category === item.label}
          />
        ))}
      </div>
    </Container>
  );
};

export default Categories;
