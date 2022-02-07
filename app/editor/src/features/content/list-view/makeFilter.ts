import { IContentFilter } from 'hooks';

import { IContentListAdvancedFilter, IContentListFilter } from './interfaces';
import { setTimeFrame } from './setTimeFrame';

export const makeFilter = (
  filter: IContentListFilter & IContentListAdvancedFilter,
): IContentFilter => {
  const advanced = filter as IContentListAdvancedFilter;
  const actions = [];
  if (filter.included) actions.push('Included');
  if (filter.onTicker) actions.push('On Ticker');
  if (filter.commentary) actions.push('Commentary');
  if (filter.topStory) actions.push('Top Story');
  return {
    mediaTypeId: +filter.mediaTypeId > 0 ? +filter.mediaTypeId : undefined,
    ownerId: +filter.ownerId > 0 ? +filter.ownerId : undefined,
    contentTypeId: filter.contentTypeId !== 0 ? filter.contentTypeId : undefined,
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
    actions,
  };
};
