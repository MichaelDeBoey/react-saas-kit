import { Fragment, MouseEventHandler, ReactNode } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import classNames from "@/utils/shared/ClassesUtils";

interface Props {
  right?: boolean;
  button?: ReactNode;
  options?: ReactNode;
  children?: ReactNode;
  className?: string;
  btnClassName?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export default function Dropdown({ button, options, right, onClick, className, btnClassName }: Props) {
  return (
    <Menu as="div" className={classNames(className, "relative inline-block text-left")}>
      <div>
        <Menu.Button
          onClick={onClick}
          className={
            btnClassName ??
            "inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-theme-500"
          }
        >
          {button}
          {!btnClassName && <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5 text-gray-500" aria-hidden="true" />}
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className={classNames(
            "z-40 absolute mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none",
            right ? "origin-top-left left-0" : "origin-top-right right-0"
          )}
        >
          <div className="py-1">{options}</div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
