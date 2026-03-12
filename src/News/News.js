import { useEffect, useState } from "react";
import axios from "axios";

const NEWS_URL = "https://lobby-display-sh6g.onrender.com/api/news";

const News = () => {

    const [news, setNews] = useState([]);

    useEffect(() => {

        const fetchNews = async () => {
            try {
                const res = await axios.get(NEWS_URL);
                setNews(res.data);
            } catch (err) {
                console.log("News fetch failed", err);
            }
        };

        fetchNews();

        const interval = setInterval(fetchNews, 300000); // refresh every 5 minutes

        return () => clearInterval(interval);

    }, []);

    const items = [...news, ...news];

    return (
        <div className="news-ticker">

            {/* <div className="news-label">חדשות</div> */}

            <div className="news-track">
                {items.map((n, i) => (
                    <span key={i} className="news-item">
                        {n.title}
                    </span>
                ))}
            </div>

        </div>
    );
};

export default News;