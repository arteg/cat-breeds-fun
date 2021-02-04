import { useQuery, useQueryClient } from 'react-query';
import { api } from '../api';

const fetchBreedById = async (breedId) => {
    const { data } = await api.get('/images/search', {
        params: {
            breed_id: breedId
        }
    });

    const ret = data?.[0]?.breeds?.[0] ?? {};

    console.log('breed data:', ret);

    return ret;
};

export function useBreed(breedId) {
    const queryClient = useQueryClient();

    return useQuery(['breed', breedId], () => {
        debugger;
        console.log('foo2', breedId);
        const data = queryClient.getQueryData(['breed', breedId]);

        return Promise.resolve(data) ?? fetchBreedById(breedId);
    });
}
