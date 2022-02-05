import { Checkbox } from 'components';
import { ContentStatus, IContentModel } from 'hooks/api-editor';
import moment from 'moment';
import { Column } from 'react-table';

const checkboxColumn = ({ value }: { value: boolean }) => (
  <Checkbox defaultChecked={value} value={value ? 'true' : 'false'} />
);

const dateColumn = ({ value }: { value: IContentModel }) => {
  const created = moment(value.createdOn);
  const text = created.isValid() ? created.format('MM/DD/YYYY') : '';
  return <>{text}</>;
};

export const columns: Column<IContentModel>[] = [
  {
    Header: 'Headline',
    accessor: 'headline',
  },
  {
    Header: 'Source',
    accessor: 'source',
  },
  {
    Header: 'Type',
    accessor: (row) => row.mediaType.name,
  },
  {
    Header: 'Section/Page',
    accessor: (row) => {
      if (row.printContent?.section) return `${row.printContent.section}/${row.page}`;
      return row.page;
    },
  },
  {
    Header: 'Username',
    accessor: (row) => row.owner?.displayName,
  },
  {
    Header: 'Status',
    accessor: (row) => row.status,
  },
  {
    Header: 'Date',
    accessor: (row) => row,
    Cell: dateColumn,
  },
  {
    Header: 'Use',
    accessor: (row) =>
      row.status === ContentStatus.Publish || row.status === ContentStatus.Published,
    Cell: checkboxColumn,
  },
];
