"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { FC, useCallback } from "react";
import qs from "query-string";

interface CategoryBoxProps {
  icon: any;
  label: string;
  selected?: boolean;
}

const CategoryBox: FC<CategoryBoxProps> = ({ icon: Icon, label, selected }) => {
  const router = useRouter();
  const params = useSearchParams();

  const handleClick = useCallback(() => {
    let currentQuery = {};

    if (params) {
      currentQuery = qs.parse(params.toString());
    }

    const udpatedQuery: any = {
      ...currentQuery,
      category: label,
    };

    if (params?.get("category") === label) {
      delete udpatedQuery.category;
    }

    const url = qs.stringifyUrl(
      {
        url: "/outdoorAd/",
        query: udpatedQuery,
      },
      { skipNull: true }
    );

    router.push(url);
  }, [label, params, router]);

  return (
    <div
      onClick={handleClick}
      className={`
          flex 
          flex-col 
          items-center 
          justify-center 
          py-2
          msm:px-3
          border-b-4
          hover:text-neutral-800
          transition
          cursor-pointer
          ${
            selected
              ? "border-b-neutral-800 text-neutral-800"
              : "border-transparent text-neutral-500"
          }
        `}
    >
      <Icon size={26} />
      <div className="font-medium text-sm  msm:hidden">{label}</div>
    </div>
  );
};

export default CategoryBox;
