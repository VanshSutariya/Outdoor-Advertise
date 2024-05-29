import fetchWrapper from "./fetchWrapper";

export default async function fetchUser(id: string): Promise<any> {
  const resData = await fetch(`http://localhost:4000/auth/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const user = await resData.json();
  if (!resData.ok) throw new Error("user id is not vaid.");
  return user;
}

export async function deletePosterById(id: string): Promise<any> {
  try {
    const result = await fetchWrapper(`/poster/deletePoster/${id}`, {
      method: "PATCH",
    });
    return result;
  } catch (error) {
    console.error("Error on deleting data:", error);
  }
}

export async function fetchAllPosters(id?: string): Promise<any[]> {
  let url = "http://localhost:4000/poster";
  if (id) {
    url = `http://localhost:4000/poster?createdBy=${id}`;
  }
  const resData = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const posters = await resData.json();
  return posters;
}

export async function fetchAllPoster(
  page: number,
  per_page: number,
  id?: string,
  location?: string,
  state?: string,
  city?: string,
  mediatype?: string,
  isPopularClicked?: string
): Promise<any[]> {
  let url: string;
  const queryParams: Record<string, string> = {
    page: page.toString(),
    per_page: per_page.toString(),
  };

  if (id) {
    queryParams["createdBy"] = id;
  }

  if (location !== undefined && location.trim() !== null) {
    queryParams["address"] = location.trim();
  }

  if (state !== undefined && state.trim() !== "") {
    queryParams["state"] = state.trim();
  }

  if (city !== undefined && city.trim() !== "") {
    queryParams["city"] = city.trim();
  }

  if (mediatype !== undefined && mediatype.trim() !== "") {
    queryParams["mediatype"] = mediatype.trim();
  }

  if (isPopularClicked !== undefined && isPopularClicked.trim() !== "") {
    queryParams["isPopularClicked"] = isPopularClicked;
  }

  const queryString = new URLSearchParams(queryParams).toString();

  url = `http://localhost:4000/poster?${queryString}`;

  try {
    const resData = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const posters = await resData.json();

    if (!resData.ok)
      throw new Error("No posters available. Please try again later.");
    return posters;
  } catch (error: any) {
    if (error instanceof TypeError) {
      throw new Error("Network error. Please check your connection.");
    }

    throw new Error(error.message || "An unknown error occurred.");
  }
}

export async function fetchAllPosterStatus(
  page: number,
  per_page: number,
  id: string,
  isActive: string
) {
  let url: string;
  const queryParams: Record<string, string> = {
    page: page.toString(),
    per_page: per_page.toString(),
  };
  if (id) {
    queryParams["createdBy"] = id;
  }

  if (isActive !== undefined) {
    queryParams["isActive"] = isActive;
  }

  const queryString = new URLSearchParams(queryParams).toString();

  url = `http://localhost:4000/poster?${queryString}`;
  console.log(url);

  try {
    const resData = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const posters = await resData.json();

    if (!resData.ok)
      throw new Error(
        "No poster found. Please search by different location, city, state or mediatype."
      );
    return posters;
  } catch (error: any) {
    if (error instanceof TypeError) {
      throw new Error("Network error. Please check your connection.");
    }

    throw new Error(error.message || "An unknown error occurred.");
  }
}

export async function ManagePoster(
  status: string,
  page?: number,
  per_page?: number
): Promise<any> {
  try {
    const resData = await fetch(
      `http://localhost:4000/poster?status=${status}&page=${page}&per_page=${per_page}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!resData.ok) {
      throw new Error("No Poster Available to manage.");
    }
    const poster = await resData.json();
    return poster;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message || "No Poster available to manage.");
  }
}

export async function updatePosterStatus(
  id: string,
  status: string
): Promise<any> {
  try {
    const result = await fetchWrapper(`/poster/status/${id}`, {
      method: "PATCH",
      body: { status: status },
    });
    return result;
  } catch (error) {
    console.error("Error on deleting data:", error);
    throw new Error("Poster doesn't Exists .");
  }
}

export async function fetchOnePoster(id: string | undefined): Promise<any> {
  const resData = await fetch(`http://localhost:4000/poster/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!resData.ok) throw new Error("Poster doesn't Exists .");
  const poster = await resData.json();
  return poster;
}

export async function forgotPassword(email: string): Promise<String> {
  const resData = await fetch("http://localhost:4000/auth/forget-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(email),
  });
  const resp = await resData.json();
  return resp;
}

export async function deleteAllCartData(userId: string): Promise<String> {
  const resData = await fetch(`http://localhost:4000/cart/${userId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  const resp = await resData.json();
  return resp;
}

export async function fetchAllBookingsData(): Promise<any> {
  try {
    const result = await fetchWrapper("/booking/data", {
      method: "GET",
    });
    return result;
  } catch (error) {
    console.error("Some error on getting booking data:", error);
  }
}

export async function fetchMonthlyData(id?: string) {
  let url = "/booking/currMonthData/";
  if (id) {
    url += id;
  }
  try {
    const result = await fetchWrapper(url, {
      method: "GET",
    });
    return result;
  } catch (error) {
    console.error("Some error while getting monthly data:", error);
  }
}

export async function fetchAllUsers(role: string): Promise<number | undefined> {
  try {
    const result = await fetchWrapper(`/auth?role=${role}`, {
      method: "GET",
    });
    return result.result?.length;
  } catch (error) {
    console.error("Some error while getting monthly data:", error);
  }
}
export async function fetchUsers({
  page,
  per_page,
}: {
  page: number;
  per_page: number;
}): Promise<any[]> {
  try {
    const result = await fetchWrapper(
      `/auth?page=${page}&per_page=${per_page}`,
      {
        method: "GET",
      }
    );
    return result;
  } catch (error: any) {
    console.error("Error in fetchUsers:", error);
    throw new Error(
      "An error occurred while fetching users. Please try again later."
    );
  }
}

export async function fetchRoleChangeRequests() {
  try {
    const result = await fetchWrapper("/userRoleChange?status=pending", {
      method: "GET",
    });
    return result;
  } catch (error) {
    console.error("Some error while getting monthly data:", error);
  }
}

export async function fetchAllRoleChanges() {
  try {
    const result = await fetchWrapper("/userRoleChange?status=pending", {
      method: "GET",
    });
    return result.length;
  } catch (error) {
    console.error(error);
  }
}

export async function updateUserRole(id: string, status: string) {
  const data = await fetchWrapper(`/userRoleChange/${id}`, {
    method: "PATCH",
    body: { status },
  });

  return data;
}

export async function sendRoleChangeRequest(_id?: string) {
  const data = await fetch(`http://localhost:4000/userRoleChange`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ _id }),
  });
  const newRoleChangeReq = await data.json();
  console.log(newRoleChangeReq);

  return newRoleChangeReq;
}

export async function UserRoleChangeStatus(userId: any) {
  const data = await fetchWrapper(`/userRoleChange?user=${userId}`, {
    method: "GET",
  });

  return data;
}

export async function fetchAllBookingsOrders({
  page,
  per_page,
}: {
  page: number;
  per_page: number;
}): Promise<any[]> {
  try {
    const resData = await fetchWrapper(
      `/booking?page=${page}&per_page=${per_page}`,
      {
        method: "GET",
      }
    );
    return resData;
  } catch (error) {
    console.error(error);
    throw new Error("Please place some orders.");
  }
}

export async function fetchMemberPosterStats(id: string): Promise<{
  currentYearTotalRevenue: number;
  yearlyRevenue: number[];
  todayEarning: number;
  currentMonthEarning: number;
  totalPosters: number;
}> {
  const resData = await fetchWrapper(`/booking/memberStats/${id}`, {
    method: "GET",
  });

  return resData;
}

export async function updateCart(
  userId: string,
  posterId: string,
  bodyData: any
) {
  const respData = await fetch(
    `http://localhost:4000/cart/${userId}/${posterId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...bodyData }),
    }
  );
  const updatedData = await respData.json();
  console.log(updatedData);

  if (!respData.ok) {
    throw new Error("Cart cant updated.");
  } else {
    return { message: "Cart Successfully updated." };
  }
}

export async function fetchCartData(userId: string) {
  const cartRes = await fetch(`http://localhost:4000/cart?userId=${userId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const cartData = await cartRes.json();
  if (!cartRes.ok) {
    throw new Error("Failed to fetch cart data.");
  }
  return cartData;
}
