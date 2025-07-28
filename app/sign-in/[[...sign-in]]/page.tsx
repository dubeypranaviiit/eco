import { SignIn } from '@clerk/nextjs'
import { assets } from '@/public/assets/assets'
export default function Page() {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center mt-0"
      style={{ 
              backgroundImage: `url(${assets.signin.src})`,
       }} 
    >
      <SignIn
        appearance={{
          elements: {
            card: "backdrop-blur bg-white/70 shadow-xl border border-gray-200",
          },
        }}
      />
    </div>
  )
}