"use client";
import Sidebar from "@/components/admincomponents/sidebar";
import { Allusers, fetchUsers } from "@/utils/http";
import React, { useEffect, useState } from "react";
const UserTable = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageNumbers, setPageNumbers] = useState<number[]>([]);
  const [tp, setTp] = useState<number>();

  let isPageOutOfRange: boolean;
  let per_page: number = 8;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resData = await Allusers();
        const totalPages = Math.ceil(resData / 8);
        setTp(totalPages);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resData = await fetchUsers({ page, per_page });
        setUsers(resData);

        let pageNumbers: number[] = [];
        const offsetNumber: number = 2;
        isPageOutOfRange = page >= tp;

        for (let i = page - offsetNumber; i <= page + offsetNumber; i++) {
          if (i >= 1 && i <= tp) {
            pageNumbers.push(i);
          }
        }
        setPageNumbers(pageNumbers);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [page, tp]);

  const handlePrevClick = () => {
    setPage(page - 1);
  };

  const handleNextClick = () => {
    setPage(page + 1);
  };

  const handlePagebutton = (pageNumber: number) => {
    setPage(pageNumber);
  };

  return (
    <Sidebar>
      <div className="overflow-x-auto">
        <div>
          <h1 className="text-2xl font-inter p-3 md:mb-3 font-semibold ">
            Users
          </h1>
        </div>
        <div className="rounded-lg overflow-hidden border border-gray-300">
          <table className="table-auto min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 font-poppins text-left text-md font-medium text-gray-500 tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 font-poppins text-left text-md font-medium text-gray-500 tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 font-poppins text-left text-md font-medium text-gray-500 tracking-wider">
                  Role
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.email}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={
                            user.image !== undefined
                              ? user.image
                              : "/profile.png"
                          }
                          alt={`${user.name}'s avatar`}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.role}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex justify-center gap-2 mb-5 ">
        {isPageOutOfRange ? (
          <div>No more pages...</div>
        ) : (
          <div className="flex justify-center items-center mt-16">
            <div className="flex border-[2px] gap-4 rounded-[10px] border-black p-2">
              {page === 1 ? (
                <div className="opacity-60" aria-disabled="true">
                  Previous
                </div>
              ) : (
                <button
                  className="font-semibold"
                  onClick={handlePrevClick}
                  aria-label="Previous Page"
                >
                  Previous
                </button>
              )}

              {pageNumbers.map((pageNumber: number, index: number) => (
                <button
                  key={index}
                  className={
                    page === pageNumber
                      ? "bg-gray-800 fw-bold px-2 rounded-md text-white "
                      : "hover:bg-gray-800 hover:text-white px-1 rounded-md "
                  }
                  onClick={() => handlePagebutton(pageNumber)}
                >
                  {pageNumber}
                </button>
              ))}

              {page === tp ? (
                <div className="opacity-60" aria-disabled="true">
                  Next
                </div>
              ) : (
                <button
                  className="font-semibold"
                  onClick={handleNextClick}
                  aria-label="Next Page"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </Sidebar>
  );
};

export default UserTable;
