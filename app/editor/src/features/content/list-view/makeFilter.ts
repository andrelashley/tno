import { IContentFilter } from 'hooks';

import { IContentListAdvancedFilter, IContentListFilter } from './interfaces';
import { setTimeFrame } from './setTimeFrame';

export interface IFilter extends IContentListFilter, IContentListAdvancedFilter {}

export const makeFilter = (filter: IContentListFilter | IFilter): IContentFilter => {
  const advanced = filter as IContentListAdvancedFilter;
  return {
    mediaTypeId: +filter.mediaTypeId > 0 ? +filter.mediaTypeId : undefined,
    ownerId: +filter.ownerId > 0 ? +filter.ownerId : undefined,
    userId: filter.isPrintContent === true ? +filter.userId : undefined,
    createdStartOn: advanced.startDate
      ? advanced.startDate.toISOString()
      : setTimeFrame(filter.timeFrame.value as number)?.toISOString(),
    createdEndOn: advanced.endDate ? advanced.endDate.toISOString() : undefined,
    [(advanced?.fieldType?.value as string) ?? 'fake']:
      advanced.searchTerm !== '' ? advanced.searchTerm : undefined,
    logicalOperator:
      advanced.searchTerm !== '' && advanced.logicalOperator !== ''
        ? advanced.logicalOperator
        : undefined,
  };
};
