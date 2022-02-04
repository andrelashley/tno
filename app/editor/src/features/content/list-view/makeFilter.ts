import { IContentFilter } from 'hooks';

import { IContentListFilter } from './interfaces';
import { setTimeFrame } from './setTimeFrame';

export const makeFilter = (filter: IContentListFilter): IContentFilter => {
  return {
    mediaTypeId: +filter.mediaTypeId > 0 ? +filter.mediaTypeId : undefined,
    ownerId: +filter.ownerId > 0 ? +filter.ownerId : undefined,
    hasPage: filter.newspaper === true ? true : undefined,
    createdStartOn: filter.startDate
      ? filter.startDate.toISOString()
      : setTimeFrame(filter.timeFrame.value as number)?.toISOString(),
    createdEndOn: filter.endDate ? filter.endDate.toISOString() : undefined,
    [filter.fieldType.value as string]: filter.searchTerm !== '' ? filter.searchTerm : undefined,
    logicalOperator:
      filter.searchTerm !== '' && filter.logicalOperator !== ''
        ? filter.logicalOperator
        : undefined,
  };
};
