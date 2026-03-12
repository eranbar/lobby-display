import { useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import axios from "axios";

const MESSAGES_URL = "https://lobby-display-sh6g.onrender.com/messages";

const Messages = ({ messages, setMessages, showAdmin }) => {

    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        align: "center",
        dragFree: false
    });

    // fetch messages
    useEffect(() => {
        const fetchMessages = async () => {
            const res = await axios.get(MESSAGES_URL);
            setMessages(prev => {
                const newData = res.data;

                if (
                    prev.length === newData.length &&
                    prev.every((msg, index) => msg._id === newData[index]._id)
                ) {
                    return prev; // nothing changed
                }

                return newData;
            });
        };
        if (!showAdmin) {
            fetchMessages();
        }

        const interval = setInterval(fetchMessages, 15000);

        return () => clearInterval(interval);

    }, [showAdmin, setMessages]);

    // autoplay every 10 seconds
    useEffect(() => {
        if (!emblaApi) return;

        const interval = setInterval(() => {
            emblaApi.scrollNext();
        }, 10000);

        return () => clearInterval(interval);
    }, [emblaApi]);

    // scale center slide
    const onSelect = useCallback(() => {
        if (!emblaApi) return;

        const slides = emblaApi.slideNodes();
        const selected = emblaApi.selectedScrollSnap();

        slides.forEach((slide, index) => {
            if (index === selected) {
                slide.classList.add("is-center");
            } else {
                slide.classList.remove("is-center");
            }
        });
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;

        emblaApi.on("select", onSelect);
        onSelect();
    }, [emblaApi, onSelect]);

    return (
        <div className="embla">
            <div className="embla__viewport" ref={emblaRef}>
                <div className="embla__container">
                    {messages.map((msg) => (
                        <div className="embla__slide" key={msg._id}>
                            <div className="message-card">
                                {msg.text.split("\n").map((line, i) => (
                                    <div key={i}>{line}</div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Messages;