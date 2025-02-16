import { FormikCheckbox, FormikSelect, FormikText } from 'components/formik';
import { useFormikContext } from 'formik';
import { IDataSourceModel } from 'hooks/api-editor';
import React from 'react';
import ReactTooltip from 'react-tooltip';

import { Languages, TimeZones } from './constants';
import * as styled from './styled';

export const AudioStream: React.FC = (props) => {
  const { values, setFieldValue } = useFormikContext<IDataSourceModel>();

  React.useEffect(() => {
    ReactTooltip.rebuild();
  });

  const timeZone = TimeZones.find((t) => t.value === values.connection.timeZone);
  const language = Languages.find((t) => t.value === values.connection.language);

  return (
    <styled.MediaType>
      <FormikSelect
        label="Timezone"
        name="connection.timeZone"
        tooltip="Timezone of the source"
        options={TimeZones}
        defaultValue={timeZone}
      />
      <FormikText
        label="Stream URL"
        name="connection.url"
        tooltip="URL to the source stream"
        required
      />
      <FormikText
        label="Format"
        name="connection.format"
        tooltip="Format of the stream"
        placeholder="mp3"
      />
      <FormikText
        label="File Name"
        name="connection.fileName"
        tooltip="File name and output format"
        placeholder="{schedule.Name}.mp3"
      />
      <FormikText
        label="Volume"
        name="connection.volume"
        tooltip="Volume in percent or dB (1 = 100%)"
        placeholder="1"
      />
      <FormikText
        label="Other Arguments"
        name="connection.otherArgs"
        tooltip="Any other arguments to pass to the command"
      />
      <FormikSelect
        label="Language"
        name="connection.language"
        options={Languages}
        defaultValue={language}
      />
      {!!values.contentTypeId && (
        <>
          <p>
            Only import content if you have already successfully ingested content for the configured
            Kafka Topic.
          </p>
          <FormikCheckbox
            label="Import Content"
            name="connection.import"
            tooltip="Whether ingested content should be imported"
            onChange={(e) => {
              setFieldValue('connection.import', e.currentTarget.checked);
            }}
          />
        </>
      )}
    </styled.MediaType>
  );
};
