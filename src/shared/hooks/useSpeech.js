import { useCallback, useEffect, useRef, useState } from "react";

export function useSpeech() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const supported = !!SR;

    const defaultLang =
        (typeof navigator !== "undefined" && navigator.language) || "en-US";

    const [lang, setLang] = useState(defaultLang);
    const [listening, setListening] = useState(false);

    const recogRef = useRef(null);
    const activeRef = useRef(false);

    const finalAggRef = useRef("");
    const interimAggRef = useRef("");

    useEffect(() => {
        if (!supported) return;
        const r = new SR();
        r.interimResults = true;
        r.continuous = true;
        recogRef.current = r;

        return () => {
            try {
                r.onresult = null;
                r.onend = null;
                r.onerror = null;
                r.stop();
            } catch { }
        };
    }, [supported]);

    const start = useCallback(
        (onText, langOverride) => {
            if (!supported || !recogRef.current || listening) return;
            const r = recogRef.current;

            r.lang = langOverride || lang;
            activeRef.current = true;
            finalAggRef.current = "";
            interimAggRef.current = "";

            r.onresult = (e) => {
                if (!activeRef.current) return;

                let finalChunkThisEvent = "";
                const interimParts = [];

                for (let i = e.resultIndex; i < e.results.length; i++) {
                    const res = e.results[i];
                    const txt = (res[0] && res[0].transcript) || "";
                    if (res.isFinal) {
                        finalChunkThisEvent += (finalChunkThisEvent ? " " : "") + txt.trim();
                    } else {
                        interimParts.push(txt.trim());
                    }
                }

                if (finalChunkThisEvent) {
                    finalAggRef.current = (finalAggRef.current + " " + finalChunkThisEvent).trim();
                    interimAggRef.current = "";
                    onText?.(finalChunkThisEvent);
                } else {
                    interimAggRef.current = interimParts.join(" ").trim();
                }
            };

            r.onend = () => {
                if (activeRef.current) {
                    const flush = [finalAggRef.current, interimAggRef.current].filter(Boolean).join(" ").trim();
                    if (flush) onText?.(flush);
                }
                activeRef.current = false;
                setListening(false);
            };

            r.onerror = () => {
                activeRef.current = false;
                setListening(false);
            };

            try {
                r.start();
                setListening(true);
            } catch { }
        },
        [supported, lang, listening]
    );

    const stop = useCallback(() => {
        const r = recogRef.current;
        if (!r) return;

        activeRef.current = true;
        try { r.stop(); } catch { }

        const t = setTimeout(() => {
            if (listening) {
                try { r.abort(); } catch { }
                const flush = [finalAggRef.current, interimAggRef.current].filter(Boolean).join(" ").trim();
                setListening(false);
            }
            clearTimeout(t);
        }, 800);
    }, [listening]);

    return { supported, listening, start, stop, lang, setLang };
}
