import { Column, Row } from 'react-table';

import { GridTable, IPage } from '.';

export interface IPagedTableProps<CT extends object = {}> {
  /**
   * An array of column definitions.
   */
  columns: Column<CT>[];
  /**
   * A page of data.
   */
  page: IPage<CT>;
  /**
   * Handle row click event.
   */
  onRowClick?: (row: Row<CT>) => void;
  /**
   * Event fires when pageIndex or pageSize changes.
   */
  onPageChange: (pageIndex: number, pageSize?: number) => void;
}

export const PagedTable = <CT extends object>({
  page,
  columns,
  onRowClick,
  onPageChange,
}: IPagedTableProps<CT>) => {
  return (
    <GridTable
      columns={columns}
      data={page.items}
      paging={{
        manualPagination: true,
        pageIndex: page.pageIndex,
        pageSize: page.pageSize,
        pageCount: page.pageCount,
      }}
      onRowClick={onRowClick}
      onPageChange={onPageChange}
    ></GridTable>
  );
};
