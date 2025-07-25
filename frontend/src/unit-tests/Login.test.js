import { fireEvent, render, screen } from "@testing-library/react";
import Login from "../pages/Login";
import { AuthProvider } from "../context/AuthContext";

test("renders Login", async () => {
  render(
    <AuthProvider>
      <Login />
    </AuthProvider>
  );
  let usernameField = await screen.findByRole("textbox");
  expect(usernameField).toBeInTheDocument();
  let passwordField = await screen.findByLabelText(/password/i);
  expect(passwordField).toBeInTheDocument();
  let rememberCheck = await screen.findByRole("checkbox");
  expect(rememberCheck).toBeInTheDocument();
  expect(rememberCheck.checked).toBe(false);
  let btn = await screen.findByRole("button", { type: "submit" });
  expect(btn).toBeInTheDocument();
});
test("invalid login", async () => {
    render(
      <AuthProvider>
        <Login />
      </AuthProvider>
    );
    let btn = await screen.findByRole("button", { type: "submit" });
    fireEvent.click(btn);
    let alert = await screen.findByRole("alert");
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent(/invalid/i);
});
test("valid login", async () => {
  render(
    <AuthProvider>
      <Login />
    </AuthProvider>
  );
  let usernameField = await screen.findByRole("textbox");
  fireEvent.change(usernameField, { target: { value: "admin" } });
  expect(usernameField.value).toBe("admin");
  let passwordField = await screen.findByLabelText(/password/i);
  fireEvent.change(passwordField, { target: { value: "1234" } });
  expect(passwordField.value).toBe("1234");
  let rememberCheck = await screen.findByRole("checkbox");
  fireEvent.click(rememberCheck);
  expect(rememberCheck.checked).toBe(true);
  let btn = await screen.findByRole("button", { type: "submit" });
  fireEvent.click(btn);
  let alert = await screen.findByRole("alert");
  expect(alert).toBeInTheDocument();
  expect(alert).toHaveTextContent(/success/i);
  expect(window.location.assign).toHaveBeenCalledWith('/dashboard');
});
