import { headers } from "next/headers";
import { auth } from "./auth";
import  {redirect} from "next/navigation";

export const requiredAuth = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        redirect('/login');
    }

    return session;
}

export const requiredUauth = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (session) {
        redirect('/');
    }

    return session;
}