import { useQuery } from 'react-query';
import { api } from '../api';
import { useBreed } from './useBreed';

const fetchBreedImagesById = async (breedId, limit = 10) => {
    const { data } = await api.get('/images/search', {
        params: {
            breed_id: breedId,
            limit
        }
    });

    if (!data || !data.length) {
        return [];
    }

    return data.map(({ id, url, width, height }) => ({ id, url, width, height }));
};

export function useBreedImages(breedId) {
    const { data: breedRefImg } = useBreedReferenceImg(breedId);

    return useQuery(['breedImages', breedId], async () => {
        const data = await fetchBreedImagesById(breedId);

        return breedRefImg?.id ? data.filter((image) => image.id !== breedRefImg.id) : data;
    });
}

const fetchBreedImageById = async (imageId) => {
    const {
        data: { id, url, width, height, breeds }
    } = await api.get(`/images/${imageId}`);

    return {
        id,
        url,
        width,
        height,
        name: breeds?.[0]?.name
    };
};

export function useBreedReferenceImg(breedId) {
    const { data: breed } = useBreed(breedId);

    return useQuery(
        ['breedRefImg', breedId],
        () => fetchBreedImageById(breed.reference_image_id),
        {
            enabled: breed !== undefined,
            staleTime: Infinity
        }
    );
}
