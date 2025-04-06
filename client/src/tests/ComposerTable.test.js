import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ComposerTable from '../components/ComposerTable';
import '@testing-library/jest-dom';

describe('Composer table (ComposerTable)', () => {
    beforeEach(() => {
        // Mock the fetch function
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({
                    Composers: [
                        {name: 'Beethoven', birthyear: 1770, period: 'Classical'}, 
                        {name: 'Mozart', birthyear: 1756, period: 'Classical'}, 
                        {name: 'Bach', birthyear: 1685, period: 'Baroque'}
                    ],
                })
            })
        );
    });
  
    afterEach(() => {
        jest.resetAllMocks();
    });

    it('renders composers when data is available', async () => {
        render(
            <MemoryRouter>
                <ComposerTable />
            </MemoryRouter>
        );
        
        await waitFor(() => {
            expect(screen.getByText('Bach')).toBeInTheDocument();
        });
        await waitFor(() => {
            expect(screen.getByText('Mozart')).toBeInTheDocument();
        });
        await waitFor(() => {
            expect(screen.getByText('Beethoven')).toBeInTheDocument();
        });
    });

    it('renders links with correct hrefs', async () => {
        render(
            <MemoryRouter>
                <ComposerTable />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Bach')).toBeInTheDocument();
        });

        ['Bach', 'Mozart', 'Beethoven'].forEach((composer) => {
            // Look for a link containing the composer name
            const link = screen.getByRole('link', { name: new RegExp(composer) });
            expect(link).toHaveAttribute('href', `/composer/${composer}`);
        });
    });

    it('displays birth years', async () => {
        render(
            <MemoryRouter>
                <ComposerTable />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText(/1685/)).toBeInTheDocument(); // Bach
        });
        await waitFor(() => {
            expect(screen.getByText(/1756/)).toBeInTheDocument(); // Mozart
        });
        await waitFor(() => {
            expect(screen.getByText(/1770/)).toBeInTheDocument(); // Beethoven
        });
    });
});

