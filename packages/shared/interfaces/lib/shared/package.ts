export interface PackageJSON {
    name: string;
    version: string;
    apps: string[];
    description?: string;
    main?: string;
    scripts?: {
        [key: string]: string;
    };
    author?: string;
    license?: string;
    dependencies?: {
        [key: string]: string;
    };
    devDependencies?: {
        [key: string]: string;
    };
    peerDependencies?: {
        [key: string]: string;
    };
    keywords?: string[];
    repository?: {
        type: string;
        url: string;
    };
    bugs?: {
        url: string;
    };
    homepage?: string;
    engines?: {
        [key: string]: string;
    };
    os?: string[];
    cpu?: string[];
    preferGlobal?: boolean;
    private?: boolean;
    publishConfig?: {
        registry?: string;
    };
    config?: {
        [key: string]: any;
    };
}

export interface WDEPackageConfig {
    name: string;
    version: string;
    entry: string;
    web?: string;
    webWorkers?: Record<string, string>
    webBundle?: {
        distDir: string;
    }
}