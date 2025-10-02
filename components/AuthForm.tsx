'use client'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { fetchCountries } from '@/lib/countries'
import { useAuthStore } from '@/stores/useAuthStore'


const schema = z.object({
country: z.string().nonempty(),
phone: z.string().min(6)
})


type Form = z.infer<typeof schema>


export default function AuthForm(){
const [countries, setCountries] = useState<any[]>([])
const [otpSent, setOtpSent] = useState(false)
const [otp, setOtp] = useState('')
const login = useAuthStore(s => s.login)


const { register, handleSubmit, formState:{errors} } = useForm<Form>({ resolver: zodResolver(schema) })


useEffect(()=>{ fetchCountries().then(setCountries).catch(()=>setCountries([])) },[])


function onSubmit(data:Form){
toast.promise(
new Promise((res)=>{
setTimeout(()=>{ setOtpSent(true); res(true) }, 800)
}),
{ loading: 'Sending OTP...', success: 'OTP sent', error: 'Failed' }
)
}


function verify(){
if (otp === '1234'){
login({ phone: 'verified', country: 'IN' })
toast.success('Logged in')
} else {
toast.error('Invalid OTP. Try 1234')
}
}


return (
<div className="max-w-md mx-auto p-4">
{!otpSent ? (
<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
<div>
<label className="block text-sm">Country</label>
<select {...register('country')} className="w-full p-2 border rounded">
<option value="">Select</option>
{countries.map(c => <option key={c.code} value={c.dial}>{c.name} ({c.dial})</option>)}
</select>
<p className="text-red-500 text-sm">{(errors as any).country?.message}</p>
</div>
<div>
}