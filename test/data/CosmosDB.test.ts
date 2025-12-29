import { CosmosClient } from '@azure/cosmos';

// Mock values need to be defined inside the factory or be simple literals
const mockFetchAll = jest.fn();
const mockQuery = jest.fn(() => ({ fetchAll: mockFetchAll }));
const mockCreate = jest.fn();
const mockDelete = jest.fn();
const mockItem = jest.fn(() => ({ delete: mockDelete }));
const mockContainer = {
    items: {
        create: mockCreate,
        query: mockQuery
    },
    item: mockItem
};
const mockDatabase = {
    container: jest.fn(() => mockContainer)
};

// We can't use these variables inside jest.mock because of hoisting.
// We have to rely on the module system or do tricky things.
// Instead, let's use doMock to avoid hoisting or define simple structure in mock.

jest.mock('@azure/cosmos', () => {
    const mContainer = {
        items: {
            create: jest.fn(),
            query: jest.fn(() => ({ fetchAll: jest.fn() }))
        },
        item: jest.fn(() => ({ delete: jest.fn() }))
    };
    const mDatabase = {
        container: jest.fn(() => mContainer)
    };
    const mClient = {
        database: jest.fn(() => mDatabase)
    };

    return {
        CosmosClient: jest.fn(() => mClient)
    };
});

// Import after mock
import { CosmosDB } from '../../src/data/CosmosDB';

// Now we need to get a reference to the mocks to assert on them.
// Since we created new functions inside the factory, we can't reference them directly.
// But we can require the mocked module and get the mock instance.
const MockCosmosClient = CosmosClient as unknown as jest.Mock;
// Because CosmosDB instantiates it immediately, get the instance:
const clientInstance = MockCosmosClient.mock.results[0].value;
const dbInstance = clientInstance.database.mock.results[0].value;
const containerInstance = dbInstance.container.mock.results[0].value;

// Helper to access mock functions
const getMockCreate = () => containerInstance.items.create;
const getMockQuery = () => containerInstance.items.query;
// accessing nested mock return values is tricky if they are jest.fn() created inside factory.
// Let's verify what we get.

describe('CosmosDB Data Layer', () => {
    // We need to re-assign our "local" mock handles to the actual mocks created in the factory
    // OR we could use 'jest.requireMock'? 
    // Actually, simpler way: use var at top level but prepended with `mock`?
    // No, jest hoisting blocks that for complex objects.

    // Better strategy: Use the mocks we grabbed from the instance.

    beforeEach(() => {
        jest.clearAllMocks();
        // Since the mocks are reused, we just clear them.
    });

    describe('saveScore', () => {
        it('should create a new item in the container', async () => {
            const mockScore = {
                userName: 'TestUser',
                time: 100,
                difficulty: 'easy' as const,
                date: '2023-01-01'
            };

            const expectedResource = { id: 'generated-id', ...mockScore };
            getMockCreate().mockResolvedValue({ resource: expectedResource });

            const result = await CosmosDB.saveScore(mockScore);

            expect(getMockCreate()).toHaveBeenCalledWith(expect.objectContaining({
                userName: 'TestUser',
                time: 100,
                difficulty: 'easy'
            }));
            expect(result).toEqual(expectedResource);
        });
    });

    describe('getScores', () => {
        it('should query filtering by difficulty', async () => {
            const mockResources = [{ id: '1', time: 100 }];

            // The query function returns an object with fetchAll.
            // We need to allow fetchAll to be mocked.
            // In the factory: query: jest.fn(() => ({ fetchAll: jest.fn() }))
            // So:
            const queryMock = getMockQuery();
            const fetchAllMock = jest.fn().mockResolvedValue({ resources: mockResources });
            queryMock.mockReturnValue({ fetchAll: fetchAllMock });

            const result = await CosmosDB.getScores('easy');

            expect(queryMock).toHaveBeenCalled();
            expect(fetchAllMock).toHaveBeenCalled();
            expect(result).toEqual(mockResources);
        });
    });

    describe('deleteScore', () => {
        it('should delete item', async () => {
            const deleteMock = jest.fn();
            containerInstance.item.mockReturnValue({ delete: deleteMock });

            await CosmosDB.deleteScore('123', 'hard');

            expect(containerInstance.item).toHaveBeenCalledWith('123', 'hard');
            expect(deleteMock).toHaveBeenCalled();
        });
    });
});
