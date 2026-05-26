import { languageTag, onSetLanguageTag } from "$lib/paraglide/runtime.js";

class I18nState {
    current = $state(languageTag());

    constructor() {
        if (typeof window !== "undefined") {
            onSetLanguageTag((tag) => {
                this.current = tag;
            });
        }
    }
}

export const i18nState = new I18nState();
