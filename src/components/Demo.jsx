import { useEffect, useState } from "react";
import { linkIcon, loader, tick, copy } from "../assets";
import { useLazyGetSummaryQuery } from "../services/article";
function Demo() {
  const [article, setArticle] = useState({
    url: "",
    summary: "",
  });
  const [allArticles, setAllArticles] = useState([]);
  useEffect(() => {
    const articlesfromlocalStorage = JSON.parse(
      localStorage.getItem("articles")
    );
    if (articlesfromlocalStorage) {
      setAllArticles(articlesfromlocalStorage);
    }
  }, []);
  const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery();
  async function handleSubmit(e) {
    e.preventDefault();
    const { data } = await getSummary({ articleUrl: article.url });
    if (data?.summary) {
      const newArticle = { ...article, summary: data.summary };
      const updatedArticles = [newArticle, ...allArticles];
      setArticle(newArticle);
      setAllArticles(updatedArticles);
      localStorage.setItem("articles", JSON.stringify(updatedArticles));
    }
  }
  return (
    <section className="mt-16 w-full max-w-xl">
      <div className="flex w-full flex-col gap-2">
        <form
          onSubmit={handleSubmit}
          className="relative flex justify-center items-center"
        >
          <img src={linkIcon} className="absolute left-0 my-2 ml-3 w-5" />
          <input
            type="url"
            placeholder="Enter a URL"
            value={article.url}
            required
            onChange={(e) => setArticle({ ...article, url: e.target.value })}
            className="url_input peer"
          />
          <button
            type="submit"
            className="submit_btn peer-focus:border-gray-700 peer-focus:text-gray-700"
          >
            ↵
          </button>
        </form>
        <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
          {allArticles.map((item, index) => (
            <div
              className="link_card"
              key={index}
              onClick={() => setArticle(item)}
            >
              <div className="copy_btn">
                <img
                  src={copy}
                  alt="copy_icon"
                  className="w-[40%] h-[40%] object-contain"
                />
              </div>
              <p className="flex-1 font-satoshi text-blue-700 font-medium text-sm truncate">
                {item.url}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="my-10 max-w-full flex justify-center items-center">
        {isFetching ? (
          <img src={loader} className="w-20 h-20 object-contain" />
        ) : error ? (
          <p className="font-inter font-bold text-black text-center">
            Well, that wasn't supposed to happen
            <br />
            <span className="font-sathosi font-normal text-gray-700">
              {error?.data?.error}
            </span>
          </p>
        ) : (
          article.summary && (
            <div className="flex flex-col gap-3">
              <h2 className="font-sathosi font-bold text-xl text-gray-600">
                Article <span className="blue_gradient">Summary</span>
              </h2>
              <div className="summary_box">
                <p className="font-inter text-sm text-gray-700">
                  {article.summary}
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
}

export default Demo;
