describe("ModifyUser Component", () => {
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
        cy.visit("http://localhost:3000/users/manage-users"); // Replace with your actual route for ModifyUser

        // Mock the user context and redux store
        cy.window().then((win) => {
            win.__REACT_CONTEXT__ = {
                updateUser: cy.stub().as("updateUser"),
                setSelectedUser: cy.stub().as("setSelectedUser"),
            };
            win.__REDUX_STORE__ = {
                dispatch: cy.stub().as("dispatch"),
            };
        });

        // Set the initial user data
        cy.window()
            .its("__REACT_CONTEXT__")
            .then((context) => {
                context.setSelectedUser(user);
            });
    });

    it("should render the form with pre-filled user data", () => {
        cy.get('input[name="username"]').should("have.value", user.username);
        cy.get('input[name="password"]').should("have.value", user.password);
        cy.get('input[name="email"]').should("have.value", user.email);
        cy.get('input[name="fullName"]').should("have.value", user.fullName);
        cy.get('input[name="phoneNumber"]').should(
            "have.value",
            user.phoneNumber
        );
        cy.get('select[name="role"]').should("have.value", user.role);
    });

    it("should display validation errors when fields are empty", () => {
        cy.get('input[name="username"]').clear();
        cy.get('input[name="password"]').clear();
        cy.get('input[name="email"]').clear();
        cy.get('input[name="fullName"]').clear();
        cy.get('input[name="phoneNumber"]').clear();
        cy.get('button[type="submit"]').click();

        cy.get('input[name="username"] + .Mui-error').should(
            "contain",
            "Username is required."
        );
        cy.get('input[name="password"] + .Mui-error').should(
            "contain",
            "Password is required."
        );
        cy.get('input[name="email"] + .Mui-error').should(
            "contain",
            "Email is required."
        );
        cy.get('input[name="fullName"] + .Mui-error').should(
            "contain",
            "Full Name is required."
        );
        cy.get('input[name="phoneNumber"] + .Mui-error').should(
            "contain",
            "Phone Number is required."
        );
    });

    it("should display validation error for invalid phone number", () => {
        cy.get('input[name="phoneNumber"]').clear().type("12345");
        cy.get('button[type="submit"]').click();

        cy.get('input[name="phoneNumber"] + .Mui-error').should(
            "contain",
            "Phone Number must be 10 digits long."
        );
    });

    it("should display validation error for role change", () => {
        cy.get('select[name="role"]').select("student");
        cy.get('button[type="submit"]').click();

        cy.get('select[name="role"] + .Mui-error').should(
            "contain",
            `Role of ${user.role} cannot be changed to student.`
        );
    });

    it("should submit the form with valid data", () => {
        cy.get('input[name="username"]').clear().type("newUser");
        cy.get('input[name="password"]').clear().type("newPassword");
        cy.get('input[name="email"]').clear().type("new@example.com");
        cy.get('input[name="fullName"]').clear().type("New User");
        cy.get('input[name="phoneNumber"]').clear().type("0987654321");

        cy.intercept("PUT", "http://localhost:1234/users", {
            statusCode: 200,
            body: { id: 1, username: "newUser", role: "admin" },
        }).as("modifyUser");

        cy.get('button[type="submit"]').click();

        cy.wait("@modifyUser").its("response.statusCode").should("eq", 200);
        cy.url().should("include", "/users/manage-users");
    });
});
