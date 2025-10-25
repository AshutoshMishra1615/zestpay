"use client"
import { signInWithPopup } from "firebase/auth"
import { auth, googleProvider } from "../../firebase"
import { FcGoogle } from "react-icons/fc"
import { useRouter } from "next/navigation"

const LoginPage = () => {
  const router = useRouter()

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user
      console.log(user)
      console.log("user logged in")
      console.log("user email : " + user.email)
      console.log("user name : " + user.displayName)
      console.log("user uid : " + user.uid)
      router.push("/dashboard")
    } catch(error) {
      console.log("Login Failed"+error)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative mb-2 bg-white/5 backdrop-blur-xl border text-2xl border-yellow-400/20 rounded-2xl shadow-2xl p-8 sm:p-10 md:p-12 w-full max-w-md text-center">
        <div className="shrink-0 flex justify-center mb-2">
            <a href="#" className="flex items-center justify-center bg-black text-white w-28 py-3 rounded-full font-bold text-2xl">
              {/* The text is reversed in the image, you can use CSS 'transform: scaleX(-1)' or an SVG */}
              <span>zest<span className='text-yellow-300'>pay</span></span>
            </a>
          </div>

        <h1 className="text-4xl font-bold text-white mb-2">Welcome Back</h1>
        <p className="text-gray-400 text-base mb-8">Sign in to your account to continue</p>

        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center w-full px-6 py-3 border border-yellow-400/30 rounded-xl shadow-sm text-base font-semibold text-white bg-white/5 hover:bg-yellow-400/10 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 mb-6 backdrop-blur-sm"
        >
          <FcGoogle className="h-5 w-5 mr-3" />
          Continue with Google
        </button>

        <div className="relative flex items-center my-8">
          <div className="grow border-t border-yellow-400/20"></div>
          <span className="shrink mx-4 text-gray-500 text-sm">or</span>
          <div className="grow border-t border-yellow-400/20"></div>
        </div>

        <p className="text-gray-400 text-sm mb-4">Continue with email</p>

        <button className="w-full px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black rounded-xl text-base font-semibold hover:shadow-lg hover:shadow-yellow-400/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400">
          Continue with Email
        </button>

        <p className="mt-8 text-gray-400 text-sm">
          Don't have an account?{" "}
          <a href="#" className="font-semibold text-yellow-400 hover:text-yellow-300 transition-colors duration-300">
            Sign up
          </a>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
