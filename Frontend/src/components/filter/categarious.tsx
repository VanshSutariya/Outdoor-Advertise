"use client";

import { useSearchParams } from "next/navigation";

import Container from "./container";
import CategoryBox from "./categaryBox";
import Airport, {
  Billboard,
  Buildings,
  BusStands,
  Buses,
  FootOverBridges,
  Poles,
  Railway,
  Rickshaws,
  ShoppingMalls,
} from "./images";

export const categories = [
  {
    label: "Airports",
    icon: Airport,
    description: "Advertisement on Airports.",
  },
  {
    label: "Billboard",
    icon: Billboard,
    description: "This property is has windmills!",
  },
  {
    label: "RailwayPlatforms",
    icon: Railway,
    description: "Advertisement on Railway Platforms.",
  },
  {
    label: "Shopping Malls",
    icon: ShoppingMalls,
    description: "Advertisement in shopping malls!",
  },

  {
    label: "FootOverBridges",
    icon: FootOverBridges,
    description: "Advertisement on FottOverBridges",
  },
  {
    label: "Poles",
    icon: Poles,
    description: "Advertisement on poles.",
  },
  {
    label: "Buses",
    icon: Buses,
    description: "Advertisement on Buses.",
  },
  {
    label: "Rickshaws",
    icon: Rickshaws,
    description: "Advertisement on local Rickshaws.",
  },
  {
    label: "BusStands",
    icon: BusStands,
    description: "Advertisement on Government BusStands.",
  },
  {
    label: "Buildings",
    icon: Buildings,
    description: "Advertisement on buildings.",
  },
];

const Categories = () => {
  const params = useSearchParams();
  const category = params?.get("category");

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
