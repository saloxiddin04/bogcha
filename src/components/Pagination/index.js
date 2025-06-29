import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
	const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
	
	return (
		<div className="flex justify-center mt-4">
			<div className="join">
				<button
					className="join-item btn btn-sm"
					onClick={() => onPageChange(currentPage - 1)}
					disabled={currentPage === 1}
				>
					«
				</button>
				
				{pages.map((page, index) => (
					<button
						key={index}
						className={`join-item btn btn-sm ${currentPage === page ? 'btn-primary' : ''}`}
						onClick={() => onPageChange(page)}
					>
						{page}
					</button>
				))}
				
				<button
					className="join-item btn btn-sm"
					onClick={() => onPageChange(currentPage + 1)}
					disabled={currentPage === totalPages}
				>
					»
				</button>
			</div>
		</div>
	);
};

export default Pagination;
