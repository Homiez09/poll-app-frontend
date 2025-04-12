export interface PollOption {
    voteOption: string;
    voteCount: number;

}

export interface Poll {
    id?: number;
    question: string;
    options: PollOption[];
}
