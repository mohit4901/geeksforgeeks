import Landing from "./pages/Landing";
import Workspace from "./pages/Workspace";
import { useWorkspace } from "./hooks/useWorkspace";

export default function App() {
  const workspace = useWorkspace();

  return workspace.data ? (
    <Workspace data={workspace.data} />
  ) : (
    <Landing onCreate={workspace.create} loading={workspace.loading} />
  );
}