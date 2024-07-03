import axios, { AxiosError } from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export interface Story {
  id: number;
  title: string;
  url: string;
  time: number;
  score: number;
  by: string;
  type: string;
}

export interface User {
  id: string;
  karma: number;
}

export class APIError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "APIError";
  }
}

const handleApiError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    throw new APIError(axiosError.message, axiosError.response?.status);
  }
  if (error instanceof Error) {
    throw new APIError(error.message);
  }
  throw new APIError("An unknown error occurred");
};

async function apiCall<T>(call: () => Promise<T>): Promise<T> {
  try {
    return await call();
  } catch (error) {
    handleApiError(error);
    throw new Error("Unreachable");
  }
}

function randomize(allStories: number[]): number[] {
  const randomStories = [];
  while (randomStories.length < 10 && allStories.length > 0) {
    const randomIndex = Math.floor(Math.random() * allStories.length);
    randomStories.push(allStories[randomIndex]);
    allStories.splice(randomIndex, 1);
  }
  return randomStories;
}

export async function getTopStories(): Promise<number[]> {
  return apiCall(async () => {
    const response = await axios.get<number[]>(`${API_URL}/topstories.json`);
    const allStories = response.data;
    const randomStories = randomize(allStories);
    return randomStories;
  });
}

export async function getStoryById(id: number): Promise<Story> {
  return apiCall(async () => {
    const response = await axios.get<Story>(`${API_URL}/item/${id}.json`);
    return response.data;
  });
}

export async function getUserById(id: string): Promise<User> {
  return apiCall(async () => {
    const response = await axios.get<User>(`${API_URL}/user/${id}.json`);
    return response.data;
  });
}
