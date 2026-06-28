
const CURRENT_YEAR = new Date().getFullYear();

function Footer() {
	return (
		<footer className="w-full bg-white border-t border-stone-200">
			<div className="max-w-7xl mx-auto px-3 sm:px-4 py-2">
				<div className="flex items-center gap-2">
					<div className="w-3.5 h-3.5 border border-green-600 flex items-center justify-center">
						<div className="w-1 h-1 bg-green-500 rotate-45" />
					</div>
					<p className="text-[11px] sm:text-xs text-stone-800">
						© {CURRENT_YEAR}{" "}
						<span className="font-medium text-stone-800">Singhmar Pvt. Ltd.</span>
						{" "}All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
}

export default Footer;