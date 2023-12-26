import { CompanyStoreProvider, StorybookCompanyStoreProvider } from './company';
import { StoreProviderProps } from './interface';
import {
  PositionStoreProvider,
  StorybookPositionStoreProvider,
} from './position';

export const StorybookStoreProvider = ({ children }: StoreProviderProps) => {
  return (
    <StorybookPositionStoreProvider>
      <StorybookCompanyStoreProvider>{children}</StorybookCompanyStoreProvider>
    </StorybookPositionStoreProvider>
  );
};

export const StoreProvider = ({ children }: StoreProviderProps) => {
  return (
    <PositionStoreProvider>
      <CompanyStoreProvider>{children}</CompanyStoreProvider>
    </PositionStoreProvider>
  );
};
