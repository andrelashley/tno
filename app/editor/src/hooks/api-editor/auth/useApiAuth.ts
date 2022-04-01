import React from 'react';
import { defaultEnvelope, ILifecycleToasts } from 'tno-core';

import { IUserInfoModel, useApi } from '..';

/**
 * Common hook to make requests to the PIMS APi.
 * @returns CustomAxios object setup for the PIMS API.
 */
export const useApiAuth = (
  options: {
    lifecycleToasts?: ILifecycleToasts;
    selector?: Function;
    envelope?: typeof defaultEnvelope;
    baseURL?: string;
  } = {},
) => {
  const api = useApi(options);

  return React.useRef({
    getUserInfo: () => {
      return api.get<IUserInfoModel>(`/auth/userinfo`);
    },
  }).current;
};
