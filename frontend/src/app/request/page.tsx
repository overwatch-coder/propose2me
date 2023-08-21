'use client'

import { useAppContext } from '@/context/AppContext'
import { redirect } from 'next/navigation'
import React from 'react'

export const metadata = {
  title: 'Design Your Request | PTM',
  description: 'Design your perfect proposal request',
}

const RequestPage = () => {
  const {auth} = useAppContext();
  if(!auth?.email){
    return redirect('/login');
  }

  return (
    <div>RequestPage</div>
  )
}

export default RequestPage