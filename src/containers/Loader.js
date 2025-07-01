import React from 'react';

const Loader = () => {
	return (
		<>
			<div className="w-full flex justify-center items-center py-4">
				<div className="w-8 h-8 bg-primary rounded-full animate-ping"></div>
			</div>
		</>
	);
};

export default Loader;