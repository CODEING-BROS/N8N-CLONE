"use client";
// import { requiredAuth } from "@/lib/auth-utils"
import { caller } from "@/trpc/server";
import { LogoutButton } from "./logout";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Page =  () => {
  // await requiredAuth();
  // const data = await caller.getUsers();
  const trpc = useTRPC();
  const {data} = useQuery(trpc.getWorkflows.queryOptions());

  const testAi = useMutation(trpc.testAi.mutationOptions(
    {
      onSuccess: () => {
        toast.success("AI execution triggered!");
      },
      onError: (error) => {
        toast.error("AI execution failed: " + error.message);
      }
    }
  ));

  const create = useMutation(trpc.createWorkflow.mutationOptions({
    onSuccess: () => {
      toast.success("Workflow creation triggered!");
    }
  }));

  return (
    <div className={'text-red-500 flex flex-col items-center justify-center'}>
      Protected Page - You are authenticated!

      <pre className={'bg-gray-100 p-4 rounded m-4'}>
        {JSON.stringify(data, null, 2)}
      </pre>

      {/* <LogoutButton /> */}

      <Button onClick={() => create.mutate()} className={'bg-blue-500 text-white px-4 py-2 rounded'}>
        Create Workflow
      </Button>

      <Button disabled={testAi.isPending} onClick={() => testAi.mutate()} className={'bg-green-500 text-white px-4 py-2 rounded'}>
        Test AI
      </Button>

    </div>
  )
}

export default Page

