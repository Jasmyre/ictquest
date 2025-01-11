import React from 'react'
import { Button } from "./ui/button"
import { ArrowRight } from "lucide-react";

interface SubmitButtonProps {
    label: string
}

const SubmitButton = ({ label = "continue" }: SubmitButtonProps) => {
  return (
		<Button>
            {label}
			<ArrowRight className="ml-2 h-4 w-4" />
		</Button>
  );
}

export default SubmitButton