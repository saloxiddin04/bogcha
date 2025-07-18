import TemplatePointers from "./components/TemplatePointers"


function LandingIntro() {
	
	return (
		<div className="hero min-h-full rounded-l-xl bg-base-200">
			<div className="hero-content py-12">
				<div className="max-w-md">
					
					{/*<h1 className="text-3xl text-center font-bold ">*/}
						<img
							src="/logo.jpg"
							className="inline-block mr-2"
							alt="logo"
						/>
						{/*DashWind*/}
					{/*</h1>*/}
					
					<div className="text-center mt-12"><img src="/intro.png" alt="Dashwind Admin Template"
					                                        className="w-48 inline-block"></img></div>
				
				</div>
			
			</div>
		</div>
	)
	
}

export default LandingIntro