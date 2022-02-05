import { IOptionItem } from 'components';
import { LogicalOperator } from 'hooks';

export interface IContentListAdvancedFilter {
  fieldType: IOptionItem;
  logicalOperator: LogicalOperator | '';
  searchTerm: string;
  startDate?: Date | null;
  endDate?: Date | null;
}
