import { User } from "@/type"
import { post } from "@/utils/net"
import { Dialog, DialogPanel, DialogTitle, Button, Field, Input, Label, Fieldset, Description, Switch } from "@headlessui/react"
import clsx from 'clsx'
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { toast } from "react-toastify"

type UserEditAttr = {
    user?: User
    open: boolean
    setOpen: Dispatch<SetStateAction<boolean>>
    withPassword?: boolean
}

const UserEdit = (props: UserEditAttr) => {

    const { open, setOpen, user, withPassword } = props

    const [username, setUsername] = useState(user ? user.username : '')
    const [nickname, setNickname] = useState(user ? user.nickname : '')
    const [email, setEmail] = useState(user ? user.email : '')
    const [disabled, setDisabled] = useState(user ? user.disabled : false)
    const [password, setPassword] = useState('')
    const [repeat, setRepeat] = useState('')

    const saveUser = () => {
        if (password !== repeat) {
            toast.error("check your password")
            return
        }
        post<User>('/user/save', { ...user, username: username, nickname: nickname, email: email, disabled: disabled, password: password }).then(res => {

            console.log(res.data)
        })
    }

    useEffect(() => {
        setUsername(user ? user.username : '')
        setNickname(user ? user.nickname : '')
        setEmail(user ? user.email : '')
        setDisabled(user ? user.disabled : false)
        setPassword('')
        setRepeat('')
        return () => {
            setUsername('')
            setNickname('')
            setEmail('')
            setDisabled(false)
            setPassword('')
            setRepeat('')
        }
    }, [user])

    return (
        <Dialog open={open} as="div" className="relative z-10 focus:outline-none" onClose={_ => setOpen(false)}>
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4">
                    <DialogPanel
                        transition
                        className="w-full max-w-md rounded-xl bg-black/30 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
                    >
                        <DialogTitle as="h3" className="text-base/7 font-bold text-white">
                            {
                                user ? `Edit User: ${user.username}` : 'Create User'
                            }
                        </DialogTitle>
                        <div className="my-2 h-px bg-white/5" />
                        <Fieldset>
                            {
                                !user && <Field>
                                    <Label className="text-sm/6 font-medium text-white">Username</Label>
                                    <Input
                                        defaultValue={username}
                                        onChange={e => setUsername(e.target.value)}
                                        className={clsx(
                                            'mt-1 block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white',
                                            'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
                                        )}
                                    />
                                </Field>
                            }
                            <Field>
                                <Label className="text-sm/6 font-medium text-white">Nickname</Label>
                                <Input
                                    defaultValue={nickname}
                                    onChange={e => setNickname(e.target.value)}
                                    className={clsx(
                                        'mt-1 block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white',
                                        'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
                                    )}
                                />
                            </Field>
                            <Field>
                                <Label className="text-sm/6 font-medium text-white">Email</Label>
                                <Input
                                    type="email"
                                    defaultValue={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className={clsx(
                                        'mt-1 block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white',
                                        'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
                                    )}
                                />
                            </Field>
                            <Field className='mt-1 flex items-center justify-between'>
                                <div>
                                    <Label className="text-sm/6 font-medium text-white">Disabled</Label>
                                    <Description className="text-sm/6 text-white/50">{disabled ? 'This user has been banned' : 'This user running normally.'}</Description>
                                </div>
                                <Switch
                                    checked={disabled}
                                    onChange={setDisabled}
                                    className="group relative flex h-5 w-10 cursor-pointer rounded-full bg-white/10 p-1 transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-maincolor"
                                >
                                    <span
                                        aria-hidden="true"
                                        className="pointer-events-none inline-block size-3 translate-x-0 rounded-full bg-white ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-5"
                                    />
                                </Switch>
                            </Field>
                            {
                                withPassword &&
                                <>
                                    <Field>
                                        <Label className="text-sm/6 font-medium text-white">Password</Label>
                                        <Input
                                            type="password"
                                            defaultValue={password}
                                            onChange={e => setPassword(e.target.value)}
                                            className={clsx(
                                                'mt-1 block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white',
                                                'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
                                            )}
                                        />

                                    </Field>
                                    <Field>
                                        <Label className="text-sm/6 font-medium text-white">Repeat Password</Label>
                                        <Input
                                            type="password"
                                            defaultValue={repeat}
                                            onChange={e => setRepeat(e.target.value)}
                                            className={clsx(
                                                'mt-1 block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white',
                                                'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
                                            )}
                                        />
                                    </Field>
                                </>
                            }
                        </Fieldset>
                        <div className="mt-4 flex flex-row-reverse">
                            <Button
                                className="inline-flex items-center gap-2 rounded-md py-1.5 px-3 text-sm/6 font-semibold text-white focus:outline-none data-[hover]:bg-white/5 data-[open]:bg-gray-700"
                                onClick={_ => {
                                    saveUser()
                                    setOpen(false)
                                }}
                            >
                                Save
                            </Button>
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    )

}

export { UserEdit }