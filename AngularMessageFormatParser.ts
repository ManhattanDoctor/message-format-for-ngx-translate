import {TranslateParser} from "@ngx-translate/core";

export class LanguageMessageFormatParser extends TranslateParser
{
	
	//--------------------------------------------------------------------------
	//
	//	Properties
	//
	//--------------------------------------------------------------------------

	private _language:string;
	private formatter:any;
	
	private formatters:Map<string,any>;
	private translations:Map<string,string>;
	
	//--------------------------------------------------------------------------
	//
	//	Public Methods
	//
	//--------------------------------------------------------------------------
	
	constructor()
	{
		super();
		this.formatters = new Map();
		this.translations = new Map();
	}
	
	//--------------------------------------------------------------------------
	//
	//	Private Methods
	//
	//--------------------------------------------------------------------------
	
	private getKey(expression:string,params?:any):string
	{
		let value = expression;
		if(params)
			value += JSON.stringify(params);
		return value;
	}
	
	//--------------------------------------------------------------------------
	//
	//	Public Methods
	//
	//--------------------------------------------------------------------------
	
	public interpolate(expression:string,params?:any):string
	{
		let key = this.getKey(expression,params);
		let text = this.translations.get(key);
		
		if(!text && this.formatter)
		{
			try
			{
				if(params)
					text = this.formatter.compile(expression)(params);
				else
					text = this.formatter.compile(expression)({});
				this.translations.set(key,text);
			}
			catch(error)
			{
				text = expression;
			}
		}
		
		return text;
	}

	public getValue(target:any,key:string):string
	{
		let keys = key.split(".");
		key = "";
		do
		{
			key += keys.shift();
			if(target && target[key] && (typeof target[key] === "object" || !keys.length))
			{
				target = target[key];
				key = "";
			}
			else if (!keys.length)
			{
				target = undefined;
			}
			else
			{
				key += ".";
			}
		}
		while (keys.length);
		
		return target;
	}
	
	//--------------------------------------------------------------------------
	//
	//	Public Properties
	//
	//--------------------------------------------------------------------------
	
	public get language():string
	{
		return this._language;
	}
	
	public set language(value:string)
	{
		if(value == this._language)
			return;
		
		this._language = value;
		this.translations.clear();
		
		this.formatter = this.formatters.get(this.language);
		if(!this.formatter)
		{
			this.formatter = new MessageFormat(this.language);
			this.formatters.set(this.language,this.formatter);
		}
	}
}

declare let MessageFormat:any;
