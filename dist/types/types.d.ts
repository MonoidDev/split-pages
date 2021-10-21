export interface SplitPagesInputOptions {
    pageRoot: string;
    chunkPrefixes?: string[];
    outDir?: string;
    redirections?: {
        [path in string]: string;
    };
}
export interface SplitPagesOptions extends SplitPagesInputOptions {
    chunkPrefixes: string[];
    outDir: string;
}
export interface Page {
    source: string;
    url: string;
    componentName: string;
    importName: string;
    isDirectory: boolean;
}
export interface Chunk {
    prefix: string;
    path: string;
    pages: Page[];
    importName: string;
    isLazy: boolean;
}
