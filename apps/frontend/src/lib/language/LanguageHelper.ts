import { DEFAULT_LANGUAGE } from "@/lib/Constants";
import { StringNumberDictionary } from "@/types/SharedInterface";
import english from "./English.json";
import hindi from "./Hindi.json";
import { isNonEmpty } from "../Utils";
import store from "@/store/Store";
import { storeLanguage } from "@/store/AppConfigReducer";

const dictionaryList = {
    english,
    hindi,
};

const languageOptions = Object.keys(dictionaryList);

type selectedLangType = keyof typeof dictionaryList;

type AppTextProps = {
  readonly textName: string;
  readonly textModule?: string;
  readonly append?: StringNumberDictionary;
};

const updateAppLanguage = (lang: string) => {
    store.dispatch(storeLanguage(lang));
};

const setLanguage = (lang: string) => {
    if (lang && languageOptions.includes(lang.toLowerCase()))
        updateAppLanguage(lang.toLowerCase());
};


const getText = (textName: string, textModule?: string) => {

    const selectedLang = languageOptions[ 0 ];
    const dictionary: Record<string, any> = dictionaryList[ selectedLang as selectedLangType ];

    if (textModule)
        return dictionary[ textModule ] && dictionary[ textModule ][ textName ] ?
            dictionary[ textModule ][ textName ]
            : null;

    return dictionary[ textName ] ? dictionary[ textName ] : null;
};

const AppText = (props: AppTextProps) => {
    const { textName, textModule, append } = props;
    const selectedLang = languageOptions[ 0 ];
    const dictionary: Record<string, any> = dictionaryList[ selectedLang as selectedLangType ];
    let result: any = "";

    if (textModule)
        result = dictionary[ textModule ] && dictionary[ textModule ][ textName ] ?
            dictionary[ textModule ][ textName ]
            : textName ? textName : "";
    else
        result = dictionary[ textName ] ? dictionary[ textName ] : textName ? textName : "";

    if (append && isNonEmpty(append)) {
        for (const item in append) {
            result = result.replace(`{${item}}`, append[ item ] as string);
        }
    }

    if (isNonEmpty(result))
        result = result.replace(/{param\d}/g, "-");

    return result;
};

export { AppText, getText, languageOptions, DEFAULT_LANGUAGE, setLanguage };
