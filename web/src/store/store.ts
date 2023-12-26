import { useContext } from "react";
import { useStore } from "zustand";

import { StorybookCompanyStoreContext, CompanyStoreContext } from "./company";
import { StorybookPositionStoreContext, PositionStoreContext } from "./position";

export const useCompanyStore = () => {
  let store;
  if (import.meta.env.STORYBOOK === 'true') {
    store = useContext(StorybookCompanyStoreContext);
  } else {
    store = useContext(CompanyStoreContext);
  }
  if (!store) {
    throw new Error('Missing StoreProvider');
  }
  return useStore(store);
};

export const usePositionStore = () => {
  let store;
  if (import.meta.env.STORYBOOK === 'true') {
    store = useContext(StorybookPositionStoreContext);
  } else {
    store = useContext(PositionStoreContext);
  }
  if (!store) {
    throw new Error('Missing StoreProvider');
  }
  return useStore(store);
};
