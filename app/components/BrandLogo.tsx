// import { useAuth } from "../contexts/Auth.context"
import { useNavigate } from "react-router-dom"

export default function BrandLogo() {
    const navigate = useNavigate()
    // const { authenticatedUser: user } = useAuth()

    return (
        <div
            onClick={() => navigate("/")}
            className={`text-2xl sm:text-3xl font-bold cursor-pointer text-indigo-400 relative`}
        >
            cash<span className="text-indigo-600">bar</span>
            <span className="font-light text-sm absolute top-1 -right-12 text-indigo-600">admin</span>
        </div>
    )
}