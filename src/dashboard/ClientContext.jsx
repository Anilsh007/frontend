import { createContext, useContext } from 'react';

export const ClientContext = createContext(null);

export const useClient = () => useContext(ClientContext);
