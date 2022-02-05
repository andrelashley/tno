import {
  Button,
  ButtonVariant,
  Checkbox,
  Dropdown,
  IOptionItem,
  IPage,
  OptionItem,
  Page,
  PagedTable,
  RadioGroup,
  SelectDate,
  Text,
} from 'components';
import { IContentModel, LogicalOperator, useApiEditor } from 'hooks';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useKeycloakWrapper } from 'tno-core';

import { columns, fieldTypes, logicalOperators, timeFrames } from './constants';
import * as styled from './ContentListViewStyled';
import { IContentListAdvancedFilter, IContentListFilter } from './interfaces';
import { makeFilter } from './makeFilter';

const defaultListFilter: IContentListFilter = {
  pageIndex: 0,
  pageSize: 10,
  mediaTypeId: 0,
  ownerId: '',
  userId: '',
  timeFrame: timeFrames[0],
  isPrintContent: false,
  included: false,
  onTicker: false,
  commentary: false,
  topStory: false,
};

const defaultListAdvancedFilter: IContentListAdvancedFilter = {
  fieldType: fieldTypes[0],
  logicalOperator: LogicalOperator.Contains,
  searchTerm: '',
};

const defaultPage: IPage<IContentModel> = {
  pageIndex: 0,
  pageSize: 10,
  pageCount: -1,
  items: [],
};

export const ContentListView: React.FC = () => {
  const [mediaTypes, setMediaTypes] = React.useState<IOptionItem[]>([]);
  const [users, setUsers] = React.useState<IOptionItem[]>([]);
  const [page, setPage] = React.useState(defaultPage);
  const [listFilter, setListFilter] = React.useState(defaultListFilter);
  const [listFilterAdvanced, setListFilterAdvanced] = React.useState(defaultListAdvancedFilter);
  const keycloak = useKeycloakWrapper();
  const navigate = useNavigate();
  const api = useApiEditor();

  const username = keycloak.instance.tokenParsed.username;

  React.useEffect(() => {
    // TODO: Redux user values.
    api.getUsers().then((data) => {
      setUsers(
        [new OptionItem('All Users', 0)].concat(
          data.map((u) => new OptionItem(u.displayName, u.id)),
        ),
      );
      // TODO: Add user.id to keycloak.
      const currentUserId = data.find((u) => u.username === username)?.id ?? 0;
      setListFilter((filter) => ({ ...filter, ownerId: currentUserId }));
    });
  }, [api, username]);

  React.useEffect(() => {
    // TODO: Redux media types.
    api.getMediaTypes().then((data) => {
      setMediaTypes(
        [new OptionItem('All Media', 0)].concat(data.map((m) => new OptionItem(m.name, m.id))),
      );
    });
  }, [api]);

  const fetch = React.useCallback(
    async (filter) => {
      try {
        const data = await api.getContents(filter.pageIndex, filter.pageSize, makeFilter(filter));
        const page = new Page(data.page - 1, data.quantity, data?.items, data.total);
        setPage(page);
        return page;
      } catch (error) {
        // TODO: Handle error
        throw error;
      }
    },
    [api],
  );

  React.useEffect(() => {
    fetch({ ...listFilter, ...listFilterAdvanced });
    // We don't want a render when the advanced filter changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetch, listFilter]);

  const handlePageChange = (pi: number, ps?: number) => {
    if (listFilter.pageIndex !== pi) setListFilter({ ...listFilter, pageIndex: pi });
    if (listFilter.pageSize !== ps)
      setListFilter({ ...listFilter, pageSize: ps ?? defaultListFilter.pageSize });
  };

  const handleTimeChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = +e.target.value;
    setListFilter((filter) => ({
      ...filter,
      pageIndex: 0,
      timeFrame: timeFrames.find((tf) => tf.value === value) ?? timeFrames[0],
    }));
  };

  return (
    <styled.ContentListView>
      <div className="content-filter">
        <div>
          <Dropdown
            name="mediaType"
            label="Media Type"
            options={mediaTypes}
            value={mediaTypes.find((mt) => mt.value === listFilter.mediaTypeId)}
            defaultValue={mediaTypes[0]}
            onChange={(newValue) => {
              var mediaTypeId = (newValue as IOptionItem).value ?? '';
              setListFilter({
                ...listFilter,
                pageIndex: 0,
                mediaTypeId: typeof mediaTypeId === 'string' ? '' : mediaTypeId,
              });
            }}
          />
          <Dropdown
            name="user"
            label="User"
            options={users}
            value={users.find((u) => u.value === listFilter.ownerId)}
            onChange={(newValue) => {
              var ownerId = (newValue as IOptionItem).value ?? '';
              setListFilter({
                ...listFilter,
                pageIndex: 0,
                ownerId: typeof ownerId === 'string' ? '' : ownerId,
              });
            }}
          />
          <RadioGroup
            name="timeFrame"
            label="Time Frame"
            tooltip="Date created"
            value={listFilter.timeFrame}
            options={timeFrames}
            onChange={handleTimeChange}
            disabled={!!listFilterAdvanced.startDate || !!listFilterAdvanced.endDate}
          />
          <div className="frm-in chg">
            <label>Filters</label>
            <Checkbox
              name="isPrintContent"
              label="Lois"
              tooltip="Print Content"
              value="isPrintContent"
              checked={listFilter.isPrintContent}
              onChange={(e) => {
                setListFilter({ ...listFilter, pageIndex: 0, isPrintContent: e.target.checked });
              }}
            />
            <Checkbox
              name="included"
              label="Included"
              value="included"
              checked={listFilter.included}
              onChange={() =>
                setListFilter({ ...listFilter, pageIndex: 0, included: !listFilter.included })
              }
            />
            <Checkbox
              name="ticker"
              label="On Ticker"
              value="ticker"
              checked={listFilter.onTicker}
              onChange={() =>
                setListFilter({ ...listFilter, pageIndex: 0, onTicker: !listFilter.onTicker })
              }
            />
            <Checkbox
              name="commentary"
              label="Commentary"
              value="commentary"
              checked={listFilter.commentary}
              onChange={() =>
                setListFilter({ ...listFilter, pageIndex: 0, commentary: !listFilter.commentary })
              }
            />
            <Checkbox
              name="topStory"
              label="Top Story"
              value="topStory"
              checked={listFilter.topStory}
              onChange={() =>
                setListFilter({ ...listFilter, pageIndex: 0, topStory: !listFilter.topStory })
              }
            />
          </div>
        </div>
        <div className="box">
          <h2 className="caps">Advanced Search</h2>
          <div>
            <Dropdown
              name="fieldType"
              label="Field Type"
              options={fieldTypes}
              value={listFilterAdvanced.fieldType}
              onChange={(newValue) => {
                setListFilterAdvanced({ ...listFilterAdvanced, fieldType: newValue as OptionItem });
              }}
            />
            <Dropdown
              name="logicalOperator"
              label="Logical Operator"
              options={logicalOperators}
              value={logicalOperators.find(
                (lo) => (LogicalOperator as any)[lo.value] === listFilterAdvanced.logicalOperator,
              )}
              onChange={(newValue) => {
                const logicalOperator = (LogicalOperator as any)[(newValue as OptionItem).value];
                setListFilterAdvanced({ ...listFilterAdvanced, logicalOperator });
              }}
            />
            <Text
              name="searchTerm"
              label="Search Terms"
              value={listFilterAdvanced.searchTerm}
              onChange={(e) => {
                setListFilterAdvanced({ ...listFilterAdvanced, searchTerm: e.target.value.trim() });
              }}
            ></Text>
          </div>
          <div className="frm-in dateRange">
            <label data-for="main-tooltip" data-tip="Date created">
              Date Range
            </label>
            <div>
              <SelectDate
                name="startDate"
                placeholderText="YYYY MM DD"
                selected={listFilterAdvanced.startDate}
                showTimeSelect
                dateFormat="Pp"
                onChange={(date) =>
                  setListFilterAdvanced({ ...listFilterAdvanced, startDate: date })
                }
              />
              <SelectDate
                name="endDate"
                placeholderText="YYYY MM DD"
                selected={listFilterAdvanced.endDate}
                showTimeSelect
                dateFormat="Pp"
                onChange={(date) => setListFilterAdvanced({ ...listFilterAdvanced, endDate: date })}
              />
            </div>
          </div>
          <Button
            name="search"
            onClick={() => fetch({ ...listFilter, pageIndex: 0, ...listFilterAdvanced })}
          >
            Search
          </Button>
          <Button
            name="clear"
            variant={ButtonVariant.secondary}
            onClick={() => {
              setListFilterAdvanced({
                ...defaultListAdvancedFilter,
              });
              setListFilter({ ...listFilter, pageIndex: 0 });
            }}
          >
            Clear
          </Button>
        </div>
      </div>
      <div className="content-list">
        <PagedTable
          columns={columns}
          page={page}
          onRowClick={(row) => navigate(`/contents/${row.id}`)}
          onPageChange={handlePageChange}
        ></PagedTable>
      </div>
      <div className="content-actions">
        <Button name="create" onClick={() => navigate('/contents/0')}>
          Create Snippet
        </Button>
        <div className="addition-actions">
          <Button
            name="create"
            variant={ButtonVariant.secondary}
            disabled={true}
            tooltip="Under Construction"
          >
            Send Lois Front Pages
          </Button>
          <Button
            name="create"
            variant={ButtonVariant.secondary}
            disabled={true}
            tooltip="Under Construction"
          >
            Send Top Stories
          </Button>
          <Button
            name="create"
            variant={ButtonVariant.secondary}
            disabled={true}
            tooltip="Under Construction"
          >
            Send Send Lois to Commentary
          </Button>
        </div>
      </div>
    </styled.ContentListView>
  );
};
