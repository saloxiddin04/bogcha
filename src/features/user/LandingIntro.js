function LandingIntro() {
	
	return (
		<div className="hero h-full rounded-l-xl bg-base-200">
			<div className="hero-content">
				<div className="max-w-md">
					
					{/*<h1 className="text-3xl text-center font-bold ">*/}
					<img
						src="/logo.jpg"
						className="inline-block mr-2 max-w-[120px] sm:max-w-[160px] md:max-w-[200px] h-auto"
						alt="logo"
					/>
					{/*DashWind*/}
					{/*</h1>*/}
					
					<div className="text-center mt-12">
						<img
							src="/intro.png"
							alt="Dashwind Admin Template"
							className="inline-block mr-2 max-w-[120px] sm:max-w-[160px] md:max-w-[200px] h-auto"
						/>
					</div>
				
				</div>
			
			</div>
		</div>
	)
	
}

export default LandingIntro