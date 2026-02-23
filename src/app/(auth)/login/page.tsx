import { LoginForm } from "@/features/auth/components/login-form"

import { requiredUauth } from "@/lib/auth-utils"

const Page = async () => {
    await requiredUauth();


  return (
    <LoginForm />
  )
}

export default Page