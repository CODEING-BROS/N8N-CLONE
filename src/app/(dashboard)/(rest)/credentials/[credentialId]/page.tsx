import { requiredAuth } from "@/lib/auth-utils";
interface PageProps {
    params: Promise<{
        credentialId: string;
    }>
};

const Page = async ({params}: PageProps) => {

    await requiredAuth();
    
    const {credentialId} = await params;
    return (
        <p>Credential ID: {credentialId}</p>
    )
}

export default Page;