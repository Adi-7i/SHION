import React from 'react';
import {
  ConfigModelProvider,
  ModelProviderUISection,
  UIConfigField,
} from '@/lib/config/types';
import ModelSelect from './ModelSelect';

const Models = ({
  fields,
  values,
}: {
  fields: ModelProviderUISection[];
  values: ConfigModelProvider[];
}) => {
  return (
    <div className="flex-1 space-y-6 overflow-y-auto py-6">
      <div className="flex flex-col px-6 gap-y-4">
        <h3 className="text-xs lg:text-xs text-black/70 dark:text-white/70">
          Select models
        </h3>
        <ModelSelect
          type="chat"
        />
        <ModelSelect
          type="embedding"
        />
      </div>
    </div>
  );
};

export default Models;
