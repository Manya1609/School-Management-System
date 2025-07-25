// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
let mockAssign = jest.fn();
delete window.location;
window.location = {assign: mockAssign};
afterEach(()=>{
    mockAssign.mockClear();
});