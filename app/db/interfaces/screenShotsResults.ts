export interface ScreenShotResults {
    count:    number;
    next:     string;
    previous: string;
    results:  Result[];
}

export interface Result {
    image:  string;
    hidden: boolean;
}
