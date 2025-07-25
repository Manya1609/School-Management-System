describe("ManageUsers Component", () => {
    const user = {
        username: "Admin",
        password: "Admin",
        role: "admin",
        email: "Admin@xyz",
        fullName: "Admin",
        phoneNumber: "1234567890",
        address: "",
        dateOfBirth: "2024-08-12",
        additionalInfo: {},
    };

    beforeEach(() => {
        // Custom command to log in
        cy.login("admin", "1234"); // Replace with actual credentials
        cy.visit("http://localhost:3000/users/manage-users"); // Replace with your actual route for ManageUsers

        // Mock the user context and redux store
        cy.window().then((win) => {
            win.__REACT_CONTEXT__ = {
                users: [user],
                deleteUser: cy.stub().as("deleteUser"),
                setSelectedUser: cy.stub().as("setSelectedUser"),
            };
            win.__REDUX_STORE__ = {
                dispatch: cy.stub().as("dispatch"),
            };
        });
    });

    // get all row data from the data grid, compare req row with the user data
    // it("check Admin info", () => {
    //     cy.get(".MuiDataGrid-row").each((row, index) => {
    //         if (index + 1 === 2) {
    //             cy.wrap(row).within(() => {
    //                 cy.get(".MuiDataGrid-cell")
    //                     .eq(0)
    //                     .contains(index + 1);
    //                 cy.get(".MuiDataGrid-cell").eq(2).contains(user.fullName);
    //                 cy.get(".MuiDataGrid-cell").eq(3).contains(user.username);
    //                 cy.get(".MuiDataGrid-cell")
    //                     .eq(4)
    //                     .contains(user.phoneNumber);
    //                 cy.get(".MuiDataGrid-cell").eq(5).contains(user.email);
    //                 cy.get(".MuiDataGrid-cell").eq(6).click();
    //             });
    //         }
    //     });
    // });

    it("select button", () => {
        cy.get(".MuiButtonBase-root").first().click({ force: true }).then(() => {
            cy.get(".MuiButtonBase-root").first().click();
        });
    })

    // it("should load ModifyUser component when User Context is defined", () => {
    //     // Set the initial user data and action in context and state
    //     cy.window().then((win) => {
    //         const context = win.__REACT_CONTEXT__;
    //         context.setSelectedUser(user);

    //         // Simulate state update for setActionTaken
    //         win.__SET_ACTION_TAKEN__ = cy.stub().as("setActionTaken");
    //         win.__SET_ACTION_TAKEN__("edit");
    //     });

    //     // Verify that the ModifyUser component is rendered
    //     cy.get("form").should("exist");

    //     // // Verify that the ModifyUser component is rendered with the correct user data
    //     // cy.get('input[name="username"]').should("have.value", user.username);
    //     // cy.get('input[name="password"]').should("have.value", user.password);
    //     // cy.get('input[name="email"]').should("have.value", user.email);
    //     // cy.get('input[name="fullName"]').should("have.value", user.fullName);
    //     // cy.get('input[name="phoneNumber"]').should(
    //     //     "have.value",
    //     //     user.phoneNumber
    //     // );
    // });
});
