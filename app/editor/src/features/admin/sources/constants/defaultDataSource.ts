import { DataSourceScheduleTypeName, IDataSourceModel } from 'hooks/api-editor';

export const defaultDataSource: IDataSourceModel = {
  id: 0,
  name: '',
  code: '',
  shortName: '',
  description: '',
  isEnabled: false,
  dataLocationId: 0,
  contentTypeId: 0,
  mediaTypeId: 0,
  licenseId: 0,
  scheduleType: DataSourceScheduleTypeName.None,
  topic: '',
  autoTranscribe: false,
  disableTranscribe: false,
  connection: '',
  retryLimit: 0,
  failedAttempts: 0,
  actions: [],
  metrics: [],
  schedules: [],
};
