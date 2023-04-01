// import { config } from "dotenv";
// config();
import { trpc } from "./utils/trpc";
import { httpBatchLink } from "@trpc/client";
import { useState } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import AppRoutes from "./routes/AppRoutes";
import { AppTemplate } from "./components/templates/AppTemplate";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
// import { URL } from "./config";
function App() {
  // console.log(URL);
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() => {
    return trpc.createClient({
      links: [
        httpBatchLink({
          url: "http://localhost:3000/trpc",
          // url: "https://lotesuer-client.vercel.app/trpc",
          // url: "/trpc",
          // url: URL,
        }),
      ],
    });
  });

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <QueryClientProvider client={queryClient}>
          <AppTemplate>
            <AppRoutes />
          </AppTemplate>
        </QueryClientProvider>
      </LocalizationProvider>
    </trpc.Provider>
  );
}
export default App;
