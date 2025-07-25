import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UnifiedManageTable from '../components/UnifiedManageTable';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';

jest.mock('xlsx', () => ({
    utils: {
        json_to_sheet: jest.fn(),
        book_new: jest.fn(),
        book_append_sheet: jest.fn(),
    },
    writeFile: jest.fn(),
}));

jest.mock('jspdf', () => {
    const jsPDF = jest.fn(() => ({
        autoTable: jest.fn(),
        save: jest.fn(),
    }));
    return jsPDF;
});

const mockDataRecords = [
    { id: '1', name: 'John Doe', age: 30 },
    { id: '2', name: 'Jane Smith', age: 25 },
];

const mockDataColumns = [
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'age', headerName: 'Age', width: 100 },
];

const mockActionItems = [
    { menuElement: <span>View</span>, handler: jest.fn() },
    { menuElement: <span>Edit</span>, handler: jest.fn() },
];

beforeEach(() => {
    jest.clearAllMocks();
});

it('renders UnifiedManageTable component', () => {
    render(<UnifiedManageTable dataRecords={mockDataRecords} dataColumns={mockDataColumns} />);
    expect(screen.getByText('Filter:')).toBeInTheDocument();
});

it('filters rows based on search text', () => {
    render(<UnifiedManageTable dataRecords={mockDataRecords} dataColumns={mockDataColumns} searchFields={['name']} />);
    fireEvent.change(screen.getByPlaceholderText('Type to filter'), { target: { value: 'Jane' } });
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
});

it('exports data to Excel', () => {
    render(<UnifiedManageTable dataRecords={mockDataRecords} dataColumns={mockDataColumns} />);
    fireEvent.click(screen.getByLabelText('Export as Excel'));
    expect(XLSX.utils.json_to_sheet).toHaveBeenCalledWith(mockDataRecords);
    expect(XLSX.writeFile).toHaveBeenCalled();
});

it('exports data to PDF', () => {
    render(<UnifiedManageTable dataRecords={mockDataRecords} dataColumns={mockDataColumns} />);
    fireEvent.click(screen.getByLabelText('Export as PDF'));
    expect(jsPDF).toHaveBeenCalled();
    expect(jsPDF().autoTable).toHaveBeenCalled();
    expect(jsPDF().save).toHaveBeenCalled();
});

it('copies data to clipboard', async () => {
    render(<UnifiedManageTable dataRecords={mockDataRecords} dataColumns={mockDataColumns} />);
    Object.assign(navigator, {
        clipboard: {
            writeText: jest.fn().mockResolvedValue(),
        },
    });
    fireEvent.click(screen.getByLabelText('Copy'));
    await waitFor(() => expect(navigator.clipboard.writeText).toHaveBeenCalled());
    expect(screen.getByText('Copied to clipboard')).toBeInTheDocument();
});

it('toggles column visibility', () => {
    render(<UnifiedManageTable dataRecords={mockDataRecords} dataColumns={mockDataColumns} />);
    fireEvent.click(screen.getByText('Visibility'));
    fireEvent.click(screen.getByLabelText('Name'));
    expect(screen.queryByText('Name')).not.toBeInTheDocument();
});

it('handles action item click', () => {
    render(<UnifiedManageTable dataRecords={mockDataRecords} dataColumns={mockDataColumns} actionItems={mockActionItems} />);
    fireEvent.click(screen.getByText('Action'));
    fireEvent.click(screen.getByText('View'));
    expect(mockActionItems[0].handler).toHaveBeenCalledWith(mockDataRecords[0]);
});