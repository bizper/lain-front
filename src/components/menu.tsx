import { MenuButton, MenuItems, MenuItem, Menu } from "@headlessui/react"
import clsx from "clsx"

type MenuAttr = {
    icon?: React.ReactNode
    className?: string
    items: React.ReactNode[]
}

const PopMenu = ({ icon, items, className }: MenuAttr) => {
    return (
        <Menu>
            <MenuButton className={`rounded-md py-1.5 px-1.5 text-sm/6 font-semibold text-white focus:outline-none data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white ${className}`}>
                {icon}
            </MenuButton>
            <MenuItems
                transition
                anchor="bottom end"
                className={clsx(
                    "border-[1px] border-white/5 w-52 backdrop-blur-2xl origin-top-right rounded-xl border border-white/5 bg-white/5 p-1 text-sm/6 text-white",
                    "transition duration-200 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
                )}
            >
                {
                    items.map((i, index) => {
                        if (i !== null) {
                            return (
                                <MenuItem key={index}>
                                    {i}
                                </MenuItem>
                            )
                        } else return null
                    })
                }
            </MenuItems>
        </Menu>
    )
}

export { PopMenu }