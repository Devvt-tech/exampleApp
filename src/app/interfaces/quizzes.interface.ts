
export interface IQuizz {
    id: number;
    name: string;
    quiz_rating: IQuizzRating[];
    experience: string;
    textInterval: string;
}

export interface IQuizzRating {
    rating: string;
    percRating: number;
    date: string;
}

export interface IQuestion {
    id: number;
    quiz_id: number,
    name: string;
    answers: IAnswer[];
}

export interface IAnswer {
    id: number;
    question_id: number;
    name: string;
    status: number;
}

export interface ISaveQuestion {
    id: number;
    answer_id: number;
}

export interface ISaveQuizzRequest {
    quizz_id: number;
    questions: ISaveQuestion[]
}

export interface ISaveQuizzResponse {
    ratings: string;
}
