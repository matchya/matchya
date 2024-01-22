import { useContext } from "react";
import { useStore } from "zustand";

import { StorybookCompanyStoreContext, CompanyStoreContext, CompanyState } from "./company";

export const useCompanyStore = (): CompanyState => {
  const store = useContext(import.meta.env.STORYBOOK === 'true' ? StorybookCompanyStoreContext : CompanyStoreContext)
  if (!store) {
    throw new Error('Missing CompanyStoreContext');
  }
  return useStore(store);
};

// export const usePositionStore = (): PositionState => {
//   const store = useContext(import.meta.env.STORYBOOK === 'true' ? StorybookPositionStoreContext : PositionStoreContext)
//   if (!store) {
//     throw new Error('Missing PositionStoreContext');
//   }
//   return useStore(store);
// };
