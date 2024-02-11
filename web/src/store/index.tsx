import { CompanyStoreProvider, StorybookCompanyStoreProvider } from './company';
import { StoreProviderProps } from './interface';

export const StorybookStoreProvider = ({ children }: StoreProviderProps) => {
  return (
    <StorybookCompanyStoreProvider>{children}</StorybookCompanyStoreProvider>
  );
};

export const StoreProvider = ({ children }: StoreProviderProps) => {
  return <CompanyStoreProvider>{children}</CompanyStoreProvider>;
};
