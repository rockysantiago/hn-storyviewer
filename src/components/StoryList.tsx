import { useMemo } from "react";
import { useQuery, useQueries } from "@tanstack/react-query";
import styled from "styled-components";
import { StoryItem } from "./StoryItem";
import {
  getTopStories,
  getStoryById,
  getUserById,
  Story,
  User,
  APIError,
} from "../services/api";

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const ErrorMessage = styled.div`
  background-color: #ff6b6b;
  color: white;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 20px;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
`;

const LoadingMessage = styled.div`
  text-align: center;
  font-size: 1.5rem;
  color: #333;
  padding: 20px;
  border-radius: 8px;
`;

export function StoryList() {
  const {
    data: topStoryIds = [],
    isLoading: isLoadingTopStories,
    error: topStoriesError,
  } = useQuery<number[], APIError>({
    queryKey: ["topStories"],
    queryFn: getTopStories,
    refetchOnWindowFocus: false,
  });

  const storyQueries = useQueries({
    queries: topStoryIds.map((id) => ({
      queryKey: ["story", id],
      queryFn: () => getStoryById(id),
      refetchOnWindowFocus: false,
    })),
  });

  const stories = useMemo(() => {
    const loadedStories = storyQueries
      .map((query) => query.data)
      .filter((story): story is Story => story !== undefined);
    return loadedStories.sort((a, b) => a.score - b.score);
  }, [storyQueries]);

  const isLoadingStories = storyQueries.some((query) => query.isLoading);
  const storiesError = storyQueries.find((query) => query.error)?.error as
    | APIError
    | undefined;

  const uniqueUserIds = useMemo(
    () => [...new Set(stories.map((story) => story.by))],
    [stories]
  );

  const userQueries = useQueries({
    queries: uniqueUserIds.map((id) => ({
      queryKey: ["user", id],
      queryFn: () => getUserById(id),
      refetchOnWindowFocus: false,
    })),
  });

  const users = useMemo(() => {
    return Object.fromEntries(
      userQueries
        .map((query) => query.data)
        .filter((user): user is User => user !== undefined)
        .map((user) => [user.id, user])
    );
  }, [userQueries]);

  const isLoadingUsers = userQueries.some((query) => query.isLoading);
  const usersError = userQueries.find((query) => query.error)?.error as
    | APIError
    | undefined;

  if (isLoadingTopStories || isLoadingStories || isLoadingUsers) {
    return (
      <LoadingContainer>
        <LoadingMessage>Loading...</LoadingMessage>
      </LoadingContainer>
    );
  }

  if (topStoriesError || storiesError || usersError) {
    const error = topStoriesError || storiesError || usersError;
    return (
      <ErrorMessage>
        Error: {error?.message} (Status: {error?.status})
      </ErrorMessage>
    );
  }

  return (
    <Container>
      {stories
        .filter((story) => story.type === "story")
        .map((story) => {
          const user = users[story.by];
          return <StoryItem key={story.id} story={story} user={user} />;
        })}
    </Container>
  );
}
