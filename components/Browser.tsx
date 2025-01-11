import { ReactNode } from "react";

interface BrowserProps {
    children: ReactNode;
}
const Browser = ({ children }: BrowserProps) => {
  return (
		<div className="border rounded-xl">
			<header className="bg-primary rounded-[.75rem_.75rem_0_0] p-2 px-4 text-primary-foreground">
				<p>Browser</p>
			</header>
			<div className="browser p-2 px-4 py-10 min-h-[20vh] bg-white text-black">
				{children}
			</div>
		</div>
  );
}

export default Browser