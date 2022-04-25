import { createContext, useContext , useState} from 'react';

export const DownloadContext = createContext({
  downloadUrl: "",
  setDownloadUrl: () => {}
});

export function DownloadWrapper({ children }) {

  const [downloadUrl, setDownloadUrl] = useState("");
  const value = { downloadUrl, setDownloadUrl };

  return (
    <DownloadContext.Provider value={value}>
      {children}
    </DownloadContext.Provider>
  );
}

export function useDownloadUrl() {
  return useContext(DownloadContext);
}
