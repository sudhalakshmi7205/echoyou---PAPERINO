import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import LandingClient from "./_components/LandingClient";

export default async function Home() {
  const { userId } = await auth();

  return <LandingClient isLoggedIn={!!userId} />;
}
