import { render, screen, waitFor } from '@testing-library/react';
import ClassStatsView from '../components/ClassStatsView';
import DBContext from '../context/DBContext';
import { BrowserRouter as Router } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

jest.mock('../hooks/useAuth');

const mockSubjectsAPI = {
    getSubjectsAssignedTo: jest.fn(),
};

const mockClassesAPI = {
    sections: {
        getSectionAssignedTo: jest.fn(),
    },
};

const mockDBContextValue = {
    subjectsAPI: mockSubjectsAPI,
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
    useAuth.mockReturnValue({ user: { userId: '123' } });
});

it('renders ClassStatsView component', () => {
    renderWithContext(<ClassStatsView />);
    expect(screen.getByText('My Class')).toBeInTheDocument();
    expect(screen.getByText('My Subjects')).toBeInTheDocument();
});

it('displays stats correctly when API calls are successful', async () => {
    mockClassesAPI.sections.getSectionAssignedTo.mockResolvedValueOnce({ className: 'Class 1', sectionName: 'A' });
    mockSubjectsAPI.getSubjectsAssignedTo.mockResolvedValueOnce([{ subjectName: 'Math' }, { subjectName: 'Science' }]);
    renderWithContext(<ClassStatsView />);
    await waitFor(() => {
        expect(screen.getByText('Class 1 - A')).toBeInTheDocument();
        expect(screen.getByText('Math')).toBeInTheDocument();
        expect(screen.getByText('Science')).toBeInTheDocument();
    });
});

it('displays placeholder when stats are not available', async () => {
    mockClassesAPI.sections.getSectionAssignedTo.mockResolvedValueOnce({});
    mockSubjectsAPI.getSubjectsAssignedTo.mockResolvedValueOnce([]);
    renderWithContext(<ClassStatsView />);
    await waitFor(() => {
        expect(screen.getByText('...')).toBeInTheDocument();
    });
});

it('displays error message when API calls fail', async () => {
    mockClassesAPI.sections.getSectionAssignedTo.mockRejectedValueOnce(new Error('API Error'));
    mockSubjectsAPI.getSubjectsAssignedTo.mockRejectedValueOnce(new Error('API Error'));
    renderWithContext(<ClassStatsView />);
    await waitFor(() => {
        expect(screen.getByText('...')).toBeInTheDocument();
    });
});