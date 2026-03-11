import { redirect } from "next/navigation"

export default function Home() {
  // Redirect to management portal for demo
  redirect("/management")
}
