// import { useAuth } from "../contexts/Auth.context"
import { useRouter } from "next/router"

export default function BrandLogo() {
    const router = useRouter()
    // const { authenticatedUser: user } = useAuth()

    return (
        <div
            onClick={() => router.push("/")}
            className={`text-2xl sm:text-3xl font-bold cursor-pointer text-indigo-400 relative`}
        >
            cash<span className="text-indigo-600">bar</span>
            <span className="font-light text-sm absolute top-1 -right-12 text-indigo-600">admin</span>
        </div>
    )
}