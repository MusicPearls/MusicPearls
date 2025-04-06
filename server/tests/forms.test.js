const { getFormsHandler } = require('../routes/forms');
const { fetchData } = require('../utils');

jest.mock('../utils'); // mock the module to control the test data

describe('getFormsHandler', () => {
    it('should return sorted list of forms with counts', async () => {
        const fakeOpus = [
            { form: 'Symphony' },
            { form: 'Symphony' },
            { form: 'Concerto' }
        ];

        const fakeForms = {
            forms: [
                { formName: 'Symphony', category: 'Orchestral Works' },
                { formName: 'Concerto', category: 'Orchestral Works' }
            ]
        };

        fetchData
            .mockResolvedValueOnce(fakeOpus)  // 1st call: opus.json
            .mockResolvedValueOnce(fakeForms); // 2nd call: forms.json

        const req = {};
        const res = {
            json: jest.fn(),
            status: jest.fn(() => res),
            send: jest.fn()
        };

        await getFormsHandler(req, res);

        expect(res.json).toHaveBeenCalledWith({
            Forms: [
                { name: 'Symphony', category: 'Orchestral Works', count: 2 },
                { name: 'Concerto', category: 'Orchestral Works', count: 1 }
            ]
        });
    });

    it('should return 500 on error', async () => {
        fetchData.mockRejectedValue(new Error('Failed'));

        const req = {};
        const res = {
            json: jest.fn(),
            status: jest.fn(() => res),
            send: jest.fn()
        };

        await getFormsHandler(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith('Server Error');
    });
});