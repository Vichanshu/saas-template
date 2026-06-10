"use client"
import { useSignUp } from "@clerk/nextjs";
import React from 'react'
import { useState } from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {Card,CardContent,CardFooter,CardHeader,CardTitle} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Button} from "@/components/ui/button"
import {Alert,AlertDescription} from "@/components/ui/alert"
import {Eye,EyeOff} from "lucide-react"

function SignUp() {
    const router = useRouter()


    const {signUp,fetchStatus}=useSignUp()

    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [verifying,setVerifying] = useState(false)
    const [error,setError] = useState("")
    const [code,setCode] = useState("")
    const [showPassword,setShowPassword] = useState(false)

    const isFetching = fetchStatus === "fetching"

    function getErrorMessage(error: unknown){
        if (typeof error !== "object" || error === null) {
            return "Something went wrong"
        }

        const clerkError = error as {
            errors?: Array<{ longMessage?: string; message?: string }>
            longMessage?: string
            message?: string
        }

        return clerkError.errors?.[0]?.longMessage ?? clerkError.errors?.[0]?.message ?? clerkError.longMessage ?? clerkError.message ?? "Something went wrong"
    }

    async function handleSubmit (e:React.FormEvent) {
        e.preventDefault()
        setError("")

        if (!signUp) {
            setError("Sign up is still loading. Please try again.")
            return
        }

        try {
            const createResult = await signUp.create({
                emailAddress:email,
                password:password
            })

            if (createResult?.error) {
                setError(getErrorMessage(createResult.error))
                return
            }

            const sendResult = await signUp.verifications.sendEmailCode()

            if (sendResult?.error) {
                setError(getErrorMessage(sendResult.error))
                return
            }

            setVerifying(true)

        } catch (error: unknown) {
            console.log("Error: ",error)
            setError(getErrorMessage(error))
        }
    }

    async function handleEmailVerification (e:React.FormEvent) {
        e.preventDefault()
        setError("")

        if (!signUp) {
            setError("Sign up is still loading. Please try again.")
            return
        }

        try {
            const result = await signUp.verifications.verifyEmailCode({ code })

            if (result?.error) {
                setError(getErrorMessage(result.error))
                return
            }

            if (signUp.status === "complete") {
                await signUp.finalize({
                    navigate: ({ decorateUrl }) => {
                        router.push(decorateUrl("/dashboard"))
                    },
                })
                return
            }

            setError("Verification is not complete yet. Please check the code and try again.")
        }
        catch(error: unknown){
            console.log("Error: ",error)
            setError(getErrorMessage(error))
        }

    }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050505] px-4 py-10 text-white">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.07)_1px,transparent_1px)] bg-[size:56px_56px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),transparent_34%),linear-gradient(to_bottom,rgba(5,5,5,0.15),#050505_78%)]" />

      <section className="relative z-10 w-full max-w-md">


        <Card className="w-full border-white/12 bg-white/[0.07] py-0 text-white shadow-2xl shadow-black/50 ring-white/15 backdrop-blur-2xl">
          <CardHeader className="space-y-3 border-b border-white/10 px-6 py-6 text-center">
            <CardTitle className="text-2xl font-semibold tracking-normal text-white">
              {verifying ? "Check your email" : "Create your account"}
            </CardTitle>
            <p className="text-sm leading-6 text-white/58">
              {verifying
                ? `Enter the code sent to ${email || "your inbox"}.`
                : "Sign up for Todo Master with your email and password."}
            </p>
          </CardHeader>
          <CardContent className="px-6 py-6">
            <div id="clerk-captcha" className="mb-4" />
            {!verifying ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white/75">Email</Label>
                  <Input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="h-11 border-white/12 bg-white/[0.06] text-white placeholder:text-white/32 focus-visible:border-white/35 focus-visible:ring-white/15"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white/75">Password</Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a password"
                      className="h-11 border-white/12 bg-white/[0.06] pr-11 text-white placeholder:text-white/32 focus-visible:border-white/35 focus-visible:ring-white/15"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-white/45 transition hover:bg-white/10 hover:text-white"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </div>
                </div>
                {error && (
                  <Alert variant="destructive" className="border-red-500/30 bg-red-500/10 text-red-100">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <Button type="submit" className="h-11 w-full bg-white text-black hover:bg-white/88" disabled={isFetching}>
                  {isFetching ? "Signing up..." : "Sign Up"}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleEmailVerification} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="code" className="text-white/75">Verification Code</Label>
                  <Input
                    id="code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Enter verification code"
                    className="h-11 border-white/12 bg-white/[0.06] text-center text-lg tracking-[0.28em] text-white placeholder:text-sm placeholder:tracking-normal placeholder:text-white/32 focus-visible:border-white/35 focus-visible:ring-white/15"
                    required
                  />
                </div>
                {error && (
                  <Alert variant="destructive" className="border-red-500/30 bg-red-500/10 text-red-100">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <Button type="submit" className="h-11 w-full bg-white text-black hover:bg-white/88" disabled={isFetching}>
                  {isFetching ? "Verifying..." : "Verify Email"}
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="justify-center border-white/10 bg-white/[0.03] px-6 py-4">
            <p className="text-sm text-white/52">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="font-medium text-white transition hover:text-white/75"
              >
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </section>
    </main>
  );
}

export default SignUp
