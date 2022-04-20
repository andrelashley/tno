import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fieldTypes } from 'features/content/list-view/constants';
import {
  IContentListAdvancedFilter,
  IContentListFilter,
  ISortBy,
} from 'features/content/list-view/interfaces';
import { LogicalOperator } from 'hooks/api-editor';

import { IContentState } from './interfaces';

export const initialContentState: IContentState = {
  initialized: false,
  filter: {
    pageIndex: 0,
    pageSize: 10,
    mediaTypeId: 0,
    contentTypeId: 0,
    ownerId: '',
    userId: '',
    timeFrame: 0,
    included: '',
    onTicker: '',
    commentary: '',
    topStory: '',
  },
  filterAdvanced: {
    fieldType: fieldTypes[0].toInterface(),
    logicalOperator: LogicalOperator.Contains,
    searchTerm: '',
  },
  sortBy: [],
};

export const contentSlice = createSlice({
  name: 'content',
  initialState: initialContentState,
  reducers: {
    init(state: IContentState, action: PayloadAction<IContentListFilter>) {
      state.filter = action.payload;
      state.initialized = true;
    },
    storeFilter(state: IContentState, action: PayloadAction<IContentListFilter>) {
      state.filter = action.payload;
    },
    storeFilterAdvanced(state: IContentState, action: PayloadAction<IContentListAdvancedFilter>) {
      state.filterAdvanced = action.payload;
    },
    storeSortBy(state: IContentState, action: PayloadAction<ISortBy[]>) {
      state.sortBy = action.payload;
    },
  },
});

export const { init, storeFilter, storeFilterAdvanced, storeSortBy } = contentSlice.actions;
