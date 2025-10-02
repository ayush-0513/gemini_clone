import React from 'react'
import AuthForm from '@/components/AuthForm'


export default function AuthPage(){
return (
<div className="min-h-screen flex items-center justify-center">
<div className="w-full max-w-md bg-white dark:bg-slate-800 p-6 rounded shadow">
<h2 className="text-lg font-semibold mb-4">Sign in</h2>
<AuthForm />
</div>
</div>
)
}