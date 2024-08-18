import type { ApiProfileGet } from "@/app/api/profile/route";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React from "react";
const Home = () => {
  const query = useQuery<ApiProfileGet>({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await fetch("/api/profile");
      return response.json();
    },
  });

  return (
    <div>
      <h1>Home</h1>
      {query.isLoading && <p>Loading...</p>}
      <p>
        Hejka {query.data?.first_name} {query.data?.last_name}
      </p>
      <Link href="/plans">
        <button>Go to Plans</button>
      </Link>
    </div>
  );
};

export default Home;
