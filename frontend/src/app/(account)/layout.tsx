import React from 'react'

const AccountLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <main>
        <p>This is the login / register page</p>
        <section>
            {children}
        </section>
    </main>
  )
}

export default AccountLayout