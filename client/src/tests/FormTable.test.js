import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import FormTable from '../components/FormTable';
import '@testing-library/jest-dom';

describe('Musical Forms table (FormTable)', () => {
    beforeEach(() => {
        // Mock the fetch function
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({
                    Forms: [
                        { name: 'Symphony', category: 'Orchestral Works', count: 10 },
                        { name: 'Piano Concerto', category: 'Concertos', count: 8 },
                        { name: 'Piano Sonata', category: 'Sonatas', count: 6 }
                    ],
                })
            })
        );
    });
  
    afterEach(() => {
        jest.resetAllMocks();
    });

    it('renders forms when data is available', async () => {
        render(
            <MemoryRouter>
                <FormTable />
            </MemoryRouter>
        );
        
        await waitFor(() => {
            expect(screen.getByText('Symphony')).toBeInTheDocument();
        });
        await waitFor(() => {
            expect(screen.getByText('Piano Concerto')).toBeInTheDocument();
        });
        await waitFor(() => {
            expect(screen.getByText('Piano Sonata')).toBeInTheDocument();
        });
    });

    it('renders links with correct hrefs', async () => {
        render(
            <MemoryRouter>
                <FormTable />
            </MemoryRouter>
        );

        for (const form of ['Symphony', 'Piano Concerto', 'Piano Sonata']) {
            await waitFor(() => {
                const link = screen.getByRole('link', { name: form });
                expect(link).toHaveAttribute('href', `/form/${encodeURIComponent(form)}`);
            });
        }
    });

    it('filters forms based on search input', async () => {
        render(
            <MemoryRouter>
                <FormTable />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Piano Concerto')).toBeInTheDocument();
        });

        const searchInput = screen.getByPlaceholderText('Search musical forms...');
        fireEvent.change(searchInput, { target: { value: 'Piano' } });

        await waitFor(() => {
            expect(screen.queryByText('Symphony')).not.toBeInTheDocument();
        });
        await waitFor(() => {
            expect(screen.getByText('Piano Concerto')).toBeInTheDocument();
        });
        await waitFor(() => {
            expect(screen.getByText('Piano Sonata')).toBeInTheDocument();
        });
    });
});
