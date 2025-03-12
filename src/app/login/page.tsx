'use client'

import { LoginRes } from "@/type"
import { locale } from "@/utils/kit"
import { post } from "@/utils/net"
import { Fieldset, Legend, Field, Label, Input, Button } from "@headlessui/react"
import clsx from "clsx"
import { useRouter } from "next/navigation"
import { ReactPortal, useEffect, useRef, useState } from "react"
import '../../css/glitch.css'
import { ToastContainer, Bounce, toast } from "react-toastify"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import TextPlugin from "gsap/TextPlugin";
import Aurora from "@/components/Aurora/Aurora"
import { Loading } from "@/components/loading"
import FadeContent from "@/components/FadeContent/FadeContent"
import ReactDOM from "react-dom"

const Login = () => {

    const turbulence = useRef<SVGFETurbulenceElement>(null)
    const textRef = useRef<HTMLHeadingElement>(null)

    const passref = useRef<HTMLInputElement>(null)
    const router = useRouter()

    const [username, setUsername] = useState('')
    const [alertUsername, setAlertUsername] = useState(false)
    const [password, setPassword] = useState('')
    const [connected, setConnected] = useState(false)
    const [loading, setLoading] = useState(false)
    const [text, setText] = useState('CONNECTING*TO*WIRED*')
    const [aurora, setAurora] = useState<ReactPortal>()

    gsap.registerPlugin(TextPlugin)

    useEffect(() => {
        setAurora(ReactDOM.createPortal(<div className="w-full absolute top-0 left-0 z-0">
            <div className="fixed noise w-full h-full">
                <Aurora
                    colorStops={["#33faa5", "#09ffde", "#FF3232"]}
                    speed={0.5}
                />
            </div>
        </div>, document.body))
    }, [])

    useGSAP(() => {
        console.log('config gsap animation')
        if (turbulence && turbulence.current) {
            gsap.timeline()
                .to(turbulence.current, {
                    attr: { baseFrequency: `0 0.2` },
                    duration: 0.1,
                })
        }

    }, [])

    const login = () => {
        if (username == '') {
            setAlertUsername(true)
            return
        }
        setLoading(true)
        post<LoginRes>('/auth/login', { username: username, password: password }).then(res => {
            const data = res.data
            if (data.code == 200) {
                localStorage.setItem('token', data.data.token)
                localStorage.setItem('expires', data.data.expires.toString())
                setText('CLICK*TO*ENTER*')
                setConnected(true)
            } else {
                setText(res.data.msg.toUpperCase().replaceAll(' ', '*') + '*')
            }
        })
    }

    return (
        <div className="w-full flex items-center justify-center">
            {aurora}
            <div className="max-w-lg h-[100vh] flex items-center justify-center min-w-lg px-4 z-10">
                <FadeContent blur={true} duration={1000} easing="ease-out" initialOpacity={0}>

                    {
                        loading ? <Loading isLoading text={text} onClick={_ => {
                            if (connected) router.push('/')
                        }} /> : <Fieldset className="ml-2 space-y-6 rounded-xl bg-transparent p-6 sm:p-10">
                            <Legend className=" font-bold text-white text-4xl">Connect to
                                {/* <h1 className="text-4xl ml-2 font-nova"
                                style={{
                                    display: 'inline',
                                    textShadow: '2px 4px 4px rgba(var(--maincolor), 0.65)'
                                }}>{locale('TITLE')}</h1> */}
                            </Legend>
                            <Field>
                                <Label className="text-sm/6 font-medium text-white">
                                    {alertUsername ? locale('LOGIN.USERNAME.ERROR') : locale('LOGIN.USERNAME.SUCCESS')}
                                </Label>
                                <Input
                                    autoFocus
                                    value={username}
                                    placeholder="Username"
                                    disabled={connected}
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
                                        'transition-all duration-300 ease-in disabled:cursor-not-allowed',
                                        'mt-3 block w-full rounded-lg bg-white/5 py-1.5 px-3 text-sm/6 text-white',
                                        'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25',
                                        {
                                            'border border-red-500': alertUsername
                                        }
                                    )}
                                />
                            </Field>
                            <Field>
                                <Label className="text-sm/6 font-medium text-white">{locale('LOGIN.PASSWORD.NORMAL')}</Label>
                                <Input
                                    type="password"
                                    ref={passref}
                                    value={password}
                                    placeholder="Password"
                                    disabled={connected}
                                    onChange={_ => {
                                        setPassword(_.target.value)
                                    }}
                                    onKeyDown={_ => {
                                        if (_.code == 'Enter' && password != '') {
                                            login()
                                        }
                                    }}
                                    className={clsx(
                                        'mt-3 block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white disabled:cursor-not-allowed',
                                        'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
                                    )}
                                />
                            </Field>
                            <Field className='flex flex-col items-center justify-center mt-10'>
                                <Button
                                    disabled={connected}
                                    onClick={login}
                                    className="disabled:cursor-not-allowed loginbtn inline-flex items-center gap-2 rounded-md py-1.5 px-3 text-sm/6 font-semibold focus:outline-none data-[hover]:bg-white/10 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white">
                                    送る
                                </Button>
                                <Button
                                    disabled={connected}
                                    onClick={_ => router.push('/')}
                                    className="disabled:cursor-not-allowed text-gray-400 inline-flex items-center gap-2 rounded-md py-1.5 px-3 text-sm/6 font-semibold focus:outline-none data-[hover]:bg-white/10 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white">
                                    ゲストとして続き
                                </Button>
                            </Field>
                        </Fieldset>
                    }
                </FadeContent>
            </div>
            <div className="mx-2 w-2px bg-white/5" />
            <div className="flex h-[100vh] items-center justify-center z-10">
                {
                    !connected && !loading && <FadeContent blur={true} duration={1000} easing="ease-out" initialOpacity={0}>
                        <h1
                            ref={textRef}
                            className={clsx(
                                "wiredlogo",
                                "text-9xl font-nova mb-50"
                            )}
                            style={{
                                textShadow: '2px 4px 4px rgba(var(--maincolor), 0.65)',
                                filter: 'url(#noise)'
                            }} data-text='LAIN'>LAIN</h1>
                        <svg style={{ display: 'none' }}>
                            <defs>
                                <filter id="noise" colorInterpolationFilters="linearRGB" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse">
                                    <feTurbulence ref={turbulence} type="fractalNoise" baseFrequency="0 0.4" numOctaves="2" seed="2" stitchTiles="stitch" x="0%" y="0%" width="100%" height="100%" result="turbulence" />
                                    <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="20" xChannelSelector="R" yChannelSelector="B" x="0%" y="0%" width="100%" height="100%" result="displacementMap" />
                                </filter>
                            </defs>
                        </svg>
                    </FadeContent>
                }

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