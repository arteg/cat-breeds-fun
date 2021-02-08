/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import ReactDOM from 'react-dom';

import {
    makeStyles,
    useTheme,
    useMediaQuery,
    Button,
    GridList,
    GridListTile,
    GridListTileBar,
    LinearProgress,
    ThemeProvider,
    Typography
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import { theme } from './components/theme';

import { QueryClient, QueryClientProvider, useQueryClient } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

import { useBreeds } from './hooks/useBreeds';
import { useBreed } from './hooks/useBreed';
import { useBreedImages, useBreedReferenceImg } from './hooks/useBreedImages';

const useStyles = makeStyles((theme) => ({
    progressBar: {
        marginTop: theme.spacing(2)
    },
    gallery: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper
    },
    breedsGridList: {
        flexWrap: 'nowrap',
        // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
        transform: 'translateZ(0)'
    },
    breedsGridListTitle: {
        color: theme.palette.primary.light
    },
    breedsGridListTitleBar: {
        background:
            'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)'
    }
}));

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
        <ThemeProvider theme={theme}>
            <QueryClientProvider client={queryClient}>
                {breedId !== null ? (
                    <Breed breedId={breedId} setBreedId={setBreedId} />
                ) : (
                    <Breeds setBreedId={setBreedId} page={page} setPage={setPage} />
                )}
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </ThemeProvider>
    );
}

function Breeds({ setBreedId, page, setPage }) {
    const cl = useStyles();
    const { isLoading, isError, data, error, isFetching } = useBreeds({ page });

    const theme = useTheme();
    const isAtLeastMediumWidth = useMediaQuery(theme.breakpoints.up('md'));
    const isAtLeastLargeWidth = useMediaQuery(theme.breakpoints.up('lg'));

    let cols = 4;

    if (isAtLeastMediumWidth) {
        cols = 5;

        if (isAtLeastLargeWidth) {
            cols = 7;
        }
    }

    return (
        <div>
            <Typography variant="h1" align="center" color="primary">
                Cat Breeds
            </Typography>
            <div>
                {isLoading ? (
                    'Loading...'
                ) : isError ? (
                    <span>Error: {error.message}</span>
                ) : (
                    <>
                        <div className={cl.gallery}>
                            <GridList
                                cols={cols}
                                cellHeight={250}
                                spacing={8}
                                className={cl.breedsGridList}
                            >
                                {data.breeds.map((breed) => (
                                    <GridListTile
                                        key={breed.id}
                                        onClick={() => setBreedId(breed.id)}
                                        className={cl.breedsGridListTitle}
                                    >
                                        <img src={breed.image?.url} alt={breed.name} />
                                        <GridListTileBar
                                            title={breed.name}
                                            className={cl.breedsGridListTitleBar}
                                        />
                                    </GridListTile>
                                ))}
                            </GridList>
                        </div>
                        <Pagination
                            page={data.pagination.page + 1}
                            count={data.pagination.totalPages + 1}
                            hideNextButton
                            hidePrevButton
                            size="large"
                            onChange={(e, page) => setPage(page - 1)}
                        />
                        <div>
                            {isFetching ? (
                                <LinearProgress className={cl.progressBar} />
                            ) : (
                                ' '
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

function Pagination2({ count, page, limit, totalPages, isFirst, isLast, setPage }) {
    return (
        <nav>
            {new Array(totalPages + 1).fill(0).map((_, i) => {
                return (
                    <Button key={i} disabled={page === i} onClick={() => setPage(i)}>
                        {i}
                    </Button>
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
