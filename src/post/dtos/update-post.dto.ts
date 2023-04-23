export interface UpdatePostDto{
    name?: string;
    description?: string;
    imageCoverLink?: string;
    ration?: number;
    time?: number;
    ingredients?: string[];
    steps?: [{
        content: string;
        imageLink?: string;
    }];
}