import { render, screen, waitFor } from '@testing-library/react';
import AdminStatsView from '../components/AdminStatsView';
import DBContext from '../context/DBContext';
import { BrowserRouter as Router } from 'react-router-dom';

const mockSystemAPI = {
    getStats: jest.fn(),
};

const mockDBContextValue = {
    systemAPI: mockSystemAPI,
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

it('renders AdminStatsView component', () => {
    renderWithContext(<AdminStatsView />);
    expect(screen.getByText('Total Students')).toBeInTheDocument();
    expect(screen.getByText('Total Teachers')).toBeInTheDocument();
    expect(screen.getByText('Total Admins')).toBeInTheDocument();
    expect(screen.getByText('Total Classes')).toBeInTheDocument();
});

it('displays stats correctly when API call is successful', async () => {
    mockSystemAPI.getStats.mockResolvedValueOnce({
        studentsCount: 100,
        teachersCount: 20,
        adminsCount: 5,
        classesCount: 10,
    });
    renderWithContext(<AdminStatsView />);
    await waitFor(() => {
        expect(screen.getByText('100')).toBeInTheDocument();
        expect(screen.getByText('20')).toBeInTheDocument();
        expect(screen.getByText('5')).toBeInTheDocument();
        expect(screen.getByText('10')).toBeInTheDocument();
    });
});

it('displays placeholder when stats are not available', async () => {
    mockSystemAPI.getStats.mockResolvedValueOnce({});
    renderWithContext(<AdminStatsView />);
    await waitFor(() => {
        expect(screen.getAllByText('...').length).toBe(4);
    });
});

it('displays error message when API call fails', async () => {
    mockSystemAPI.getStats.mockRejectedValueOnce(new Error('API Error'));
    renderWithContext(<AdminStatsView />);
    await waitFor(() => {
        expect(screen.getByText('Error loading stats')).toBeInTheDocument();
    });
});