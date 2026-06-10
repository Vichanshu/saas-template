import React from 'react'
import { SignOutButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"



function dashboard() {
  return (
    <div>
        dashboard
        <SignOutButton>
      <Button>Logout</Button>
    </SignOutButton>
    </div>
  )
}

export default dashboard