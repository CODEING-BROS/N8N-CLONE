import { RegisterForm } from "@/features/auth/components/register-form"
import { requiredUauth } from "@/lib/auth-utils"

const Page = async () => {
  await requiredUauth();
  return (
        <div>
            <RegisterForm />
        </div>
    )
}

export default Page