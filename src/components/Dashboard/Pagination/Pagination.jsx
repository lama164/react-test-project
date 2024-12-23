import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import "./pagination.css";

export default function PaginatedItems({ itemsPerPage, total, setPage }) {
    const pageCount = total / itemsPerPage;

  return (
    <>
      <ReactPaginate
        breakLabel="..."
        nextLabel=" >>"
        onPageChange={(e) => setPage(e.selected + 1)}
        pageRangeDisplayed={3}
        pageCount={pageCount}
        previousLabel="<< "
        renderOnZeroPageCount={null}
        containerClassName="custom-pagination d-flex align-items-center justify-content-end"
        pageLinkClassName='pagination-tag-anchour mx-2 text-secondary rounded-circle' 
        activeLinkClassName='bg-primary text-white'
      />
    </>
  );
}
