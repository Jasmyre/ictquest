"use client"

import { useRouter } from "next/navigation";
import React, { ReactNode } from "react";
import { Button } from "./ui/button";
import { ArrowLeft } from 'lucide-react';

const BackButton = ({ children }: { children: ReactNode }) => {
	const router = useRouter();

	return (
		<Button
			onClick={() => router.back()}
            variant={"outline"}
			className="border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
		>
			<ArrowLeft className="mr-2 h-4 w-4" />
			{children}
		</Button>
	);
};

export default BackButton;
