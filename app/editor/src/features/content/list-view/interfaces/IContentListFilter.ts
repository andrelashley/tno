import { IOptionItem } from 'components';

export interface IContentListFilter {
  pageIndex: number;
  pageSize: number;
  mediaTypeId: number | '';
  ownerId: number | '';
  userId: number | '';
  timeFrame: IOptionItem;
  isPrintContent: boolean;
  included: boolean;
  onTicker: boolean;
  commentary: boolean;
  topStory: boolean;
}
