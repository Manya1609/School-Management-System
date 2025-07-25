import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddExam from '../components/AddExam';
import DBContext from '../context/DBContext';
import { BrowserRouter as Router } from 'react-router-dom';

const mockExamsAPI = {
    post: jest.fn(),
};

const mockDBContextValue = {
    examsAPI: mockExamsAPI,
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

it('renders AddExam component', () => {
    renderWithContext(<AddExam />);
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Term')).toBeInTheDocument();
});

it('validates form fields before submission', () => {
    renderWithContext(<AddExam />);
    fireEvent.click(screen.getByText('Submit'));
    expect(screen.getByText('Name is required.')).toBeInTheDocument();
    expect(screen.getByText('Term is required.')).toBeInTheDocument();
});

it('submits form when fields are valid', async () => {
    mockExamsAPI.post.mockResolvedValueOnce({ data: { id: '1', name: 'Exam 1' } });
    renderWithContext(<AddExam />);
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Exam 1' } });
    fireEvent.change(screen.getByLabelText('Term'), { target: { value: 'Term 1' } });
    fireEvent.click(screen.getByText('Submit'));
    await waitFor(() => expect(mockExamsAPI.post).toHaveBeenCalledWith({ postData: { name: 'Exam 1', term: 'Term 1' } }));
});

it('navigates to manage exams page after successful submission', async () => {
    mockExamsAPI.post.mockResolvedValueOnce({ data: { id: '1', name: 'Exam 1' } });
    renderWithContext(<AddExam />);
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Exam 1' } });
    fireEvent.change(screen.getByLabelText('Term'), { target: { value: 'Term 1' } });
    fireEvent.click(screen.getByText('Submit'));
    await waitFor(() => expect(mockExamsAPI.post).toHaveBeenCalled());
    expect(window.location.pathname).toBe('/exams/exam-list/manage-exams');
});

it('displays error message when API call fails', async () => {
    mockExamsAPI.post.mockRejectedValueOnce(new Error('API Error'));
    renderWithContext(<AddExam />);
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Exam 1' } });
    fireEvent.change(screen.getByLabelText('Term'), { target: { value: 'Term 1' } });
    fireEvent.click(screen.getByText('Submit'));
    await waitFor(() => expect(mockExamsAPI.post).toHaveBeenCalled());
    expect(screen.getByText('There was an error adding the Exam!')).toBeInTheDocument();
});