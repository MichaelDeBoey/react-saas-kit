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
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export default function DropdownWithClick({ button, options, right, onClick, className }: Props) {
  return (
    <span className={classNames(className, "relative z-0 inline-flex shadow-sm rounded-md")}>
      <button
        onClick={onClick}
        type="button"
        className="-mr-1 relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-theme-500 focus:border-theme-500"
      >
        {button}
      </button>
      <Menu as="span" className="-ml-px relative block">
        <Menu.Button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-theme-500 focus:border-theme-500">
          <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
        </Menu.Button>
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
    </span>
  );
}
