"use client"

import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "./ui/button";
import { ArrowLeft } from 'lucide-react';

const BackButton = () => {
	const router = useRouter();

	return (
		<Button
			onClick={() => router.back()}
            variant={"outline"}
		>
			<ArrowLeft />
			Go Back
		</Button>
	);
};

export default BackButton;
