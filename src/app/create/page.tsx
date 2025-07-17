import { CreationComponent } from "@/app/create/_components/creation-component";
import { getSession } from "@/hooks/get-session";
import { redirect } from "next/navigation";

export default async function CreatePage() {
  const session = await getSession();
  if (!session) return redirect("/sign-in");

  return (
    <div className="container max-w-screen-xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
      <CreationComponent />
    </div>
  );
}
