"use client";

import { authClient } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export const LogoutButton = () => {
    return (
        <Button className='cursor-pointer' variant={'destructive'} 
            onClick={
                () => {
                    authClient.signOut();
                    toast.success('Logged out successfully!');
                }
            }
        >
            Logout
        </Button>
    )
}