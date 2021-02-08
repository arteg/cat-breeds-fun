import { useQuery, useQueryClient } from 'react-query';
import { api } from '../api';

const getBreeds = async ({ queryKey }) => {
    debugger;
    const { data, headers } = await api.get('/breeds', {
        params: {
            limit: 7,
            page: queryKey[1]
        }
    });

    const count = Number(headers['pagination-count']);
    const page = Number(headers['pagination-page']);
    const limit = Number(headers['pagination-limit']);
    const totalPages = Math.floor(count / limit);

    return {
        breeds: data,
        pagination: {
            count,
            page,
            limit,
            totalPages,

            isFirst: page === 0,
            isLast: page === totalPages
        }
    };
};

export function useBreeds({ page }) {
    const query = useQuery(['breeds', page], getBreeds, { keepPreviousData: true });

    const queryClient = useQueryClient();

    if (query.data?.breeds) {
        for (let breed of query.data.breeds) {
            queryClient.setQueryData(['breed', breed.id], breed);
            queryClient.setQueryData(['breedRefImg', breed.id], {
                ...breed.image,
                name: breed.name
            });
        }
    }

    return query;
}
