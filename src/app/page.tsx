import { requiredAuth } from "@/lib/auth-utils"
import { caller } from "@/trpc/server";
import { LogoutButton } from "./logout";

const Page = async () => {
  await requiredAuth();
  const data = await caller.getUsers();

  return (
    <div className={'text-red-500 flex flex-col items-center justify-center'}>
      Protected Page - You are authenticated!

      <pre className={'bg-gray-100 p-4 rounded m-4'}>
        {JSON.stringify(data, null, 2)}
      </pre>

      <LogoutButton />
    </div>
  )
}

export default Page

