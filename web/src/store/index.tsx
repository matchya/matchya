import { CompanyStoreProvider } from './company';
import { StoreProviderProps } from './interface';

// export const StorybookStoreProvider = ({ children }: StoreProviderProps) => {
//   return (
//     <StorybookPositionStoreProvider>
//       <StorybookCompanyStoreProvider>{children}</StorybookCompanyStoreProvider>
//     </StorybookPositionStoreProvider>
//   );
// };

export const StoreProvider = ({ children }: StoreProviderProps) => {
  return (
   
      <CompanyStoreProvider>{children}</CompanyStoreProvider>
 
  );
};
