import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddGrade from '../components/AddGrade';
import DBContext from '../context/DBContext';
import { BrowserRouter as Router } from 'react-router-dom';

const mockGradesAPI = {
    post: jest.fn(),
};

const mockDBContextValue = {
    gradesAPI: mockGradesAPI,
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

it('renders AddGrade component', () => {
    renderWithContext(<AddGrade />);
    expect(screen.getByLabelText('Grade Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Grade Type')).toBeInTheDocument();
});

it('validates form fields before submission', () => {
    renderWithContext(<AddGrade />);
    fireEvent.click(screen.getByText('Submit'));
    expect(screen.getByText('Name is required.')).toBeInTheDocument();
    expect(screen.getByText('Starting Range of marks is required.')).toBeInTheDocument();
    expect(screen.getByText('Ending Range of marks is required.')).toBeInTheDocument();
    expect(screen.getByText('Remarks is required.')).toBeInTheDocument();
});

it('submits form when fields are valid', async () => {
    mockGradesAPI.post.mockResolvedValueOnce({ data: { id: '1', gradeName: 'Grade A' } });
    renderWithContext(<AddGrade />);
    fireEvent.change(screen.getByLabelText('Grade Name'), { target: { value: 'Grade A' } });
    fireEvent.change(screen.getByLabelText('Grade Type'), { target: { value: 'Type 1' } });
    fireEvent.change(screen.getByLabelText('Starting Range of marks'), { target: { value: '50' } });
    fireEvent.change(screen.getByLabelText('Ending Range of marks'), { target: { value: '100' } });
    fireEvent.change(screen.getByLabelText('Remarks'), { target: { value: 'Excellent' } });
    fireEvent.click(screen.getByText('Submit'));
    await waitFor(() => expect(mockGradesAPI.post).toHaveBeenCalledWith({ postData: { gradeName: 'Grade A', gradeType: 'Type 1', markFrom: '50', markTo: '100', gradeRemark: 'Excellent' } }));
});

it('navigates to manage grades page after successful submission', async () => {
    mockGradesAPI.post.mockResolvedValueOnce({ data: { id: '1', gradeName: 'Grade A' } });
    renderWithContext(<AddGrade />);
    fireEvent.change(screen.getByLabelText('Grade Name'), { target: { value: 'Grade A' } });
    fireEvent.change(screen.getByLabelText('Grade Type'), { target: { value: 'Type 1' } });
    fireEvent.change(screen.getByLabelText('Starting Range of marks'), { target: { value: '50' } });
    fireEvent.change(screen.getByLabelText('Ending Range of marks'), { target: { value: '100' } });
    fireEvent.change(screen.getByLabelText('Remarks'), { target: { value: 'Excellent' } });
    fireEvent.click(screen.getByText('Submit'));
    await waitFor(() => expect(mockGradesAPI.post).toHaveBeenCalled());
    expect(window.location.pathname).toBe('/exams/grades/manage-grades');
});

it('displays error message when API call fails', async () => {
    mockGradesAPI.post.mockRejectedValueOnce(new Error('API Error'));
    renderWithContext(<AddGrade />);
    fireEvent.change(screen.getByLabelText('Grade Name'), { target: { value: 'Grade A' } });
    fireEvent.change(screen.getByLabelText('Grade Type'), { target: { value: 'Type 1' } });
    fireEvent.change(screen.getByLabelText('Starting Range of marks'), { target: { value: '50' } });
    fireEvent.change(screen.getByLabelText('Ending Range of marks'), { target: { value: '100' } });
    fireEvent.change(screen.getByLabelText('Remarks'), { target: { value: 'Excellent' } });
    fireEvent.click(screen.getByText('Submit'));
    await waitFor(() => expect(mockGradesAPI.post).toHaveBeenCalled());
    expect(screen.getByText('There was an error adding the Exam!')).toBeInTheDocument();
});