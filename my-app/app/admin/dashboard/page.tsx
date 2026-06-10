
import React from 'react'
import {prisma} from "../../../lib/prismaClient"
import { SignOutButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"

async function adminDashboard() {
  const users=await prisma.user.findMany()
  console.log(users)

  return (
    <div className='bg-green-600 h-screen w-full text-white p-10 text-center items-center flex flex-col gap-5'>
      {users.map((user) => (
        <div key={user.id}>{user.name}</div>
      ))}
      <SignOutButton>
      <Button>Logout</Button>
    </SignOutButton>
      </div>
  )
}

export default adminDashboard
