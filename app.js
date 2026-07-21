(function(){
        let resolved = false;

        window.onYouTubeIframeAPIReady = function() {
            new YT.Player('live-player', {
                events: {
                    'onError': () => setOffline(),
                    'onStateChange': (e) => {
                        if (e.data === YT.PlayerState.PLAYING || e.data === YT.PlayerState.BUFFERING) {
                            setOnline();
                        }
                    }
                }
            });
        };

        function setOnline(){
            if (resolved) return;
            resolved = true;
        }

        function setOffline(){
            if (resolved) return;
            resolved = true;
            document.getElementById('live-player').style.display = 'none';
            document.getElementById('live-fallback').style.display = 'flex';
        }
    })();
    (function(){
        const toggle = document.getElementById('theme-toggle');
        const icon = document.getElementById('theme-icon');
        const root = document.documentElement;
        const stored = localStorage.getItem('theme');
        const prefersDarkMedia = window.matchMedia('(prefers-color-scheme: dark)');
        const prefersDark = prefersDarkMedia.matches;

        function setIcon(mode){
            if(!icon) return;
            icon.textContent = mode === 'dark' ? 'dark_mode' : 'light_mode';
        }

        function applyTheme(theme){
            if(theme === 'dark') root.setAttribute('data-theme','dark');
            else if(theme === 'light') root.setAttribute('data-theme','light');
            else root.removeAttribute('data-theme');
            setIcon(theme === 'dark' ? 'dark' : 'light');

            // Fallback: set inline CSS variables so theme takes effect immediately
            const cs = getComputedStyle(root);
            const lbg = cs.getPropertyValue('--light-bg').trim() || '#ffffff';
            const ltext = cs.getPropertyValue('--light-text').trim() || '#0b1220';
            const lheader = cs.getPropertyValue('--light-header').trim() || '#eef2ff';
            const dbg = cs.getPropertyValue('--dark-bg').trim() || '#071124';
            const dtext = cs.getPropertyValue('--dark-text').trim() || '#e6eef8';
            const dheader = cs.getPropertyValue('--dark-header').trim() || '#0b1b2b';

            if(theme === 'dark'){
                root.style.setProperty('--bg', `linear-gradient(180deg, ${dbg}, ${dheader})`);
                root.style.setProperty('--text', dtext);
                root.style.setProperty('--header-bg', `linear-gradient(0deg, ${dheader}, transparent)`);
            } else {
                root.style.setProperty('--bg', `linear-gradient(180deg, ${lbg}, ${lheader})`);
                root.style.setProperty('--text', ltext);
                root.style.setProperty('--header-bg', `linear-gradient(0deg, ${lheader}, transparent)`);
            }
        }

        const initial = stored || (prefersDark ? 'dark' : 'light');
        applyTheme(initial);

        toggle.addEventListener('click', ()=>{
            const current = root.getAttribute('data-theme') || (prefersDark ? 'dark' : 'light');
            const next = current === 'dark' ? 'light' : 'dark';
            applyTheme(next);
            localStorage.setItem('theme', next);
        });

        prefersDarkMedia.addEventListener('change', e => {
            if(!localStorage.getItem('theme')) applyTheme(e.matches ? 'dark' : 'light');
        });
    })();
fetch('content.md')
    .then(res => res.text())
    .then(markdown => {
        document.getElementById('rules-content').innerHTML = marked.parse(markdown);
    })
    .catch(err => {
        document.getElementById('rules-content').innerHTML = '<p>Nepodarilo sa načítať obsah.</p>';
        console.error(err);
    });