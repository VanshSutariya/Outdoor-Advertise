"use client";
import Sidebar from "@/components/admincomponents/sidebar";
import {
  fetchAllRoleChanges,
  fetchRoleChangeRequests,
  updateUserRole,
} from "@/utils/http";
import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const AssignRole = () => {
  const [users, setUsers] = useState<any[]>([]);

  const socket = io("http://localhost:4040");

  useEffect(() => {
    socket.on("roleReq", (val) => {
      console.log("call data", val, val[0]);
      const data = val[0];
      setUsers((prev) => [...prev, data]);
    });

    return () => {
      socket.off("connection");
      socket.off("roleReq");
      socket.off("disconnect");
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resData = await fetchRoleChangeRequests();
        setUsers(resData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateUserRole(id, status);
      setUsers(
        users.map((user) => {
          if (user._id === id) {
            return {
              ...user,
              status: status,
            };
          }
          return user;
        })
      );
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  console.log(users, "users");

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
                <th className="px-6 py-3 font-poppins text-left text-md font-medium text-gray-500 tracking-wider">
                  Assign Role
                </th>
                <th className="px-6 py-3 font-poppins text-left text-md font-medium text-gray-500 tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 font-poppins text-left text-md font-medium text-gray-500 tracking-wider">
                  Permission
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users &&
                users.map((user) => (
                  <tr key={user._id} className="font-poppins">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-full"
                            src={
                              user.user?.image !== undefined
                                ? user.user.image
                                : "/profile.png"
                            }
                            alt={`${user.user.name}'s avatar`}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.user.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {user.user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {user.user.role}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 ">
                        {user.reqRole}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`text-sm ${
                          user.status === "approved"
                            ? "bg-green-500"
                            : user.status === "rejected"
                            ? "bg-red-500"
                            : "bg-yellow-500"
                        } p-1 py-[6px]  rounded-xl text-white text-center`}
                      >
                        {user.status}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 ">
                        {user.status === "pending" && (
                          <>
                            <button
                              onClick={() => {
                                handleStatusChange(user._id, "approved");
                              }}
                            >
                              <img
                                src="/correct.png"
                                alt=""
                                className="h-12 w-12 hover:scale-110 active:scale-95"
                              />
                            </button>
                            <button
                              onClick={() => {
                                handleStatusChange(user._id, "rejected");
                              }}
                            >
                              <img
                                src="/cancel.png"
                                alt=""
                                className="h-12 w-12 hover:scale-110 active:scale-95"
                              />
                            </button>
                          </>
                        )}
                        {user.status !== "pending" && <p> Answered </p>}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </Sidebar>
  );
};

export default AssignRole;
