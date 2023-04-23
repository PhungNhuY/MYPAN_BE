export interface StepDto{
    content: string;
    imageLink?: string;
}

export interface CreatePostDto{
    name: string;
    description?: string;
    imageCoverLink?: string;
    ration?: number;
    time?: number;
    ingredients: string[];
    steps: [{
        content: string;
        imageLink?: string;
    }];
}