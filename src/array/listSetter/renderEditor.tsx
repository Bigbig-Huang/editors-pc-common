import { EditConfig } from '@/interface';
import React, { useEffect, useMemo, useState, useContext } from 'react';
import DefaultEditors from './defaultEditors';
import AryContext from './../context'
import css from './index.less';

const useModel = ({ value, onChange }: { value: any; onChange: Function }) => {
  const [closure, setClosure] = useState(value);

  useEffect(() => {
    setClosure(value);
  }, [value]);

  const model = useMemo(() => {
    return {
      get: () => {
        return closure;
      },
      set: (newVal: any) => {
        typeof onChange === 'function' && onChange(newVal);
        setClosure(newVal);
      },
    };
  }, [closure, onChange]);

  return model;
};

export default ({
  editConfig = {} as EditConfig,
  extraContext,
  value,
  onChange,
}: {
  editConfig: EditConfig;
  extraContext: any;
  value: any;
  onChange: (val: any) => void;
}) => {
  const { injectEditors } = useContext(AryContext);

  const model = useModel({
    value,
    onChange,
  });

  const Editors = useMemo(() => {
    return injectEditors || DefaultEditors
  }, [injectEditors, DefaultEditors])

  const Component = Editors({
    editConfig: {
      ...editConfig,
      // [TODO] 临时把array的text转到textinput里
      type: editConfig.type.toLowerCase() === 'text' ? 'textinput' : editConfig.type,
      options:
        typeof editConfig.options === 'function' // 支持options为函数的情况
          ? editConfig.options() || {}
          : editConfig.options,
      value: model,
    },
    ...(extraContext || {}),
  });

  return (
    <div className={css.item}>
      {Component?.render ? (
        Component.render
      ) : (
        <>
          <p className={css.itemTitle}>{editConfig.title}</p>
          <div className={css.itemContent}>{Component}</div>
        </>
      )}
    </div>
  );
};
