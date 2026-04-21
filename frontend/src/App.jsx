import { Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "./components/Navbar";
import ToastContainer from "./components/ToastContainer";
import CreateIssue from "./pages/CreateIssue";
import Dashboard from "./pages/Dashboard";
import EditIssue from "./pages/EditIssue";
import IssueDetails from "./pages/IssueDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";

function ProtectedRoute({ children }) {
  const user = useSelector((state) => state.auth.user);
  if (!user?.token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function PublicOnlyRoute({ children }) {
  const user = useSelector((state) => state.auth.user);
  if (user?.token) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function App() {
  return (
    <div style={{ minHeight: "100vh" }}>
      <ToastContainer />
      <Routes>
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicOnlyRoute>
              <Register />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="*"
          element={
            <ProtectedRoute>
              <Navbar />
              <main className="page-wrap">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/issues/new" element={<CreateIssue />} />
                  <Route path="/issues/:id" element={<IssueDetails />} />
                  <Route path="/issues/:id/edit" element={<EditIssue />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
