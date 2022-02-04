import React from 'react';
import { Column, Row } from 'react-table';

import { GridTable, IPage } from '.';

export interface IPagedTableProps<CT extends object = {}> {
  pageIndex?: number;
  pageSize?: number;
  /**
   * An array of column definitions.
   */
  columns: Column<CT>[];
  /**
   * Handle row click event.
   */
  onRowClick?: (row: Row<CT>) => void;
  /**
   * Method to fetch data.
   */
  onFetch: (pageIndex: number, pageSize?: number) => Promise<IPage<CT>>;
  /**
   * Event fires when pageIndex or pageSize changes.
   */
  onPageChange: (pageIndex: number, pageSize?: number) => void;
}

export const PagedTable = <CT extends object>({
  pageIndex = 0,
  pageSize = 10,
  columns,
  onRowClick,
  onFetch,
  onPageChange,
}: IPagedTableProps<CT>) => {
  const [page, setPage] = React.useState({
    pageIndex,
    pageSize,
    pageCount: -1,
  });
  const [data, setData] = React.useState<CT[]>([]);

  const fetch = React.useCallback(
    async (pageIndex: number, pageSize?: number) => {
      return await onFetch(pageIndex, pageSize);
    },
    [onFetch],
  );

  React.useEffect(() => {
    // if (page.pageIndex !== pageIndex || page.pageSize !== pageSize) {
    fetch(pageIndex, pageSize)
      .then((data) => {
        setPage((page) => ({ ...page, pageCount: data.pageCount }));
        setData(data.items);
      })
      .catch((error) => {
        // TODO: Handle error.
      });
    // }
  }, [fetch, pageIndex, pageSize]);

  const handlePageChange = React.useCallback(
    (pageIndex: number, pageSize?: number) => {
      setPage((page) => ({ ...page, pageIndex, pageSize: pageSize ?? -1 }));
      if (onPageChange) onPageChange(pageIndex, pageSize);
    },
    [onPageChange],
  );

  return (
    <GridTable
      columns={columns}
      data={data}
      paging={{
        manualPagination: true,
        pageIndex: pageIndex,
        pageSize: pageSize,
        pageCount: page.pageCount,
      }}
      onRowClick={onRowClick}
      onPageChange={handlePageChange}
    ></GridTable>
  );
};
