import { CompanyStoreProvider, StorybookCompanyStoreProvider } from './company';
import { ContextProviderProps } from './interface';
import {
  PositionStoreProvider,
  StorybookPositionStoreProvider,
} from './position';

export const StorybookStoreProvider = ({ children }: ContextProviderProps) => {
  return (
    <StorybookPositionStoreProvider>
      <StorybookCompanyStoreProvider>{children}</StorybookCompanyStoreProvider>
    </StorybookPositionStoreProvider>
  );
};

export const StoreProvider = ({ children }: ContextProviderProps) => {
  return (
    <PositionStoreProvider>
      <CompanyStoreProvider>{children}</CompanyStoreProvider>
    </PositionStoreProvider>
  );
};
