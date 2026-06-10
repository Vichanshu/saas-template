"use client"
import React, { useState } from 'react'
import { Card,CardHeader,CardTitle,CardContent,CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Alert,AlertDescription } from '@/components/ui/alert'
import { Eye,EyeOff } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSignIn } from '@clerk/nextjs'



function SignIn() {
    const router = useRouter()
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [code,setCode] = useState("")
    const [error,setError] = useState("")
    const [showPassword,setShowPassword] = useState(false)
    const [needsClientTrust,setNeedsClientTrust] = useState(false)
    const [clientTrustStrategy,setClientTrustStrategy] = useState<"email_code" | "phone_code" | null>(null)
    const {signIn, fetchStatus} = useSignIn()
    const isFetching = fetchStatus === "fetching"

    function getErrorMessage(error: unknown) {
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

    async function finalizeSignIn() {
        if (signIn.status === "complete" && signIn.createdSessionId) {
            const finalizeResult = await signIn.finalize({
                navigate: ({ decorateUrl }) => {
                    router.push(decorateUrl("/dashboard"))
                },
            })

            if (finalizeResult.error) {
                setError(finalizeResult.error.message)
            }
            return true
        }

        return false
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError("")

        if (!signIn) {
            setError("Sign in is still loading. Please try again.")
            return
        }

        try {
            const result = await signIn.password({
                identifier:email,
                password:password
            })

            if (result.error) {
                setError(result.error.message)
                return;
            }

            if (signIn.status === "needs_client_trust") {
                const hasEmailCode = signIn.supportedSecondFactors.some(
                    (factor) => factor.strategy === "email_code"
                )

                if (hasEmailCode) {
                    const sendResult = await signIn.mfa.sendEmailCode()

                    if (sendResult.error) {
                        setError(sendResult.error.message)
                        return
                    }

                    setClientTrustStrategy("email_code")
                    setNeedsClientTrust(true)
                    setError("Enter the verification code sent to your email.")
                    return
                }

                setError("Client trust verification is required, but no email is available.")
                return
            }

            const finalized = await finalizeSignIn()
            if (!finalized) {
                setError(`Sign in is not complete yet. Current status: ${signIn.status}`)
            }
        } catch (error: unknown) {
            setError(getErrorMessage(error))
        }
    }

    const handleClientTrustVerification = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError("")

        if (!signIn) {
            setError("Sign in is still loading. Please try again.")
            return;
        }

        try {
            let result

            if (clientTrustStrategy === "email_code") {
                result = await signIn.mfa.verifyEmailCode({ code })
            }
            else {
                setError("No verification method selected.")
                return
            }

            if (result.error) {
                setError(result.error.message)
                return
            }

            const finalized = await finalizeSignIn()
            if (!finalized) {
                setError(`Verification finished, but sign in is still not complete. Current status: ${signIn.status}`)
            }
        } catch (error: unknown) {
            setError(getErrorMessage(error))
        }
    }

    const handleBackToPassword = () => {
        setNeedsClientTrust(false)
        setClientTrustStrategy(null)
        setCode("")
        setError("")
        void signIn.reset()
    }

    const handleResendCode = async () => {
        setError("")

        if (!signIn) {
            setError("Sign in is still loading. Please try again.")
            return
        }

        try {
            const result =
                clientTrustStrategy === "email_code"
                    ? await signIn.mfa.sendEmailCode()
                    : clientTrustStrategy === "phone_code"
                        ? await signIn.mfa.sendPhoneCode()
                        : null

            if (!result) {
                setError("No verification method selected.")
                return
            }

            if (result.error) {
                setError(result.error.message)
                return
            }

            setError("A new verification code was sent.")
        } catch (error: unknown) {
            setError(getErrorMessage(error))
        }
    }



    type OAuthStrategy = "oauth_google" | "oauth_github"

    const signUpWithOAuth = async (strategy: OAuthStrategy) => {
        const { error } = await signIn.sso({
            strategy,
            redirectCallbackUrl: "/sso-callback",
            redirectUrl: "/dashboard",
        })

        if (error) {
            console.error(JSON.stringify(error, null, 2))
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
              { "Sign in to your account"}
            </CardTitle>
            <p className="text-sm leading-6 text-white/58">
              { "Sign in to Todo Master with your email and password."}
            </p>
          </CardHeader>
          <CardContent className="px-6 py-6">
            <Button type="button" onClick={() => signUpWithOAuth("oauth_google")}>
                Continue with Google
                </Button>

                <Button type="button" onClick={() => signUpWithOAuth("oauth_github")}>
                Continue with GitHub
                </Button>

            {needsClientTrust ? (
              <form onSubmit={handleClientTrustVerification} className="space-y-4">
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
                  {isFetching ? "Verifying..." : "Verify code"}
                </Button>
                <div className="grid grid-cols-2 gap-3">
                  <Button type="button" className="h-10 border border-white/12 bg-white/[0.06] text-white hover:bg-white/12" onClick={handleBackToPassword}>
                    Back
                  </Button>
                  <Button type="button" className="h-10 border border-white/12 bg-white/[0.06] text-white hover:bg-white/12" onClick={handleResendCode} disabled={isFetching}>
                    Resend
                  </Button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div id="clerk-captcha" className="mb-4" />
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
                <Button type="submit" className="h-11 w-full bg-white text-black hover:bg-white/88" disabled={isFetching} >
                  {isFetching ? "Signing in..." : "Sign in"}
                </Button>
              </form>
             )}

          </CardContent>
          <CardFooter className="justify-center border-white/10 bg-white/[0.03] px-6 py-4">
            <p className="text-sm text-white/52">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="font-medium text-white transition hover:text-white/75"
              >
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </section>
    </main>
  )
}

export default SignIn
