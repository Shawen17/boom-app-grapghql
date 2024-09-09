import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import Login from "./containers/LoginPage/Login";
import Dashboard from "./containers/AdminDashboardPage/Dashboard";
import UserDetails from "./containers/UserDetailsPage/UserDetails";
import AddUserForm from "./containers/AdminAddUserPage/AddUserForm";
import UpdateUserForm from "./containers/UpdateUserPage/UpdateUserForm";
import Signup from "./containers/SignupPage/Signup";
import ResetPassword from "./containers/PasswordResetPage/ResetPassword";
import ResetPasswordConfirm from "./containers/PasswordResetPage/ResetPasswordConfirm";
import UserDashboard from "./containers/UserDashboardPage/UserDashboard";
import LoanDashboard from "./containers/LoanPage/LoanDashboard";
import LoanDetails from "./containers/LoanPage/LoanDetails";
import UpdateLoanForm from "./containers/LoanPage/UpdateLoanForm";
import GuarantorPage from "./containers/GuarantorPage/GuarantorPage";
import ProfileForm from "./components/user/ProfileForm";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthUserRoute from "./components/AuthUserRoute";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" exact element={<Login />} />
          <Route path="/signup" exact element={<Signup />} />
          <Route path="/reset-password" exact element={<ResetPassword />} />
          <Route path="/profile-form" exact element={<ProfileForm />} />

          <Route
            path="/password/reset/confirm/:uid/:token"
            exact
            element={<ResetPasswordConfirm />}
          />
          <Route
            path="/user-dashboard"
            element={
              <AuthUserRoute>
                <UserDashboard />
              </AuthUserRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/loan-dashboard"
            element={
              <ProtectedRoute>
                <LoanDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-details"
            element={
              <ProtectedRoute>
                <UserDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/loan-details"
            element={
              <ProtectedRoute>
                <LoanDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/guarantors"
            element={
              <ProtectedRoute>
                <GuarantorPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-profile"
            element={
              <ProtectedRoute>
                <AddUserForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/update-profile"
            element={
              <ProtectedRoute>
                <UpdateUserForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/update-loan"
            element={
              <ProtectedRoute>
                <UpdateLoanForm />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
