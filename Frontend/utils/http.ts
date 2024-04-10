export default async function fetchUser(id: string): Promise<string> {
  // console.log(`http://localhost:4000/poster/${id}`);

  const resData = await fetch(`http://localhost:4000/auth/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const user = await resData.json();
  console.log(user);
  return user.name;
}

export async function fetchAllPosters(): Promise<any[]> {
  const resData = await fetch("http://localhost:4000/poster", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const posters = await resData.json();
  return posters;
}

export async function fetchAllPoster({
  page,
  per_page,
}: {
  page: number,
  per_page: number,
}): Promise<any[]> {
  const resData = await fetch(
    `http://localhost:4000/poster?page=${page}&per_page=${per_page}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );
  const posters = await resData.json();
  return posters;
}

export async function fetchOnePoster(id: string): Promise<any> {
  const resData = await fetch(`http://localhost:4000/poster/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const poster = await resData.json();
  return poster;
}
