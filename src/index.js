/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import ReactDOM from 'react-dom';
import { QueryClient, QueryClientProvider, useQueryClient } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

import { useBreeds } from './hooks/useBreeds';
import { useBreed } from './hooks/useBreed';
import { useBreedImages, useBreedReferenceImg } from './hooks/useBreedImages';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5
        }
    }
});

function App() {
    const [breedId, setBreedId] = React.useState(null);
    const [page, setPage] = React.useState(0);

    return (
        <QueryClientProvider client={queryClient}>
            {breedId !== null ? (
                <Breed breedId={breedId} setBreedId={setBreedId} />
            ) : (
                <Breeds setBreedId={setBreedId} page={page} setPage={setPage} />
            )}
            <ReactQueryDevtools initialIsOpen={true} />
        </QueryClientProvider>
    );
}

function Breeds({ setBreedId, page, setPage }) {
    const queryClient = useQueryClient();

    const { isLoading, isError, data, error, isFetching } = useBreeds({ page });

    return (
        <div>
            <h1>Cat Breeds</h1>
            <div>
                {isLoading ? (
                    'Loading...'
                ) : isError ? (
                    <span>Error: {error.message}</span>
                ) : (
                    <>
                        <div style={{ display: 'flex' }}>
                            {data.breeds.map((breed) => (
                                <p key={breed.id}>
                                    <a
                                        onClick={() => setBreedId(breed.id)}
                                        href="#"
                                        style={
                                            // We can use the queryCache here to show bold links for
                                            // ones that are cached
                                            queryClient.getQueryData(['breed', breed.id])
                                                ? {
                                                      fontWeight: 'bold',
                                                      color: 'green'
                                                  }
                                                : {}
                                        }
                                    >
                                        {breed.name}
                                        <br />
                                        <BreedImage image={breed.image} name={breed.name} />
                                    </a>
                                </p>
                            ))}
                        </div>
                        <Pagination {...data.pagination} setPage={setPage} />
                        <div>{isFetching ? 'Updating...' : ' '}</div>
                    </>
                )}
            </div>
        </div>
    );
}

function Pagination({ count, page, limit, totalPages, isFirst, isLast, setPage }) {
    return (
        <nav>
            {new Array(totalPages + 1).fill(0).map((_, i) => {
                return (
                    <button key={i} disabled={page === i} onClick={() => setPage(i)}>
                        {i}
                    </button>
                );
            })}
        </nav>
    );
}

function Breed({ breedId, setBreedId }) {
    const { isLoading, isError, data, error, isFetching } = useBreed(breedId);

    return (
        <div>
            <div>
                <a onClick={() => setBreedId(null)} href="#">
                    Back
                </a>
            </div>
            {!breedId || isLoading ? (
                'Loading...'
            ) : isError ? (
                <span>Error: {error.message}</span>
            ) : (
                <>
                    <h1>{data.name}</h1>
                    <div>
                        <p>{data.description}</p>
                        <BreedImages breedId={data.id} />
                    </div>
                    <div>{isFetching ? 'Background Updating...' : ' '}</div>
                </>
            )}
        </div>
    );
}

function BreedImage({ image, name, width = 150, height = 200 }) {
    const src = image?.url ?? '//placekitten.com/100';

    return <img src={src} alt={`${name} cat pic`} width={width} />;
}

function BreedImages({ breedId }) {
    const { isLoading, isError, data, error } = useBreedImages(breedId);

    const { data: breedRefImg } = useBreedReferenceImg(breedId);

    const width = 200;

    if (isError) {
        return <span>Error: {error.message}</span>;
    }

    return (
        <div>
            <BreedImage
                image={breedRefImg}
                name={breedRefImg.name}
                width={width}
                key={breedRefImg.id}
            />
            {isLoading
                ? '...'
                : data
                      .slice(0, 4)
                      .map((image) => (
                          <BreedImage
                              image={image}
                              name={image.name}
                              width={width}
                              key={image.id}
                          />
                      ))}
        </div>
    );
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
