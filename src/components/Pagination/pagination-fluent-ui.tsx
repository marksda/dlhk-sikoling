import { FC, useMemo, useState } from "react";


export interface IUsePaginationProps {
    totalCount: number;
    pageSize: number;
    siblingCount : number;
    currentPage: number;
};

export const DOTS = '...';

const range = (start:number, end: number) => {
    let length = end - start + 1;
    return Array.from({ length }, (_, idx) => idx + start);
};

export const usePagination = ({
    totalCount, 
    pageSize,
    siblingCount=1,
    currentPage
}: IUsePaginationProps) => {
    const paginationRange = useMemo(
        () => {
            const totalPageCount = Math.ceil(totalCount / pageSize);
            // Pages count is determined as siblingCount + firstPage + lastPage + currentPage + 2*DOTS
            const totalPageNumbers = siblingCount + 5;

            /*
                If the number of pages is less than the page numbers we want to show in our
                paginationComponent, we return the range [1..totalPageCount]
              */
            if (totalPageNumbers >= totalPageCount) {
                return range(1, totalPageCount);
            }

            const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
            const rightSiblingIndex = Math.min(
                currentPage + siblingCount,
                totalPageCount
            );

            /*
                We do not want to show dots if there is only one position left 
                after/before the left/right page count as that would lead to a change if our Pagination
                component size which we do not want
              */
            const shouldShowLeftDots = leftSiblingIndex > 2;
            const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;
        
            const firstPageIndex = 1;
            const lastPageIndex = totalPageCount;

            if (!shouldShowLeftDots && shouldShowRightDots) {
                let leftItemCount = 3 + 2 * siblingCount;
                let leftRange = range(1, leftItemCount);
          
                return [...leftRange, DOTS, totalPageCount];
            }

            if (shouldShowLeftDots && !shouldShowRightDots) {
                let rightItemCount = 3 + 2 * siblingCount;
                let rightRange = range(
                  totalPageCount - rightItemCount + 1,
                  totalPageCount
                );
                return [firstPageIndex, DOTS, ...rightRange];
            }

            if (shouldShowLeftDots && shouldShowRightDots) {
                let middleRange = range(leftSiblingIndex, rightSiblingIndex);
                return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
            }
        },
        [totalCount, pageSize, siblingCount, currentPage]
    );

    return paginationRange;
};

export interface IPaginationProps {
    onPageChange: (v:number) => void;
    totalCount: number;
    siblingCount : number;
    currentPage: number;
    pageSize: number;
};

export const Pagination: FC<IPaginationProps> = ({
    onPageChange,
    totalCount,
    siblingCount=1,
    currentPage,
    pageSize
}) => {
    const paginationRange = usePagination({
        totalCount,
        pageSize,
        siblingCount,
        currentPage
    });

    if (currentPage === 0 || paginationRange?.length! < 2) {
        return null;
    }
    
    const onNext = () => {
        onPageChange(currentPage + 1);
    };

    const onPrevious = () => {
        onPageChange(currentPage - 1);
    };

    let lastPage = paginationRange![paginationRange?.length! - 1] as number;

    return (
        <ul className={classnames('pagination-container', { [className]: className })}>
            <li
                className={classnames('pagination-item', {
                disabled: currentPage === 1
                })}
                onClick={onPrevious}
            >
                <div className="arrow left" />
            </li>
            {
                paginationRange!.map(pageNumber => {
                    if (pageNumber === DOTS) {
                        return <li className="pagination-item dots">&#8230;</li>;
                    }

                    return (
                        <li
                          className={classnames('pagination-item', {
                            selected: pageNumber === currentPage
                          })}
                          onClick={() => onPageChange(pageNumber)}
                        >
                          {pageNumber}
                        </li>
                    );
                })
            }
            <li
                className={classnames('pagination-item', {
                disabled: currentPage === lastPage
                })}
                onClick={onNext}
            >
                <div className="arrow right" />
            </li>
        </ul>
    );
}