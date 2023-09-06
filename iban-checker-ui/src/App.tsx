import MainContainer from "./components/organisms/MainContainer/MainContainer";
import ValidationHistory from "./components/organisms/ValidationHistory/ValidationHistory";
import AppLayout from "./components/templates/AppLayout/AppLayout";

function App() {
  return (
    <AppLayout>
      <MainContainer />
      <ValidationHistory />
    </AppLayout>
  );
}

export default App;
