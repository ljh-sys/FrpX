export namespace main {
	
	export class Settings {
	    close_behavior: string;
	    autostart: boolean;
	    auto_start_frpc: boolean;
	
	    static createFrom(source: any = {}) {
	        return new Settings(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.close_behavior = source["close_behavior"];
	        this.autostart = source["autostart"];
	        this.auto_start_frpc = source["auto_start_frpc"];
	    }
	}
	export class logEntry {
	    index: number;
	    time: string;
	    level: string;
	    text: string;
	
	    static createFrom(source: any = {}) {
	        return new logEntry(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.index = source["index"];
	        this.time = source["time"];
	        this.level = source["level"];
	        this.text = source["text"];
	    }
	}

}

