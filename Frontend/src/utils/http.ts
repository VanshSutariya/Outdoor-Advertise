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
export async function deletePosterById(
  id: string,
  token: string
): Promise<any> {
  const resData = await fetch(
    `http://localhost:4000/poster/deletePoster/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return resData;
}

//-------------------------------------------------------------------------------------------
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
  console.log(url);

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
    throw new Error(
      error.message || "An error occurred while fetching posters."
    );
  }
}

export async function updatePosterStatus(
  id: string,
  status: string,
  token: string
): Promise<any> {
  const resData = await fetch(`http://localhost:4000/poster/status/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status: status }),
  });
  if (!resData.ok) throw new Error("Poster doesn't Exists .");
  const poster = await resData.json();
  return poster;
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

export async function fetchAllBookingsData(token: string): Promise<{
  totalRevenue: number;
  todayRevenue: number;
  yearlyRevenue: number[];
}> {
  const resData = await fetch(`http://localhost:4000/booking/data`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const bookings = await resData.json();
  return bookings;
}

export async function fetchMonthlyData(token: string, id?: string) {
  let url = "http://localhost:4000/booking/currMonthData/";
  if (id) {
    url += id;
  }
  const resData = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const bookings = await resData.json();
  return bookings;
}

export async function fetchAllUsers(
  role: string,
  token: string
): Promise<number> {
  const resData = await fetch(`http://localhost:4000/auth?role=${role}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const users = await resData.json();
  let countUsers = users.result.length;
  // if (countUsers === undefined) {
  //   countUsers = 0;
  // }
  return countUsers;
}

export async function fetchUsers({
  page,
  per_page,
  token,
}: {
  page: number;
  per_page: number;
  token: string;
}): Promise<any[]> {
  try {
    const resData = await fetch(
      `http://localhost:4000/auth?page=${page}&per_page=${per_page}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!resData.ok) {
      let errorMessage = "Failed to fetch users";
      try {
        const errorResponse = await resData.json();
        if (errorResponse && errorResponse.message) {
          errorMessage = errorResponse.message;
        }
      } catch {}
      throw new Error(`${errorMessage}`);
    }

    const users = await resData.json();
    return users;
  } catch (error: any) {
    console.error("Error in fetchUsers:", error);
    throw new Error(
      "An error occurred while fetching users. Please try again later."
    );
  }
}

export async function fetchRoleChangeRequests(token: string) {
  const data = await fetch(
    `http://localhost:4000/userRoleChange?status=pending`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const newData = await data.json();
  return newData;
}

export async function fetchAllRoleChanges(token: string) {
  try {
    const data = await fetch(
      `http://localhost:4000/userRoleChange?status=pending`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const newData = await data.json();
    return newData.length;
  } catch (error) {
    console.error(error);
  }
}

export async function updateUserRole(
  id: string,
  status: string,
  token: string
) {
  const data = await fetch(`http://localhost:4000/userRoleChange/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
  const userRoleUpdates = await data.json();
  console.log(userRoleUpdates);

  return userRoleUpdates;
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
  const data = await fetch(
    `http://localhost:4000/userRoleChange?user=${userId}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );
  const newData = await data.json();
  return newData;
}

export async function fetchAllBookingsOrders({
  page,
  per_page,
  token,
}: {
  page: number;
  per_page: number;
  token: string;
}): Promise<any[]> {
  const resData = await fetch(
    `http://localhost:4000/booking?page=${page}&per_page=${per_page}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const orders = await resData.json();
  if (!resData.ok) throw new Error("Please place some orders.");
  return orders;
}

export async function fetchMemberPosterStats(
  id: string,
  token: string
): Promise<{
  currentYearTotalRevenue: number;
  yearlyRevenue: number[];
  todayEarning: number;
  currentMonthEarning: number;
  totalPosters: number;
}> {
  const resData = await fetch(
    `http://localhost:4000/booking/memberStats/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const bookings = await resData.json();
  return bookings;
}
