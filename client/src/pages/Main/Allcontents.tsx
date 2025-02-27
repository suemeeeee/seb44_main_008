import styled, { StyleSheetManager } from 'styled-components';

import SingleItem from '../../components/Features/SingleItem/SingleItem';

import isPropValid from '@emotion/is-prop-valid';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getAllItems } from '../../api/reviewItem/reviewItem';
import InfiniteScroll from 'react-infinite-scroller';
import ErrorPage from '../ErrorPage/ErrorPage';

const Allcontents = () => {
  const {
    data: allReviews,
    fetchNextPage,
    hasNextPage,
    isSuccess,
    isLoading,
    error,
  } = useInfiniteQuery(
    ['allItems'],
    ({ pageParam = 1 }) => getAllItems(pageParam),
    {
      getNextPageParam: currentPage => {
        const nextPage = currentPage?.pageInfo?.page + 1;
        return nextPage > currentPage?.pageInfo?.totalPages ? null : nextPage;
      },
    },
  );

  if (error) {
    return <ErrorPage />;
  }
  if (isSuccess) {
    return (
      <DefaultContainer>
        <div>
          <h1>전체 리뷰 게시글</h1>
        </div>
        <InfiniteScroll
          hasMore={hasNextPage}
          loadMore={() => {
            fetchNextPage();
          }}
        >
          <StaticContainer>
            {allReviews?.pages.map(pages => {
              return pages?.data.map(page => {
                return (
                  <StyleSheetManager
                    key={page.reviewBoardId}
                    shouldForwardProp={prop => isPropValid(prop)}
                  >
                    <SingleItem
                      reviewId={String(page.reviewBoardId)}
                      src={page.thumbnail}
                      title={page.title}
                      date={page.createdAt}
                      author={page?.user.nickname}
                      isMain={true}
                    ></SingleItem>
                  </StyleSheetManager>
                );
              });
            })}
          </StaticContainer>
        </InfiniteScroll>
        {isLoading && (
          <Loader>
            <p className="loadingTxt">
              <span>L</span>
              <span>o</span>
              <span>a</span>
              <span>d</span>
              <span>i</span>
              <span>n</span>
              <span>g</span>
            </p>
          </Loader>
        )}
      </DefaultContainer>
    );
  }
};

export default Allcontents;

const DefaultContainer = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;
  padding-top: 6.5rem;

  min-height: calc(100% - 8rem);
  box-sizing: border-box;

  & > div {
    display: flex;
    justify-content: space-between;
    & > h1 {
      font-size: 1.5rem;
      font-weight: 700;
      padding-left: 2rem;
      color: white;
    }
    & > a {
      color: white;
      padding-right: 2rem;
    }
  }
  @media (max-width: 500px) {
    & > div {
      & > h1 {
        font-size: 1.2rem;
        padding-left: 1.2rem;
      }
    }
  }
`;

const StaticContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;

  width: 100%;
  padding: 1rem;
  gap: 2.5rem;

  @media (max-width: 500px) {
    padding: 0.5rem;
    gap: 1.5rem;
  }
  @media (max-width: 850px) {
    padding: 0.3rem;
    gap: 1.9rem;
  }
`;

const Loader = styled.div`
  display: flex;
  justify-content: center !important;
  align-items: center;

  width: 100%;
  padding: 3rem;

  .loadingTxt {
    color: var(--white-color);
    text-transform: uppercase;
    span {
      animation: jumb 2s infinite;
      display: table-cell;
      padding: 0 0.2rem;
    }
    span:nth-child(1) {
      animation-delay: 0s;
    }
    span:nth-child(2) {
      animation-delay: 0.1s;
    }
    span:nth-child(3) {
      animation-delay: 0.2s;
    }
    span:nth-child(4) {
      animation-delay: 0.3s;
    }
    span:nth-child(5) {
      animation-delay: 0.4s;
    }
    span:nth-child(6) {
      animation-delay: 0.5s;
    }
    span:nth-child(7) {
      animation-delay: 0.6s;
    }
  }

  @keyframes jumb {
    0% {
      transform: translateY(0px);
      opacity: 0.2;
    }
    50% {
      transform: translateY(-5px);
      opacity: 0.5;
    }
    100% {
      transform: translateY(0px);
      opacity: 1;
    }
  }
`;
