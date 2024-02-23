export class EntryNotFoundError extends Error {}

interface SimpleRecord<T> {
    data: T,
    date: Date,
}

export class SimpleCache<T> {
    private _mainMap : Map<string,SimpleRecord<T>>;
    private _cacheSize: number;
    private _defaultTTL: number;

    constructor(cacheSize: number, defaultTTL: number) {
        this._mainMap = new Map<string,SimpleRecord<T>>;
        this._cacheSize = cacheSize;
        this._defaultTTL = defaultTTL;
    }

    public has(key: string): boolean {
        return this._mainMap.has(key) && this.isValid(key);
    }

    /**
     * Get cached data with key param.
     * @param key Key for cache search
     * @returns data if it exists and is date valid or undefined otherwise
     */
    public get(key: string): T|undefined {
        if(!this.isValid(key)) {
            return undefined;
        }
        return this._mainMap.get(key)?.data;
    }

    public set(key: string, element : T): void {
        if(this._mainMap.size >= this._cacheSize) {
            const delKey = this._mainMap.keys().next().value;
            this._mainMap.delete(delKey);
        }
        this._mainMap.set(key, {data: element, date: new Date()});
    }

    public del(key: string): void {
        this._mainMap.delete(key);
    }

    isValid(key: string): boolean {
        return this._mainMap.has(key) && 
        this._mainMap.get(key)!.date.getTime()+this._defaultTTL >= new Date().getTime();
    }

    /*
        add refresh method if necessary
    */ 
}