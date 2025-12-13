"use client";

import { signIn } from "next-auth/react";
import type { ButtonHTMLAttributes, ComponentProps, ReactNode } from "react";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { Button } from "./ui/button";

type Provider = Parameters<typeof signIn>[0];

const ProviderButton = ({
  children,
  ...props
}: ComponentProps<typeof Button> & { children: ReactNode }) => (
  <Button
    {...props}
    className="relative flex w-full cursor-pointer justify-center border-gray-300 bg-gray-100 text-gray-500 hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
    variant="outline"
  >
    {children}
  </Button>
);

type AuthProviderButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  provider: Provider;
  icon: ReactNode;
  label: string;
};

export const AuthProviderButton = ({
  provider,
  icon,
  label,
  ...props
}: AuthProviderButtonProps) => {
  const handleClick = () => {
    signIn(provider, {
      callbackUrl: DEFAULT_LOGIN_REDIRECT,
    });
  };

  return (
    <ProviderButton onClick={handleClick} {...props}>
      <span className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-8">
        {icon}
      </span>
      <span>{label}</span>
    </ProviderButton>
  );
};
