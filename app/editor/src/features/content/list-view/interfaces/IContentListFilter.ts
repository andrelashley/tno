import { IOptionItem } from 'components';
import { LogicalOperator } from 'hooks';

export interface IContentListFilter {
  pageIndex: number;
  pageSize: number;
  mediaTypeId: number | '';
  ownerId: number | '';
  timeFrame: IOptionItem;
  newspaper: boolean;
  included: boolean;
  onTicker: boolean;
  commentary: boolean;
  topStory: boolean;
  fieldType: IOptionItem;
  logicalOperator: LogicalOperator | '';
  searchTerm: string;
  startDate?: Date | null;
  endDate?: Date | null;
}
