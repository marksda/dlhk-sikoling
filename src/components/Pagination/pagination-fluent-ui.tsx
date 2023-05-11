import { DefaultButton, IIconProps, IconButton, PrimaryButton, Stack } from "@fluentui/react";
import { FC, useCallback, useMemo, useState } from "react";


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

const previousIcon: IIconProps = { iconName: 'Previous' };
const nextIcon: IIconProps = { iconName: 'Next' };

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
    
    const onNext = useCallback(
        () => {
            onPageChange(currentPage + 1);
        },
        [currentPage]
    );

    const onPrevious = useCallback(
        () => {
            onPageChange(currentPage - 1);
        },
        [currentPage]
    );

    let lastPage = paginationRange![paginationRange?.length! - 1] as number;

    return (        
        <Stack horizontal>
            <Stack.Item align="center">
                <IconButton 
                    iconProps={previousIcon} 
                    aria-label="previous" 
                    disabled={currentPage === 1}
                    onClick={onPrevious}
                />
            </Stack.Item>  
            {
                paginationRange?.map(pageNumber => {
                    if (pageNumber === DOTS) {
                        return (
                            <Stack.Item align="center">
                                <DefaultButton text="..." />
                            </Stack.Item>
                        );
                    }
                    else {
                        return (
                            <Stack.Item align="center">
                                {
                                    pageNumber === currentPage ?
                                    <PrimaryButton 
                                        text={pageNumber.toString()} 
                                        onClick={() => onPageChange(pageNumber as number)} /> :
                                    <DefaultButton 
                                        text={pageNumber.toString()} 
                                        onClick={() => onPageChange(pageNumber as number)} />
                                }                                
                            </Stack.Item>
                        );
                    }
                })
            }
            <Stack.Item align="center">
                <IconButton 
                    iconProps={nextIcon} 
                    aria-label="next" 
                    disabled={currentPage === lastPage}
                    onClick={onNext}
                />
            </Stack.Item>            
        </Stack>                        
    );
}

