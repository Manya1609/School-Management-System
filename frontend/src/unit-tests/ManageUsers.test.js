import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { BrowserRouter as Router } from "react-router-dom";
import ManageUsers from "../pages/ManageUsers";
import { UserContext } from "../context/UserContext";
import { Provider } from "react-redux";
import {
    lightTheme,
    Provider as SpectrumProvider,
} from "@adobe/react-spectrum";
import configureStore from "redux-mock-store";
import { jest } from "@jest/globals";

// Mocking necessary imports and components
jest.mock("axios");
const mockStore = configureStore([]);

beforeAll(() => {
    HTMLCanvasElement.prototype.getContext = jest.fn();
});

describe("ManageUsers Component", () => {
    let store;
    const mockDeleteUser = jest.fn();
    const mockSetSelectedUser = jest.fn();

    const users = [
        {
            id: "3aac",
            username: "SuperAdmin",
            password: "SuperAdmin",
            role: "super_admin",
            email: "SuperAdmin@xyz",
            fullName: "SuperAdmin",
            phoneNumber: "1234567890",
            address: "",
            dateOfBirth: "2024-08-04",
            additionalInfo: {},
            sn: 1,
        },
        {
            id: "6833",
            username: "Admin",
            password: "Admin",
            role: "admin",
            email: "Admin@xyz",
            fullName: "Admin",
            phoneNumber: "1234567890",
            address: "",
            dateOfBirth: "2024-08-12",
            additionalInfo: {},
            sn: 2,
        },
    ];

    beforeEach(() => {
        store = mockStore({
            counter: 0,
        });

        HTMLCanvasElement.prototype.getContext = jest.fn();

        render(
            <SpectrumProvider theme={lightTheme}>
                <Provider store={store}>
                    <UserContext.Provider
                        value={{
                            users: users,
                            deleteUser: mockDeleteUser,
                            selectedUser: null,
                            setSelectedUser: mockSetSelectedUser,
                        }}
                    >
                        <Router>
                            <ManageUsers />
                        </Router>
                    </UserContext.Provider>
                </Provider>
            </SpectrumProvider>
        );
    });

    it("renders ManageUsers with correct initial state", () => {
        const h1Elements = screen.getAllByText("Manage Users");
        expect(h1Elements.length).toBeGreaterThan(0);

        const table = screen.getByRole("tablist");
        expect(table).toBeInTheDocument();
    });

    it("renders the table with correct columns", () => {
        const columns = screen.getAllByRole("textbox");
        expect(columns.length).toBe(5);
    });

    it("change tab to Add User", async () => {
        const tabList = screen.getByRole("tablist");
        const addTab = tabList.children[0];
        fireEvent.click(addTab);

        // Wait for the "Add User" text to appear
        await waitFor(() => {
            expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
        });
    });

    it("change tab to Manage Users", async () => {
        const tabList = screen.getByRole("tablist");
        const manageTab = tabList.children[1];
        fireEvent.click(manageTab);

        // Wait for the "Manage Users" text to appear
        await waitFor(() => {
            const rows = screen.getAllByRole("row");
            expect(rows.length).toBe(users.length + 1);
        });
    });

    it("view user details", async () => {
        const tabList = screen.getByRole("tablist");
        const manageTab = tabList.children[1];
        fireEvent.click(manageTab);

        // Wait for the "Manage Users" text to appear
        await waitFor(() => {
            const rows = screen.getAllByRole("row");
            expect(rows.length).toBe(users.length + 1);
        });
        
        const viewButton = screen.getAllByRole("button");
        fireEvent.click(viewButton[5]);
        
        // get children of the button
        const viewButtonChildren = viewButton[5].children;
        fireEvent.click(viewButtonChildren[0]);

        // Wait for the "View User" text to appear
        await waitFor(() => {
            expect(screen.getByText("View User")).toBeInTheDocument();
        });
    });
});
