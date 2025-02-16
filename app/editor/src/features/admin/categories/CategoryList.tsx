import { FormPage } from 'components/form/formpage/styled';
import { ICategoryModel } from 'hooks/api-editor';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCategories } from 'store/hooks/admin/categories';
import { useApp } from 'store/hooks/app/useApp';
import { GridTable } from 'tno-core';

import { CategoryListFilter } from './CategoryListFilter';
import { columns } from './constants';
import * as styled from './styled';

export const CategoryList: React.FC = () => {
  const navigate = useNavigate();
  const [{ requests }] = useApp();
  const [{ categories }, api] = useCategories();

  const [items, setItems] = React.useState<ICategoryModel[]>([]);

  React.useEffect(() => {
    if (!categories.length) {
      api.findAllCategories().then((data) => {
        setItems(data);
      });
    } else {
      setItems(categories);
    }
  }, [api, categories]);

  return (
    <styled.CategoryList>
      <FormPage>
        <GridTable
          columns={columns}
          header={CategoryListFilter}
          manualPageSize
          isLoading={!!requests.length}
          data={items}
          onRowClick={(row) => navigate(`${row.original.id}`)}
        ></GridTable>
      </FormPage>
    </styled.CategoryList>
  );
};
