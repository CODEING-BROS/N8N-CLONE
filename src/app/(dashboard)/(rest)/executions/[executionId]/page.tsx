import { requiredAuth } from "@/lib/auth-utils";

interface PageProps {
    params: Promise<{
        executionId: string;
    }>
};

const Page = async ({params}: PageProps) => {
    
    await requiredAuth();

    const {executionId} = await params;
    return (
        <p>Execution ID: {executionId}</p>
    )
}

export default Page;