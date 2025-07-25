import { render, screen, waitFor } from '@testing-library/react';
import GridCalendar from '../components/GridCalendar';
import DBContext from '../context/DBContext';
import { BrowserRouter as Router } from 'react-router-dom';

const mockNoticesAPI = {
    get: jest.fn(),
};

const mockDBContextValue = {
    noticesAPI: mockNoticesAPI,
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

it('renders GridCalendar component', () => {
    renderWithContext(<GridCalendar />);
    expect(screen.getByText('dayGridMonth')).toBeInTheDocument();
});

it('displays calendar events correctly when API call is successful', async () => {
    mockNoticesAPI.get.mockResolvedValueOnce([
        { id: '1', title: 'Event 1', dueDate: '2023-10-01' },
        { id: '2', title: 'Event 2', dueDate: '2023-10-02' },
    ]);
    renderWithContext(<GridCalendar />);
    await waitFor(() => {
        expect(screen.getByText('Event 1')).toBeInTheDocument();
        expect(screen.getByText('Event 2')).toBeInTheDocument();
    });
});

it('displays truncated event titles correctly', async () => {
    mockNoticesAPI.get.mockResolvedValueOnce([
        { id: '1', title: 'A very long event title that should be truncated', dueDate: '2023-10-01' },
    ]);
    renderWithContext(<GridCalendar />);
    await waitFor(() => {
        expect(screen.getByText('A very long event...')).toBeInTheDocument();
    });
});

it('displays no events when API call returns empty array', async () => {
    mockNoticesAPI.get.mockResolvedValueOnce([]);
    renderWithContext(<GridCalendar />);
    await waitFor(() => {
        expect(screen.queryByText('Event')).not.toBeInTheDocument();
    });
});

it('displays error message when API call fails', async () => {
    mockNoticesAPI.get.mockRejectedValueOnce(new Error('API Error'));
    renderWithContext(<GridCalendar />);
    await waitFor(() => {
        expect(screen.getByText('Error loading events')).toBeInTheDocument();
    });
});