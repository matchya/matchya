import { useContext } from "react";
import { useStore } from "zustand";

import { StorybookCompanyStoreContext, CompanyStoreContext, CompanyState } from "./company";
import { StorybookPositionStoreContext, PositionStoreContext, PositionState } from "./position";

export const useCompanyStore = (): CompanyState => {
  let store;
  if (import.meta.env.STORYBOOK === 'true') {
    store = useContext(StorybookCompanyStoreContext);
  } else {
    store = useContext(CompanyStoreContext);
  }
  if (!store) {
    throw new Error('Missing CompanyStoreContext');
  }
  return useStore(store);
};

export const usePositionStore = (): PositionState => {
  let store;
  if (import.meta.env.STORYBOOK === 'true') {
    store = useContext(StorybookPositionStoreContext);
  } else {
    store = useContext(PositionStoreContext);
  }
  if (!store) {
    throw new Error('Missing PositionStoreContext');
  }
  return useStore(store);
};
