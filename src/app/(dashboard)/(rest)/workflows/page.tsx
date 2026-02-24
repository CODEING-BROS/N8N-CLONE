import { requiredAuth } from "@/lib/auth-utils";
const Page = async () => {

    await requiredAuth();

    return (
        <p>Workflows</p>
    )
}

export default Page;