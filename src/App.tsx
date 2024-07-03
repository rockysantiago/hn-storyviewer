import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createGlobalStyle } from "styled-components";
import { StoryList } from "./components/StoryList";

const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Roboto', sans-serif;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    background-color: #f8f8f2;
  }
`;

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GlobalStyle />
      <StoryList />
    </QueryClientProvider>
  );
}

export default App;
