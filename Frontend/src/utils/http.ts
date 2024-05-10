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
  const resData = await fetch(`http://localhost:4000/poster/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return resData;
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
//-------------------------------------------------------------------------------------------
export async function fetchAllPoster(
  page: number,
  per_page: number,
  id?: string,
  location?: string,
  state?: string,
  city?: string,
  mediatype?: string
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

  const queryString = new URLSearchParams(queryParams).toString();

  url = `http://localhost:4000/poster?${queryString}&price=`;
  console.log(url);

  const resData = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const posters = await resData.json();
  console.log(posters);

  if (!resData.ok)
    throw new Error(
      "No poster found. Please search by different location, city, state or mediatype."
    );
  return posters;
}
//----------------------------------------------------------------------
export async function fetchOnePoster(id: string): Promise<any> {
  const resData = await fetch(`http://localhost:4000/poster/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!resData.ok) throw new Error("Poster doesn't Exists Ø.");
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

export async function fetchAllBookingsData(): Promise<{
  totalRevenue: number;
  todayRevenue: number;
  yearlyRevenue: number[];
}> {
  const resData = await fetch(`http://localhost:4000/booking/data`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const bookings = await resData.json();
  return bookings;
}

export async function fetchMonthlyData(id?: string) {
  let url = "http://localhost:4000/booking/currMonthData/";
  if (id) {
    url += id;
  }
  console.log(url);

  const resData = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
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
  const countUsers = users.length;
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

  const users = await resData.json();
  console.log(users);
  return users;
}
export async function Allusers(token: string): Promise<number> {
  const resData = await fetch(`http://localhost:4000/auth`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const users = await resData.json();
  return users.length;
}

export async function fetchRoleChangeRequests() {
  const data = await fetch(
    `http://localhost:4000/userRoleChange?status=pending`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );
  const newData = await data.json();
  return newData;
}
export async function fetchAllRoleChanges() {
  const data = await fetch(
    `http://localhost:4000/userRoleChange?status=pending`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );
  const newData = await data.json();
  return newData.length;
}
export async function updateUserRole(id: string, status: string) {
  const data = await fetch(`http://localhost:4000/userRoleChange/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
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
}: {
  page: number;
  per_page: number;
}): Promise<any[]> {
  const resData = await fetch(
    `http://localhost:4000/booking?page=${page}&per_page=${per_page}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );
  const orders = await resData.json();
  if (!resData.ok) throw new Error("Please place some orders.");
  return orders;
}

export async function fetchMemberPosterStats(id: string): Promise<{
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
      headers: { "Content-Type": "application/json" },
    }
  );
  const bookings = await resData.json();
  return bookings;
}
