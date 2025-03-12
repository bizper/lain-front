'use client'

import { LoginRes } from "@/type"
import { locale } from "@/utils/kit"
import { post } from "@/utils/net"
import { Fieldset, Legend, Field, Label, Input, Button } from "@headlessui/react"
import clsx from "clsx"
import { useRouter } from "next/navigation"
import { useRef, useState } from "react"
import { ToastContainer, Bounce, toast } from "react-toastify"

const Fastboot = () => {

    const router = useRouter()

    const [password, setPassword] = useState('')
    const [repeat, setRepeat] = useState('')

    const init = () => {
        if(password !== repeat) {
            toast.error("check your password")
            return
        }
        post<LoginRes>('/auth/init', { username: 'root', password: password }).then(res => {
            const data = res.data
            if (data.code == 200) {
                localStorage.setItem('token', data.data.token)
                localStorage.setItem('expires', data.data.expires.toString())
                toast.success("connected!", {
                    onClose: (reason) => {
                        router.push('/')
                    }
                })
            } else {
                toast.error(data.msg)
            }
        })
    }

    return (
        <div className="w-full flex items-center justify-between">
            <div className="max-w-lg h-[100vh] flex items-center justify-center min-w-lg px-4">
                <Fieldset className="space-y-6 rounded-xl bg-transparent p-6 sm:p-10">
                    <Legend className="text-base/2 font-bold text-white text-4xl">Welcome to
                        <h1 className="text-4xl ml-2 font-nova"
                            style={{
                                display: 'inline',
                                textShadow: '2px 4px 4px rgba(var(--maincolor), 0.65)'
                            }}>{locale('TITLE')}</h1>
                    </Legend>
                    <Field>
                        <Label className="text-sm/6 font-medium text-white">
                            {locale('LOGIN.USERNAME.ROOT')}
                        </Label>
                        <Input
                            disabled
                            autoFocus
                            value={'root'}
                            placeholder="Username"
                            className={clsx(
                                'transition-all duration-300 ease-in',
                                'mt-3 block w-full rounded-lg bg-white/5 py-1.5 px-3 text-sm/6 text-white',
                                'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25',
                                'cursor-not-allowed'
                            )}
                        />
                    </Field>
                    <Field>
                        <Label className="text-sm/6 font-medium text-white">{locale('LOGIN.PASSWORD.ROOT')}</Label>
                        <Input
                            type="password"
                            value={password}
                            placeholder="Password"
                            onChange={_ => {
                                setPassword(_.target.value)
                            }}
                            className={clsx(
                                'mt-3 block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white',
                                'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
                            )}
                        />
                    </Field>
                    <Field>
                        <Label className="text-sm/6 font-medium text-white">{locale('LOGIN.PASSWORD.REPEAT')}</Label>
                        <Input
                            type="password"
                            value={repeat}
                            placeholder="Repeat Password"
                            onChange={_ => {
                                setRepeat(_.target.value)
                            }}
                            className={clsx(
                                'mt-3 block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white',
                                'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
                            )}
                        />
                    </Field>
                    <Field className='flex items-center justify-center mt-10'>
                        <Button
                            onClick={init}
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

export default Fastboot