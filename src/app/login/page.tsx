'use client'

import { LoginRes } from "@/type"
import { useLang } from "@/utils/kit"
import { post } from "@/utils/net"
import { Fieldset, Legend, Field, Label, Input, Button } from "@headlessui/react"
import clsx from "clsx"
import { useRouter } from "next/navigation"
import { useRef, useState } from "react"
import '../../css/glitch.css'
import { ToastContainer, Bounce, toast } from "react-toastify"

const Login = () => {

    const passref = useRef<HTMLInputElement>(null)
    const router = useRouter()

    const [username, setUsername] = useState('')
    const [alertUsername, setAlertUsername] = useState(false)
    const [password, setPassword] = useState('')

    const login = () => {
        if (username == '') {
            setAlertUsername(true)
            return
        }
        post<LoginRes>('/auth/login', { username: username, password: password }).then(res => {
            const data = res.data
            if (data.code == 200) {
                toast.success("connected!")
                localStorage.setItem('token', data.data.token)
                router.push('/')
            }
        })
    }

    return (
        <div className=" w-full flex items-center justify-between">
            <div className="max-w-lg h-[100vh] flex items-center justify-center min-w-lg px-4">
                <Fieldset className="space-y-6 rounded-xl bg-transparent p-6 sm:p-10">
                    <Legend className="text-base/2 font-bold text-white text-4xl">Connect to
                        <h1 className="text-4xl ml-2 font-nova"
                            style={{
                                display: 'inline',
                                textShadow: '2px 4px 4px rgba(var(--maincolor), 0.65)'
                            }}>{useLang('TITLE')}</h1>
                    </Legend>
                    <Field>
                        <Label className="text-sm/6 font-medium text-white">
                            {alertUsername ? useLang('LOGIN.USERNAME.ERROR') : useLang('LOGIN.USERNAME.SUCCESS')}
                        </Label>
                        <Input
                            autoFocus
                            value={username}
                            placeholder="Username"
                            onChange={_ => {
                                if (alertUsername) setAlertUsername(false)
                                setUsername(_.target.value)
                            }}
                            onKeyDown={_ => {
                                if (_.code == 'Enter') {
                                    if (username == '') {
                                        setAlertUsername(true)
                                    } else {
                                        if (passref && passref.current) passref.current.focus()
                                    }
                                }
                            }}
                            className={clsx(
                                'transition-all duration-300 ease-in',
                                'mt-3 block w-full rounded-lg bg-white/5 py-1.5 px-3 text-sm/6 text-white',
                                'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25',
                                {
                                    'border border-red-500': alertUsername
                                }
                            )}
                        />
                    </Field>
                    <Field>
                        <Label className="text-sm/6 font-medium text-white">{useLang('LOGIN.PASSWORD.NORMAL')}</Label>
                        <Input
                            type="password"
                            ref={passref}
                            value={password}
                            placeholder="Password"
                            onChange={_ => {
                                setPassword(_.target.value)
                            }}
                            onKeyDown={_ => {
                                if (_.code == 'Enter' && password != '') {
                                    login()
                                }
                            }}
                            className={clsx(
                                'mt-3 block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white',
                                'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
                            )}
                        />
                    </Field>
                    <Field className='flex items-center justify-center mt-10'>
                        <Button
                            onClick={login}
                            className="loginbtn inline-flex items-center gap-2 rounded-md py-1.5 px-3 text-sm/6 font-semibold focus:outline-none data-[hover]:bg-white/10 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white">
                            送る
                        </Button>
                    </Field>
                </Fieldset>
            </div>
            <ToastContainer
                position="top-center"
                autoClose={1000}
                hideProgressBar={true}
                draggable={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                theme="colored"
                transition={Bounce} />
        </div>

    )
}

export default Login