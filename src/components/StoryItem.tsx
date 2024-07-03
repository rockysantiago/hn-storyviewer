import { formatDistanceToNow } from "date-fns";
import styled from "styled-components";
import dummyImage from "../assets/dummy.png";
import { Story, User } from "../services/api";

const StoryItemWrapper = styled.div`
  background-color: #f6f6ef;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const StoryImage = styled.img`
  width: 100%;
  max-width: 150px;
  height: auto;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 10px;

  @media (min-width: 768px) {
    margin-right: 20px;
    margin-bottom: 0;
  }
`;

const StoryContent = styled.div`
  flex: 1;
`;

const StoryTitle = styled.h2`
  font-size: 1.2rem;
  margin: 0 0 10px;

  a {
    color: #1a1a1a;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const StoryUrl = styled.span`
  font-size: 0.8rem;
  color: #666;
  margin-left: 0.5em;
`;

const StoryMeta = styled.p`
  font-size: 0.9rem;
  color: #666;
  margin: 0;
`;

function shortenUrl(url: string): string {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.hostname;
  } catch (error) {
    console.error("Invalid URL:", url);
    return "Invalid URL";
  }
}

export function StoryItem({ story, user }: { story: Story; user: User }) {
  return (
    <StoryItemWrapper>
      <StoryImage src={dummyImage} alt="Default thumbnail" />
      <StoryContent>
        <StoryTitle>
          <a href={story.url} target="_blank" rel="noopener noreferrer">
            {story.title}
          </a>
          <a href={story.url} target="_blank" rel="noopener noreferrer">
            <StoryUrl>({shortenUrl(story.url)})</StoryUrl>
          </a>
        </StoryTitle>
        <StoryMeta>
          {`${story.score} points by ${story.by} (Karma: ${
            user?.karma ?? "Unknown"
          }) ${formatDistanceToNow(new Date(story.time * 1000), {
            addSuffix: true,
          })}`}
        </StoryMeta>
      </StoryContent>
    </StoryItemWrapper>
  );
}
