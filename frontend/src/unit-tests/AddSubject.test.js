import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddSubject from '../components/AddSubject';
import DBContext from '../context/DBContext';
import { BrowserRouter as Router } from 'react-router-dom';

const mockSubjectsAPI = {
    post: jest.fn(),
};

const mockDBContextValue = {
    subjectsAPI: mockSubjectsAPI,
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

it('renders AddSubject component', () => {
    renderWithContext(<AddSubject />);
    expect(screen.getByLabelText('Subject Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Short Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Class')).toBeInTheDocument();
    expect(screen.getByLabelText('Teacher')).toBeInTheDocument();
});

it('validates form fields before submission', () => {
    renderWithContext(<AddSubject />);
    fireEvent.click(screen.getByText('Submit'));
    expect(screen.getByText('Name is required.')).toBeInTheDocument();
    expect(screen.getByText('Short Name is required.')).toBeInTheDocument();
    expect(screen.getByText('Class is required.')).toBeInTheDocument();
    expect(screen.getByText('Teacher is required.')).toBeInTheDocument();
});

it('submits form when fields are valid', async () => {
    mockSubjectsAPI.post.mockResolvedValueOnce({ data: { id: '1', subjectName: 'Subject A' } });
    renderWithContext(<AddSubject />);
    fireEvent.change(screen.getByLabelText('Subject Name'), { target: { value: 'Subject A' } });
    fireEvent.change(screen.getByLabelText('Short Name'), { target: { value: 'Sub A' } });
    fireEvent.change(screen.getByLabelText('Class'), { target: { value: 'Class 1' } });
    fireEvent.change(screen.getByLabelText('Teacher'), { target: { value: 'Teacher 1' } });
    fireEvent.click(screen.getByText('Submit'));
    await waitFor(() => expect(mockSubjectsAPI.post).toHaveBeenCalledWith({ postData: { subjectName: 'Subject A', shortName: 'Sub A', classId: 'Class 1', userId: 'Teacher 1' } }));
});

it('navigates to manage subjects page after successful submission', async () => {
    mockSubjectsAPI.post.mockResolvedValueOnce({ data: { id: '1', subjectName: 'Subject A' } });
    renderWithContext(<AddSubject />);
    fireEvent.change(screen.getByLabelText('Subject Name'), { target: { value: 'Subject A' } });
    fireEvent.change(screen.getByLabelText('Short Name'), { target: { value: 'Sub A' } });
    fireEvent.change(screen.getByLabelText('Class'), { target: { value: 'Class 1' } });
    fireEvent.change(screen.getByLabelText('Teacher'), { target: { value: 'Teacher 1' } });
    fireEvent.click(screen.getByText('Submit'));
    await waitFor(() => expect(mockSubjectsAPI.post).toHaveBeenCalled());
    expect(window.location.pathname).toBe('/subjects/manage-subjects');
});

it('displays error message when API call fails', async () => {
    mockSubjectsAPI.post.mockRejectedValueOnce(new Error('API Error'));
    renderWithContext(<AddSubject />);
    fireEvent.change(screen.getByLabelText('Subject Name'), { target: { value: 'Subject A' } });
    fireEvent.change(screen.getByLabelText('Short Name'), { target: { value: 'Sub A' } });
    fireEvent.change(screen.getByLabelText('Class'), { target: { value: 'Class 1' } });
    fireEvent.change(screen.getByLabelText('Teacher'), { target: { value: 'Teacher 1' } });
    fireEvent.click(screen.getByText('Submit'));
    await waitFor(() => expect(mockSubjectsAPI.post).toHaveBeenCalled());
    expect(screen.getByText('There was an error adding the Subject!')).toBeInTheDocument();
});