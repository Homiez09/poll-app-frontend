import { Poll } from "./poll.models";

export interface PollResponse {
  id: number;
  message: string;
  poll: Poll;
}
