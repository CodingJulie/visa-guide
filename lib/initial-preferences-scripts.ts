export const themeInitScript = `
(function () {
    try {
        var root = document.documentElement;
        var stored = localStorage.getItem('theme');
        var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        var resolved = stored === 'dark' || stored === 'light'
            ? stored
            : prefersDark
              ? 'dark'
              : 'light';

        if (resolved === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    } catch (e) {}
})();
`.trim();

export const languageInitScript = `
(function () {
    try {
        var lang = 'en';
        var saved = localStorage.getItem('i18nextLng');
        if (saved === 'en' || saved === 'ru') {
            lang = saved;
        } else {
            var cookieMatch = document.cookie.match(/(?:^|; )i18nextLng=([^;]*)/);
            var cookieLang = cookieMatch ? decodeURIComponent(cookieMatch[1]) : '';
            if (cookieLang === 'en' || cookieLang === 'ru') {
                lang = cookieLang;
            } else {
                var langs = navigator.languages && navigator.languages.length
                    ? navigator.languages
                    : [navigator.language];
                for (var i = 0; i < langs.length; i++) {
                    var code = (langs[i] || '').split('-')[0].toLowerCase();
                    if (code === 'ru') {
                        lang = 'ru';
                        break;
                    }
                    if (code === 'en') {
                        lang = 'en';
                        break;
                    }
                }
            }
        }
        document.documentElement.lang = lang;
        window.__INITIAL_LANG__ = lang;
    } catch (e) {}
})();
`.trim();
