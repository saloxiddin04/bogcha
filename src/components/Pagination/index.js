// import React from 'react';
//
// const Pagination = ({ currentPage, totalItems, pageSize, onPageChange }) => {
// 	const totalPages = Math.ceil(totalItems / pageSize);
// 	const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
//
// 	console.log(totalPages)
//
// 	return (
// 		<div className="flex justify-center mt-4">
// 			<div className="join">
// 				<button
// 					className="join-item btn btn-sm"
// 					onClick={() => onPageChange(currentPage - 1)}
// 					disabled={currentPage === 1}
// 				>
// 					«
// 				</button>
//
// 				{pages.map((page, index) => (
// 					<button
// 						key={index}
// 						className={`join-item btn btn-sm ${currentPage === page ? 'btn-primary' : ''}`}
// 						onClick={() => onPageChange(page)}
// 					>
// 						{page}
// 					</button>
// 				))}
//
// 				<button
// 					className="join-item btn btn-sm"
// 					onClick={() => onPageChange(currentPage + 1)}
// 					disabled={currentPage === totalPages}
// 				>
// 					»
// 				</button>
// 			</div>
// 		</div>
// 	);
// };
//
// export default Pagination;

import React, { useEffect, useState } from "react";

const Pagination = ({ totalItems, itemsPerPage, onPageChange, resetPage }) => {
	const [currentPage, setCurrentPage] = useState(1);
	const totalPages = Math.ceil(totalItems / itemsPerPage);
	const maxVisiblePages = 8;
	
	useEffect(() => {
		if (resetPage) {
			setCurrentPage(1);
		}
	}, [resetPage]);
	
	const handlePageChange = (page) => {
		setCurrentPage(page);
		onPageChange(page);
	};
	
	const renderPaginationItems = () => {
		const paginationItems = [];
		
		if (totalPages <= maxVisiblePages) {
			for (let i = 1; i <= totalPages; i++) {
				paginationItems.push(
					<li key={i} className={`inline-block border ${currentPage === i ? "bg-primary text-white" : "bg-white text-primary"}`}>
						<button className="py-1 w-8 focus:outline-none" onClick={() => handlePageChange(i)}>
							{i}
						</button>
					</li>
				);
			}
		} else {
			const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
			const endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);
			
			if (startPage > 1) {
				paginationItems.push(
					<li key={1} className={`inline-block mx-1 rounded border ${currentPage === 1 ? "bg-primary text-white" : "bg-white text-primary"}`}>
						<button className="py-1 w-8 focus:outline-none" onClick={() => handlePageChange(1)}>1</button>
					</li>
				);
				if (startPage > 2) {
					paginationItems.push(<li key="start-ellipsis"><span className="inline-block mx-1">&hellip;</span></li>);
				}
			}
			
			for (let i = startPage; i <= endPage; i++) {
				paginationItems.push(
					<li key={i} className={`inline-block mx-1 rounded border ${currentPage === i ? "bg-primary text-white" : "bg-white text-primary"}`}>
						<button className="py-1 w-8 focus:outline-none" onClick={() => handlePageChange(i)}>
							{i}
						</button>
					</li>
				);
			}
			
			if (endPage < totalPages) {
				if (endPage < totalPages - 1) {
					paginationItems.push(<li key="end-ellipsis"><span className="inline-block mx-1">&hellip;</span></li>);
				}
				paginationItems.push(
					<li key={totalPages} className={`inline-block mx-1 rounded border ${currentPage === totalPages ? "bg-primary text-white" : "bg-white text-primary"}`}>
						<button className="py-1 w-8 focus:outline-none" onClick={() => handlePageChange(totalPages)}>
							{totalPages}
						</button>
					</li>
				);
			}
		}
		
		return paginationItems;
	};
	
	return (
		<ul className="join flex items-center justify-end mt-4">
			<li>
				<button className={"join-item btn btn-sm"} disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
					«
				</button>
			</li>
			{renderPaginationItems()}
			<li>
				<button className={"join-item btn btn-sm"} disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>
					»
				</button>
			</li>
		</ul>
	);
};

export default Pagination;

