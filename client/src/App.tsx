import { trpc } from "./utils/trpc";
import { httpBatchLink } from "@trpc/client";
import { useMemo, useState } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import AppRoutes from "./routes/AppRoutes";
import { AppTemplate } from "./components/templates/AppTemplate";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

function App() {
  const [token, setToken] = useState("");
  const token2 = localStorage.getItem("token");

  const getToken = () => {
    console.log("gettoken render");
    let local = localStorage.getItem("token");
    if (local) {
      return local;
    }
    return token;
  };

  const [queryClient] = useState(() => new QueryClient());

  const trpcClient = useMemo(() => {
    return trpc.createClient({
      links: [
        httpBatchLink({
          // url: "http://localhost:3000/trpc",
          url: "/trpc",
          headers: { authorization: token2 || "" },
          // url: "/trpc",
        }),
      ],
    });
  }, [token]);

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <QueryClientProvider client={queryClient}>
          <AppTemplate>
            <AppRoutes setToken={setToken} token={token} />
          </AppTemplate>
        </QueryClientProvider>
      </LocalizationProvider>
    </trpc.Provider>
  );
}
export default App;
