import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddClass from '../components/AddClass';
import DBContext from '../context/DBContext';
import { BrowserRouter as Router } from 'react-router-dom';

const mockClassesAPI = {
    post: jest.fn(),
};

const mockDBContextValue = {
    classesAPI: mockClassesAPI,
};

const renderWithContext = (ui) => {
    return render(
        <DBContext.Provider value={mockDBContextValue}>
            <Router>
                {ui}
            </Router>
        </DBContext.Provider>
    );
};

beforeEach(() => {
    jest.clearAllMocks();
});

it('renders AddClass component', () => {
    renderWithContext(<AddClass />);
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Class Type')).toBeInTheDocument();
});

it('validates form fields before submission', () => {
    renderWithContext(<AddClass />);
    fireEvent.click(screen.getByText('Submit'));
    expect(screen.getByText('Name is required.')).toBeInTheDocument();
    expect(screen.getByText('Class Type is required.')).toBeInTheDocument();
});

it('submits form when fields are valid', async () => {
    mockClassesAPI.post.mockResolvedValueOnce({ data: { id: '1', name: 'Class 1' } });
    renderWithContext(<AddClass />);
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Class 1' } });
    fireEvent.change(screen.getByLabelText('Class Type'), { target: { value: 'Type 1' } });
    fireEvent.click(screen.getByText('Submit'));
    await waitFor(() => expect(mockClassesAPI.post).toHaveBeenCalledWith({ postData: { name: 'Class 1', classType: 'Type 1' } }));
});

it('navigates to manage classes page after successful submission', async () => {
    mockClassesAPI.post.mockResolvedValueOnce({ data: { id: '1', name: 'Class 1' } });
    renderWithContext(<AddClass />);
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Class 1' } });
    fireEvent.change(screen.getByLabelText('Class Type'), { target: { value: 'Type 1' } });
    fireEvent.click(screen.getByText('Submit'));
    await waitFor(() => expect(mockClassesAPI.post).toHaveBeenCalled());
    expect(window.location.pathname).toBe('/classes/manage-classes');
});

it('displays error message when API call fails', async () => {
    mockClassesAPI.post.mockRejectedValueOnce(new Error('API Error'));
    renderWithContext(<AddClass />);
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Class 1' } });
    fireEvent.change(screen.getByLabelText('Class Type'), { target: { value: 'Type 1' } });
    fireEvent.click(screen.getByText('Submit'));
    await waitFor(() => expect(mockClassesAPI.post).toHaveBeenCalled());
    expect(screen.getByText('There was an error while adding the class!')).toBeInTheDocument();
});