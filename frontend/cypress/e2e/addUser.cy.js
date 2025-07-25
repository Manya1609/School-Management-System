// cypress/e2e/addUser.cy.js

describe("AddUser Component", () => {
    beforeEach(() => {
        cy.login("admin", "1234"); // Use the custom login command
        cy.visit("localhost:3000/users"); // Replace with your actual route for AddUser
    });

    it("should display the form with all required fields", () => {
        cy.get('input[name="username"]').should("exist");
        cy.get('input[name="password"]').should("exist");
        cy.get('input[name="email"]').should("exist");
        cy.get('input[name="fullName"]').should("exist");
        cy.get('input[name="phoneNumber"]').should("exist");
        cy.get('input[name="address"]').should("exist");
        cy.get('input[name="dateOfBirth"]').should("exist");
    });

    it("should display validation errors when fields are empty", () => {
        cy.get('button[type="submit"]').click();
        cy.url().should("include", "/users/create-new-user");
    });

    it("should submit the form with valid data", () => {
        cy.get('input[name="username"]').type("testUser");
        cy.get('input[name="password"]').type("testPassword");
        cy.get('input[name="email"]').type("test@example.com");
        cy.get('input[name="fullName"]').type("Test User");
        cy.get('input[name="phoneNumber"]').type("1234567890");
        cy.get('input[name="address"]').type("123 Test St");
        cy.get('input[name="dateOfBirth"]').type("2000-01-01");

        cy.intercept("POST", "http://localhost:1234/api/users", {
            statusCode: 201,
            body: { id: 1, username: "testUser", role: "admin" },
        }).as("addUser");

        cy.get('button[type="submit"]').click();

        cy.wait("@addUser").its("response.statusCode").should("eq", 201);
        cy.url().should("include", "/users/manage-users");
    });
});
