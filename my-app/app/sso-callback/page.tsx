"use client"

import { HandleSSOCallback } from "@clerk/react"
import { useRouter } from "next/navigation"

export default function SSOCallbackPage() {
  const router = useRouter()

  return (
    <HandleSSOCallback
      navigateToApp={({ decorateUrl }) => {
        router.push(decorateUrl("/dashboard"))
      }}
      navigateToSignIn={() => router.push("/signin")}
      navigateToSignUp={() => router.push("/signup")}
    />
  )
}