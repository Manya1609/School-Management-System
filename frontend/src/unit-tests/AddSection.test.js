import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddSection from '../components/AddSection';
import DBContext from '../context/DBContext';
import { BrowserRouter as Router } from 'react-router-dom';

const mockSectionsAPI = {
    post: jest.fn(),
};

const mockDBContextValue = {
    sectionsAPI: mockSectionsAPI,
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

it('renders AddSection component', () => {
    renderWithContext(<AddSection />);
    expect(screen.getByLabelText('Section Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Class')).toBeInTheDocument();
    expect(screen.getByLabelText('Teacher')).toBeInTheDocument();
});

it('validates form fields before submission', () => {
    renderWithContext(<AddSection />);
    fireEvent.click(screen.getByText('Submit'));
    expect(screen.getByText('Name is required.')).toBeInTheDocument();
    expect(screen.getByText('Class is required.')).toBeInTheDocument();
    expect(screen.getByText('Teacher is required.')).toBeInTheDocument();
});

it('submits form when fields are valid', async () => {
    mockSectionsAPI.post.mockResolvedValueOnce({ data: { id: '1', name: 'Section A' } });
    renderWithContext(<AddSection />);
    fireEvent.change(screen.getByLabelText('Section Name'), { target: { value: 'Section A' } });
    fireEvent.change(screen.getByLabelText('Class'), { target: { value: 'Class 1' } });
    fireEvent.change(screen.getByLabelText('Teacher'), { target: { value: 'Teacher 1' } });
    fireEvent.click(screen.getByText('Submit'));
    await waitFor(() => expect(mockSectionsAPI.post).toHaveBeenCalledWith({ postData: { name: 'Section A', classId: 'Class 1', userId: 'Teacher 1' } }));
});

it('navigates to manage sections page after successful submission', async () => {
    mockSectionsAPI.post.mockResolvedValueOnce({ data: { id: '1', name: 'Section A' } });
    renderWithContext(<AddSection />);
    fireEvent.change(screen.getByLabelText('Section Name'), { target: { value: 'Section A' } });
    fireEvent.change(screen.getByLabelText('Class'), { target: { value: 'Class 1' } });
    fireEvent.change(screen.getByLabelText('Teacher'), { target: { value: 'Teacher 1' } });
    fireEvent.click(screen.getByText('Submit'));
    await waitFor(() => expect(mockSectionsAPI.post).toHaveBeenCalled());
    expect(window.location.pathname).toBe('/sections/manage-sections');
});

it('displays error message when API call fails', async () => {
    mockSectionsAPI.post.mockRejectedValueOnce(new Error('API Error'));
    renderWithContext(<AddSection />);
    fireEvent.change(screen.getByLabelText('Section Name'), { target: { value: 'Section A' } });
    fireEvent.change(screen.getByLabelText('Class'), { target: { value: 'Class 1' } });
    fireEvent.change(screen.getByLabelText('Teacher'), { target: { value: 'Teacher 1' } });
    fireEvent.click(screen.getByText('Submit'));
    await waitFor(() => expect(mockSectionsAPI.post).toHaveBeenCalled());
    expect(screen.getByText('There was an error adding the Section!')).toBeInTheDocument();
});